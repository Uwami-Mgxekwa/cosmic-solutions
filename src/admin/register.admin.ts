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
<div class="container">
  <div class="wrapper">
    <div class="panel">
      <div class="panel-header">
        <h1>Register A Computer</h1>
        <button id="btn-close"> &lt; Home</button>
      </div>
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
          <button class="btn-submit" id="btn-submit">Submit</button>
          <button class="btn-cancel" id="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  </div>
  <div class="side-wrapper">
    <div class="side-wrapper-header">
      <h1>Active Cosmos</h1>
    </div>

  </div>
</div>
`
  )
}

registerPage.innerHTML += loadHeader("Admin Dashboard");
registerPage.innerHTML += loadSidebar();
registerPage.innerHTML += loadRegisterPage();
registerPage.innerHTML += loadSpinner();
headerActions();
sidebarActions();

const submitBtn = document.getElementById("btn-submit");
const cancelBtn = document.getElementById("btn-cancel");
const closeBtn = document.getElementById("btn-close");
const computerNumber = document.getElementById("pc-num") as HTMLInputElement;
const roomNumber = document.getElementById("room-num") as HTMLInputElement;

submitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  spinnerActionsAdd();
  if (computerNumber.value == "" && roomNumber.value == "" || computerNumber.value == "" || roomNumber.value == "") {
    spinnerActionsRemove();
    popUp("Registration Error", "Login failed. Fill in all the field and try again.");
    popupActions();
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

cancelBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  computerNumber.value = ""
  roomNumber.value = ""
})

closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.admin.html"
});
