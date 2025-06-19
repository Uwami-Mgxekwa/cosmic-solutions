import '../css/report.style.css'
import { headerActions, loadHeader } from '../components/header';
import { popUp, popupActions } from '../components/popup';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { createReport } from '../lib/get-reports';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import Endpoints from '../lib/endpoint';

const reportPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonUser = localStorage.getItem("user") as string;

if (!jsonUser) {
  localStorage.clear();
  window.location.href = "/"
}

const userDetails = JSON.parse(jsonUser);

export const loadUserReport = () => {
  return (
    container.innerHTML = `
  <div class="container">
      <div class="wrapper">
        <div class="panel">
        <div class="panel-header">
          <h1>Report A New Issue</h1>
          <button id="btn-close"> &lt; Home</button>
        </div>
          <div class="panel-info">
            <h2>[ Computer No.:${userDetails.pc} ]</h2>
            <h2>[ Room No.:${userDetails.room} ]</h2>
            <h2>[ Cosmos.:none ]</h2>
          </div>
        </div>
        <div class="form-container">
          <form>
            <div>
                <h2 class="label">Choose Issue Category</h2>
                <div class="radio-group">
                  <div>
                    <input type="radio" id="network" name="category" value="network">
                    <label for="network">Network</label><br>
                  </div>
                  <div>
                    <input type="radio" id="software" name="category" value="software">
                    <label for="software">Software</label><br>
                  </div>
                  <div>
                    <input type="radio" id="hardware" name="category" value="hardware">
                    <label for="hardware">Hardware</label>
                  </div>
                </div>
            </div>
            <div class="description-container">
              <h2 class="label">Describe The Issue</h2>
              <textarea id="description"></textarea>
            </div>
            <div class="action-btns">
              <button class="btn-submit" id="btn-submit">Submit Report</button>
              <button class="btn-cancel" id="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
      </div>
  <div class="side-wrapper">
    <div class="side-wrapper-header">
      <h1>Recent Reports</h1>
    </div>

  </div>
  </div>
    `
  )
}

reportPage.innerHTML += loadHeader("Support Request Portal");
reportPage.innerHTML += loadSidebar();
reportPage.innerHTML += loadUserReport();
reportPage.innerHTML += loadSpinner()
headerActions();
sidebarActions();

const submitBtn = document.getElementById("btn-submit");
const cancelBtn = document.getElementById("btn-cancel");
const closeBtn = document.getElementById("btn-close");
const cats = document.getElementsByName("category") as NodeListOf<HTMLInputElement>;
const description = document.getElementById("description") as HTMLTextAreaElement;
let category = "";

submitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  spinnerActionsAdd()
  for (let i = 0; i < cats.length; i++) {
    if (cats[i].checked) {
      category = cats[i].value
    }
  }

  if (category == "" && description.value == "" || category == "" || description.value == "") {
    spinnerActionsRemove();
    popUp("Submittion Error", "Submittion failed. Fill in all the field and try again.");
    popupActions();
    return;
  }

  function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  let tokenNumber = getRandomIntInclusive(10, 99).toString() + getRandomIntInclusive(10, 99).toString()

  const data = {
    tokenID: tokenNumber,
    category: category,
    description: description.value,
    status: "open",
    submittedOn: new Date().toLocaleString("en-ZA", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).toLowerCase(),
    notes: "",
    pc: userDetails.pc,
    room: userDetails.room
  }

  const res = await createReport(Endpoints.createReportUrl, data);
  if (!res?.ok) {
    return
  } else {
    popUp("Success", `<p>TokenID: ${tokenNumber}</p>`)
    popupActions();

  }
  spinnerActionsRemove()
});

cancelBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  cats.forEach((c) => {
    c.checked = false;
  })
  description.value = ""

})

closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.user.html"
});
