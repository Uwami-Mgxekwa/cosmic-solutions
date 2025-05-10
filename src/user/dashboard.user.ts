import '../css/dashboard.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { reports, type IReport } from '../assets/data';

const dasboardPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonUser = localStorage.getItem("user") as string;
const userDetails = JSON.parse(jsonUser);
let userReports: Array<IReport> = reports;
const jsonReports = localStorage.getItem("local-reports") as string;
if (jsonReports) {
  const reportArray = JSON.parse(jsonReports) as Array<IReport>;
  userReports = [...reportArray, ...userReports];
}

export const loadUserDash = () => {
  return (
    container.innerHTML = `
<div class="wrapper">
  <div class="panel">
    <h1>Welcome,</h1>
    <div class="panel-info">
      <h2>[ Computer No.: PC-${userDetails.pc} ]</h2>
      <h2>[ Room No.: R-${userDetails.room} ]</h2>
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

dasboardPage.innerHTML += loadHeader("Support Request Portal");
dasboardPage.innerHTML += loadSidebar()
dasboardPage.innerHTML += loadUserDash();
headerActions();
sidebarActions();

const tableBody = document.getElementById("tbody") as HTMLTableElement;
const placeholder = document.getElementById("ph");

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

}
const newReportBtn = document.getElementById("btn-new");
const viewTicketsBtn = document.getElementById("btn-view");
const trackBtn = document.getElementById("btn-track");
const ticketRows = document.querySelectorAll(".ticket-row");

newReportBtn?.addEventListener("click", () => {
  window.location.href = "../pages/report.user.html"
});

viewTicketsBtn?.addEventListener("click", () => {
  window.location.href = "../pages/tickets.user.html"
});

trackBtn?.addEventListener("click", () => {
  window.location.href = "../pages/status.user.html"
});


ticketRows.forEach((ticketRow) => {
  ticketRow.addEventListener("click", () => {
    window.location.href = "../pages/status.user.html"
  })
})


