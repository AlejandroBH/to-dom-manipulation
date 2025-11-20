const toogleThemeBtn = document.getElementById("btn-theme");
const theme = document.querySelector("[data-theme]");

theme.setAttribute("data-theme", localStorage.getItem("data-theme"));

toogleThemeBtn.addEventListener("click", () => {
  const currentTheme = theme.getAttribute("data-theme");
  const currentIcon = toogleThemeBtn.children[0];

  if (currentTheme === "dark") {
    saveToLocalStorage("light");
    currentIcon.setAttribute("class", "fa-solid fa-sun");
  } else {
    saveToLocalStorage("dark");
    currentIcon.setAttribute("class", "fa-solid fa-moon");
  }
});

function saveToLocalStorage(themeName) {
  localStorage.setItem("data-theme", themeName);
  theme.setAttribute("data-theme", themeName);
}
