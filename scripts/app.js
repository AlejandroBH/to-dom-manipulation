// Importaciones
import listaCategorias from '../json/categorias.json' with { type: "json" };
import { crearTareaTemplate } from './templates.js';

// Elementos del DOM
const inputTarea = document.getElementById("input-tarea");
const btnAgregar = document.getElementById("btn-agregar");
const btnLimpiar = document.getElementById("btn-limpiar-completadas");
const listaTareas = document.getElementById("lista-tareas");
const emptyState = document.querySelector(".empty-state");
const filtroBtns = document.querySelectorAll(".filtro-btn");
const searchEngine = document.getElementById("searchEngine");
const categorySelect = document.getElementById("category");
const stats = {
  total: document.getElementById("total-tareas"),
  completadas: document.getElementById("tareas-completadas"),
  pendientes: document.getElementById("tareas-pendientes"),
};

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let filtroActual = "todas";

// Carga lista de categorias dinamicamente
listaCategorias.forEach((cat) => {
  const option = document.createElement("option");

  option.textContent = cat.name;
  option.setAttribute("value", cat.name.toLowerCase());
  categorySelect.appendChild(option);
});

// Funciones de utilidad
function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function actualizarEstadisticas() {
  const total = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const pendientes = total - completadas;

  stats.total.textContent = total;
  stats.completadas.textContent = completadas;
  stats.pendientes.textContent = pendientes;

  btnLimpiar.style.display = completadas > 0 ? "block" : "none";
}

function crearElementoTarea(tarea) {
  const div = document.createElement("div");
  const indexCategoria = listaCategorias.findIndex(
    (cat) => cat.name.toLowerCase() === tarea.categoria
  );
  div.className = `tarea ${tarea.completada ? "completed" : ""}`;
  div.dataset.id = tarea.id;

  const { color } = listaCategorias[indexCategoria];
  div.innerHTML = crearTareaTemplate(tarea, color);
  return div;
}

listaTareas.addEventListener("click", (item) => {
  const element = item.target;
  const clase = element.getAttribute("class");

  if (clase.includes("checkbox")) {
    const id = element.parentElement.getAttribute("data-id");
    completarTarea(element, id);
  }

  if (clase.includes("btn-editar")) {
    const id = element.parentElement.parentElement.getAttribute("data-id");
    editarTarea(element, id);
  }

  if (clase.includes("btn-eliminar")) {
    const id = element.parentElement.parentElement.getAttribute("data-id");
    eliminarTarea(element, id);
  }
});

function completarTarea(element, id) {
  const tarea = tareas.find((item) => item.id === +id);
  const div = element.parentElement;

  tarea.completada = element.checked;
  div.classList.toggle("completed", tarea.completada);
  guardarTareas();
  actualizarEstadisticas();
  filtrarTareas();
}

function editarTarea(element, id) {
  const tarea = tareas.find((item) => item.id === +id);
  const div = element.parentElement.parentElement;
  const editor = div.querySelector(".editor");
  const btnEditar = div.querySelector(".btn-editar");

  if (div.classList.contains("editando")) {
    // Guardar cambios
    const nuevoTexto = editor.value.trim();

    if (nuevoTexto) {
      tarea.texto = nuevoTexto;
      div.querySelector(".texto-tarea").textContent = nuevoTexto;
      guardarTareas();
    }
    div.classList.remove("editando");
    btnEditar.textContent = "Editar";
  } else {
    // Entrar en modo edición
    div.classList.add("editando");
    editor.focus();
    editor.select();
    btnEditar.textContent = "Guardar";
  }

  guardarConEnter(editor, btnEditar, div, tarea);
}

function eliminarTarea(element, id) {
  const tarea = tareas.find((item) => item.id === +id);
  const div = element.parentElement.parentElement;

  if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
    div.classList.add("removing");
    setTimeout(() => {
      tareas = tareas.filter((t) => t.id !== tarea.id);
      div.remove();
      guardarTareas();
      actualizarEstadisticas();
      mostrarEmptyState();
    }, 300);
  }
}

// Guardar al presionar Enter en el editor
function guardarConEnter(editor, btnEditar, div, tarea) {
  editor.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      btnEditar.click();
    } else if (e.key === "Escape") {
      div.classList.remove("editando");
      editor.value = tarea.texto;
      btnEditar.textContent = "Editar";
    }
  });
}

function mostrarTareas() {
  listaTareas.innerHTML = "";
  let tareasFiltradas = tareas;

  // Filtra lista de tareas segun criterio de busqueda
  if (searchEngine.value !== "") {
    tareasFiltradas = tareas.filter(
      (t) =>
        t.texto.includes(searchEngine.value) ||
        t.categoria.includes(searchEngine.value)
    );
  }

  switch (filtroActual) {
    case "pendientes":
      tareasFiltradas = tareasFiltradas.filter((t) => !t.completada);
      break;
    case "completadas":
      tareasFiltradas = tareasFiltradas.filter((t) => t.completada);
      break;
  }

  if (tareasFiltradas.length === 0) {
    mostrarEmptyState();
    return;
  }

  tareasFiltradas.forEach((tarea) => {
    const elementoTarea = crearElementoTarea(tarea);
    listaTareas.appendChild(elementoTarea);
  });
}

function mostrarEmptyState() {
  if (tareas.length === 0) {
    listaTareas.innerHTML = "";
    listaTareas.appendChild(emptyState);
  }
}

function filtrarTareas() {
  mostrarTareas();
}

searchEngine.addEventListener("keyup", () => {
  mostrarTareas();
});

// Event listeners principales
btnAgregar.addEventListener("click", (e) => {
  e.preventDefault();
  const texto = inputTarea.value.trim();
  const categoria = categorySelect.value;

  if ((texto, categoria) && texto !== "") {
    const nuevaTarea = {
      id: Date.now(),
      texto: texto,
      completada: false,
      categoria: categoria,
      fechaCreacion: new Date().toISOString(),
    };

    tareas.push(nuevaTarea);
    inputTarea.value = "";
    guardarTareas();
    actualizarEstadisticas();

    if (filtroActual === "todas" || filtroActual === "pendientes") {
      const elementoTarea = crearElementoTarea(nuevaTarea);
      if (listaTareas.contains(emptyState)) {
        listaTareas.innerHTML = "";
      }
      listaTareas.appendChild(elementoTarea);
    }
  }
});

// Agregar tarea al presionar Enter
inputTarea.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    btnAgregar.click();
  }
});

// Filtros
filtroBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filtroActual = btn.dataset.filtro;
    filtrarTareas();
  });
});

// Limpiar tareas completadas
btnLimpiar.addEventListener("click", () => {
  if (
    confirm(
      "¿Estás seguro de que quieres eliminar todas las tareas completadas?"
    )
  ) {
    tareas = tareas.filter((t) => !t.completada);
    guardarTareas();
    actualizarEstadisticas();
    filtrarTareas();
  }
});

// Inicialización
actualizarEstadisticas();
mostrarTareas();
