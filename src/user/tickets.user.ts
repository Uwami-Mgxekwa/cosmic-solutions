import { reports, type IReport } from '../assets/data';
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import '../css/tickets.style.css'

const ticketsPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");

const json = localStorage.getItem("user") as string;
const userDetails = JSON.parse(json);
let userReports: Array<IReport> = reports;
const jsonReports = localStorage.getItem("local-reports") as string;
if (jsonReports) {
  const reportArray = JSON.parse(jsonReports) as [];
  userReports = [...reportArray, ...userReports];
}

export const loadTicketsPage = () => {
  return (
    container.innerHTML = `
<div class="wrapper">
  <div class="panel">
    <h1>All Reports</h1>
    <div class="panel-info">
      <h2>[ Computer No.: PC-${userDetails.pc} ]</h2>
      <h2>[ Room No.: R-${userDetails.room} ]</h2>
    </div>
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
    <buttons class="btn-close" id="btn-close">Close</button>
  </div>
</div>
`
  )
}

ticketsPage.innerHTML += loadHeader("Support Request Portal");
ticketsPage.innerHTML += loadSidebar();
ticketsPage.innerHTML += loadTicketsPage();
headerActions();
sidebarActions();

const tableBody = document.getElementById("tbody") as HTMLTableElement;
const placeholder = document.getElementById("ph");
if (userReports.length < 1) {
  placeholder?.classList.remove("ph-hidden");
} else {
  userReports.map((report) => {
    tableBody.innerHTML += `
      <tr class="ticket-row">
      <td>${report.tokenID}</td>
      <td>${report.category}</td>
      <td>${report.status}</td>
      <td>${report.submittedOn}</td>
      </tr>`

  });
}
const closeBtn = document.getElementById("btn-close");
const ticketRows = document.querySelectorAll(".ticket-row");

ticketRows.forEach((ticketRow) => {
  ticketRow.addEventListener("click", () => {
    window.location.href = "../pages/status.user.html"
  })
})
closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.user.html"
})
