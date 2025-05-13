import '../css/popup.style.css'

const container = document.createElement("div");

const loadPopup = (title: string, content: any) => {
  return (
    container.innerHTML = `
    <div class="popup">
      <div class="popup_content">
        <h1 class="popup_title">${title}</h1>
        <div class="content_wrapper">
          ${content}
        </div>
        <div class="button_wrapper">
          <button id="closepopup">Close</button> 
        </div>
      </div>

    </div>
`
  )
}

export const popupActions = () => {
  const app = document.getElementById("app") as HTMLElement;
  const popup = document.querySelector(".popup") as HTMLElement;
  const closepopup = document.getElementById("closepopup");
  closepopup?.addEventListener("click", () => {
    app.removeChild(popup)
    window.location.reload();
  });
}

export const popUp = (title: string, content: any) => {
  const app = document.getElementById("app") as HTMLElement;
  app.innerHTML += loadPopup(title, content);

}
