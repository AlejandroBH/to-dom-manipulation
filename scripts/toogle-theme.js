const toogleThemeBtn = document.getElementById("btn-theme");
const theme = document.querySelector("[data-theme]");

const currentIcon = toogleThemeBtn.children[0];
const saveTheme = localStorage.getItem("data-theme") || "light";

let setIcon = saveTheme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";

theme.setAttribute("data-theme", saveTheme);
currentIcon.setAttribute("class", setIcon);

toogleThemeBtn.addEventListener("click", () => {
  const currentTheme = localStorage.getItem("data-theme") || "light";

  if (currentTheme === "dark") {
    saveToLocalStorage("light");
    currentIcon.setAttribute("class", "fa-solid fa-moon");
  } else {
    saveToLocalStorage("dark");
    currentIcon.setAttribute("class", "fa-solid fa-sun");
  }
});

function saveToLocalStorage(themeName) {
  localStorage.setItem("data-theme", themeName);
  theme.setAttribute("data-theme", themeName);
}
