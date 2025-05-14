import '../css/dashboard.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getUserReports } from '../lib/get-reports';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';

const userReportsUrl = "http://localhost:8080/api/report/all/user"
const dasboardPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonUser = localStorage.getItem("user") as string;

if (!jsonUser) {
  localStorage.clear();
  window.location.href = "/"
}
const userDetails = JSON.parse(jsonUser);
let userReports: Array<any> = [];

export const loadUserDash = () => {
  return (
    container.innerHTML = `
<div class="wrapper">
  <div class="panel">
    <h1>Welcome,</h1>
    <div class="panel-info">
      <h2>[ Computer No.:${userDetails.pc} ]</h2>
      <h2>[ Room No.:${userDetails.room} ]</h2>
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
  <div class="placeholder ph-hidden" id="ph">
    <p>You Have No Reports at the moment</p>
  </div>
  <div class="action-btn">
    <buttons class="btn-track" id="btn-track">Track Another Report</button>
  </div>
</div>
`
  )
}

const loadReports = async () => {
  spinnerActionsAdd()
  let userData = {
    pc: userDetails.pc,
    room: userDetails.room,
  }
  const res = await getUserReports(userReportsUrl, userData);
  if (!res?.ok) {
    userReports = [];
  } else {
    userReports = res?.content
  }

  if (userReports.length < 1) {
    placeholder?.classList.remove("ph-hidden");
  } else {
    for (let i = 0; i < userReports.length; i++) {
      let details = userReports[i];
      tableBody.innerHTML += `
      <tr class="ticket-row">
      <td>${details.tokenID}</td>
      <td>${details.category}</td>
      <td>${details.status}</td>
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
headerActions();
sidebarActions();
loadReports();

const tableBody = document.getElementById("tbody") as HTMLTableElement;
const placeholder = document.getElementById("ph");

const newReportBtn = document.getElementById("btn-new");
const viewTicketsBtn = document.getElementById("btn-view");
const trackBtn = document.getElementById("btn-track");

newReportBtn?.addEventListener("click", () => {
  window.location.href = "../pages/report.user.html"
});

viewTicketsBtn?.addEventListener("click", () => {
  window.location.href = "../pages/tickets.user.html"
});

trackBtn?.addEventListener("click", () => {
  window.location.href = "../pages/status.user.html?id=+q=track"
});


