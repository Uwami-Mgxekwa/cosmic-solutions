import '../css/dashboard.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getUserReports } from '../lib/get-reports';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import Endpoints from '../lib/endpoint';
import { popUp, popupActions } from '../components/popup';
import { removeData } from '../lib/local-storage';
import { io } from "socket.io-client";

const socket = io("http://localhost:6969");
const dasboardPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonUser = localStorage.getItem("user") as string;
const jsonInitSignup = localStorage.getItem("signup") as string;
let userReports: Array<any> = [];
let userDetails: any = {}

if (!jsonUser) {
  localStorage.clear();
  window.location.href = "/"
}
userDetails = JSON.parse(jsonUser);

export const loadUserDash = () => {
  return (
    container.innerHTML = `
<div class="wrapper">
  <div class="panel">
    <h1>Welcome,</h1>
    <div class="panel-info">
      <h2>[ Computer No.:${userDetails.pc} ]</h2>
      <h2>[ Room No.:${userDetails.room} ]</h2>
      <h2>[ Cosmos.:none ]</h2>
    </div>

  </div>
  <div class="action-btns">
    <button class="btn-new" id="btn-new">Submit New Report</button>
    <button class="btn-view" id="btn-view">View My Reports</button>
  </div>
  <div class="table-container">
    <table class="table">
      <caption>Select Ticket To Manage</caption>
      <thead class="table-head">
        <tr>
          <th>Token ID</th>
          <th>Category</th>
          <th>Status</th>
          <th>Submited On</th>
        </tr>
      </thead>
      <tbody class="table-body" id="tbody">
      </tbody>
    </table>
  </div>
  <div class="action-btn">
    <buttons class="btn-track" id="btn-track">Track Another Report</button>
  </div>
</div>
`
  )
}


const loadReports = async () => {
  tableBody?.replaceChildren("")
  spinnerActionsAdd()
  let userData = {
    pc: userDetails.pc,
    room: userDetails.room,
  }
  const res = await getUserReports(Endpoints.userReportsUrl, userData);
  if (!res?.ok) {
    userReports = [];
  } else {
    userReports = res?.content
  }

  if (userReports.length < 1) {
    spinnerActionsRemove()
    return;
  } else {
    for (let i = 0; i < userReports.length; i++) {
      let details = userReports[i];
      tableBody.innerHTML += `
      <tr class="ticket-row">
      <td>${details.tokenID}</td>
      <td>${details.category}</td>
      <td  id=${details.status}>${details.status}</td>
      <td>${details.submittedOn}</td>
      </tr>
  `
      if (i == 2) {
        break;
      }
    }

    const ticketRows = document.querySelectorAll(".ticket-row");
    ticketRows.forEach((ticketRow, key) => {
      ticketRow.addEventListener("click", () => {
        const reportToken = userReports[key].tokenID;
        const reportId = userReports[key]._id;
        window.location.href = `../pages/status.user.html?id=${reportId}+q=${reportToken}`
      })
    })
  }
  spinnerActionsRemove()

}

dasboardPage.innerHTML += loadHeader("Support Request Portal");
dasboardPage.innerHTML += loadSidebar()
dasboardPage.innerHTML += loadUserDash();
dasboardPage.innerHTML += loadSpinner()

const tableBody = document.getElementById("tbody") as HTMLTableElement;
const newReportBtn = document.getElementById("btn-new");
const viewTicketsBtn = document.getElementById("btn-view");
const trackBtn = document.getElementById("btn-track");

headerActions();
sidebarActions();
loadReports();

socket.on("updateReports", () => {
  loadReports()
})

if (jsonInitSignup) {
  popUp("Note.", `Remember your pc number, For the next time you log in:

    <h1> ${userDetails.pc}</h1>`)

  popupActions()
}

removeData("signup");

newReportBtn?.addEventListener("click", () => {
  window.location.href = "../pages/report.user.html"
});

viewTicketsBtn?.addEventListener("click", () => {
  window.location.href = "../pages/tickets.user.html"
});

trackBtn?.addEventListener("click", () => {
  window.location.href = "../pages/status.user.html?id=+q=track"
});

