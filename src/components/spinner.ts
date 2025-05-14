import "../css/spinner.style.css";

export const loadSpinner = () => {
  return (
    `<span id="loader"></span>`
  )
}

export const spinnerActionsAdd = () => {
  const loader = document.getElementById("loader");
  loader?.classList.add("loader");

}

export const spinnerActionsRemove = () => {
  const loader = document.getElementById("loader");
  loader?.classList.remove("loader");
}
