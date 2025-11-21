export function crearTareaTemplate(tarea, color) {
  return `
  <input type="checkbox" class="checkbox" ${tarea.completada ? "checked" : ""}>
    <p class="texto-tarea">
      <span class="cat-badge" style="color: ${color}; border: 2px solid ${color}">${
    tarea.categoria
  }</span> ${tarea.texto}
    </p>
    <input type="text" class="editor" value="${tarea.texto}" maxlength="100">
    <div class="acciones">
      <button class="btn btn-small btn-primary btn-editar">Editar</button>
      <button class="btn btn-small btn-danger btn-eliminar">Eliminar</button>
    </div>
      `;
}
