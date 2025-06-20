import '../css/dashboard.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getUserReports } from '../lib/get-reports';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import Endpoints from '../lib/endpoint';
import { popUp, popupActions } from '../components/popup';
import { removeData } from '../lib/local-storage';
import { io } from "socket.io-client";

const socket = io(Endpoints.socketUrl);
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
<div class="container">
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
        <h1 id="caption">Select Ticket To Manage</h1>
      <div class="filter-container">
        <button class="filter-btn active" id="all-btn">All</button>
        <button class="filter-btn" id="open-btn">Open</button>
        <button class="filter-btn" id="inprogress-btn"active">In progress</button>
        <button class="filter-btn" id="resolved-btn">Resolved</button>
      </div>
      <table class="table">
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
      <div class="placeholder"></div>
    </div>
    <div class="action-btn">
      <button class="btn-track" id="btn-track">Track Another Report</button>
    </div>
  </div>

  <div class="side-wrapper">
    <h1>Report History</h1>
    <div class="stats-container">
      <div class="total-pc">
        <p>Number of reports</p>
        <h3 id="total-reports">0</h3>
      </div>
      <div class="pc-wrapper">
        <div class="pc-stat">
          <p>Open</p>
          <h3 id="reports-open">0</h3>
        </div>
        <div class="pc-stat">
          <p>In progress</p>
          <h3 id="reports-inprogress">0</h3>
        </div>
        <div class="pc-stat">
          <p>Resolved</p>
          <h3 id="reports-resolved">0</h3>
        </div>
      </div>
    </div>
  </div>
</div>
`
  )
}

dasboardPage.innerHTML += loadHeader("Support Request Portal");
dasboardPage.innerHTML += loadSidebar()
dasboardPage.innerHTML += loadUserDash();
dasboardPage.innerHTML += loadSpinner()

const tableBody = document.getElementById("tbody") as HTMLTableElement;
const newReportBtn = document.getElementById("btn-new");
const viewTicketsBtn = document.getElementById("btn-view");
const trackBtn = document.getElementById("btn-track");
const filterBtns = document.querySelectorAll(".filter-btn")

const placeholder = document.querySelector(".placeholder") as HTMLDivElement;
const totalReports = document.getElementById("total-reports") as HTMLElement;
const openReports = document.getElementById("reports-open") as HTMLElement;
const inprogressReports = document.getElementById("reports-inprogress") as HTMLElement;
const resolvedReports = document.getElementById("reports-resolved") as HTMLElement;

const loadReports = async (filter: string) => {
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
    totalReports.innerHTML = userReports.length.toString();
    openReports.innerHTML = userReports.filter((r) => r.status == "open").length.toString();
    inprogressReports.innerHTML = userReports.filter((r) => r.status == "inprogress").length.toString();
    resolvedReports.innerHTML = userReports.filter((r) => r.status == "resolved").length.toString();
  }

  if (filter == "open") {
    userReports = userReports.filter((rep) => rep.status == "open");
  }
  if (filter == "inprogress") {
    userReports = userReports.filter((rep) => rep.status == "inprogress");
  }
  if (filter == "resolved") {
    userReports = userReports.filter((rep) => rep.status == "resolved");
  }

  if (userReports.length < 1) {
    placeholder.innerHTML = `<p class="plc-holder">No reports at the moment</p>`
  } else {
    placeholder.innerHTML = "";
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

if (jsonInitSignup) {
  popUp("Note.", `Remember your pc number, For the next time you log in:

<h1> ${userDetails.pc}</h1>`)

  popupActions()
}

newReportBtn?.addEventListener("click", () => {
  window.location.href = "../pages/report.user.html"
});

viewTicketsBtn?.addEventListener("click", () => {
  window.location.href = "../pages/tickets.user.html"
});

trackBtn?.addEventListener("click", () => {
  window.location.href = "../pages/status.user.html?id=+q=track"
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((btn) => {
      btn.classList.remove("active")
    })
    btn.classList.add("active");
    let filter = btn.id.split("-");
    loadReports(filter[0])
  })
})

removeData("signup");
headerActions();
sidebarActions();
loadReports("all");

socket.on("updateReports", () => {
  loadReports("all")
})
