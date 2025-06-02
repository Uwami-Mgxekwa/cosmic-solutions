import '../css/register.style.css'
import { headerActions, loadHeader } from '../components/header';
import { popUp, popupActions } from '../components/popup';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { register } from '../lib/register';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import Endpoints from '../lib/endpoint';

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
              <input type="text" id="pc-num" placeholder="eg:001"/>
              <label for="room-num">Room Number:</label>
              <input type="text" id="room-num" placeholder="eg:1"/>
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
registerPage.innerHTML += loadSpinner();
headerActions();
sidebarActions();

const submitBtn = document.getElementById("btn-submit");
const cancleBtn = document.getElementById("btn-cancel");
const computerNumber = document.getElementById("pc-num") as HTMLInputElement;
const roomNumber = document.getElementById("room-num") as HTMLInputElement;
let message = document.getElementById("message") as HTMLParagraphElement;

submitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  spinnerActionsAdd();
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
    password: computerNumber.value + roomNumber.value
  }
  const res = await register(Endpoints.registerUrl, data)
  if (!res?.ok) {
    return;
  } else {
    popUp("Success", `<p>PC: ${computerNumber.value}</p><br><p>Room: ${roomNumber.value}</p>`)
    popupActions();
  }
  spinnerActionsRemove()
});

cancleBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "../pages/dashboard.admin.html"
})
