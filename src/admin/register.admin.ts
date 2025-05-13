import '../css/register.style.css'
import { headerActions, loadHeader } from '../components/header';
import { popUp, popupActions } from '../components/popup';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { storeData } from '../lib/local-storage';

const registerPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonAdmin = localStorage.getItem("admin") as string;

if (!jsonAdmin) {
  localStorage.clear();
  window.location.href = "/"
}

const adminDetails = JSON.parse(jsonAdmin);

export const loadRegisterPage = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="panel">
          <h1>Register A Computer</h1>
          <div class="panel-info">
            <h2>[ Admin: ${adminDetails.email} ]</h2>
          </div>
        </div>
        <div class="form-container">
          <form>
            <div class="input-wrapper">
              <label for="pc-num">Computer Number:</label>
              <input type="text" id="pc-num"/>
              <label for="room-num">Room Number:</label>
              <input type="text" id="room-num"/>
            </div>
            <div class="action-btns">
              <button class="btn-submit" id="btn-submit">Submit Report</button>
              <button class="btn-cancel" id="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
        <div class="arlet">
          <p id="message"></p>
        </div>
      </div>
    `
  )
}

registerPage.innerHTML += loadHeader("Support Request Portal");
registerPage.innerHTML += loadSidebar();
registerPage.innerHTML += loadRegisterPage();
headerActions();
sidebarActions();

const submitBtn = document.getElementById("btn-submit");
const cancleBtn = document.getElementById("btn-cancel");
const computerNumber = document.getElementById("pc-num") as HTMLInputElement;
const roomNumber = document.getElementById("room-num") as HTMLInputElement;
let message = document.getElementById("message") as HTMLParagraphElement;

submitBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  if (computerNumber.value == "" && roomNumber.value == "" || computerNumber.value == "" || roomNumber.value == "") {
    message.innerText = "Make sure to complete your registration!"
    const timout = setTimeout(() => {
      message.innerText = ""
      clearTimeout(timout)
    }, 3000)
    return;
  }

  const data = {
    pc: computerNumber.value,
    room: roomNumber.value,
  }
  console.log(data);
  popUp("Success", `<p>PC: cs-${computerNumber.value}</p><br><p>Room: ${roomNumber.value}</p>`)
  popupActions();
});

cancleBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "../pages/dashboard.admin.html"
})
