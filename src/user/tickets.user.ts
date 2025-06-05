import '../css/tickets.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getUserReports } from '../lib/get-reports';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import Endpoints from '../lib/endpoint';

const ticketsPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonUser = localStorage.getItem("user") as string;

if (!jsonUser) {
  localStorage.clear();
  window.location.href = "/"
}

const userDetails = JSON.parse(jsonUser);
let userReports: Array<any> = [];

export const loadTicketsPage = () => {
  return (
    container.innerHTML = `
<div class="wrapper">
  <div class="panel">
    <h1>All Reports</h1>
    <div class="panel-info">
      <h2>[ Computer No.:${userDetails.pc} ]</h2>
      <h2>[ Room No.:${userDetails.room} ]</h2>
      <h2>[ Cosmos.:none ]</h2>
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

const loadReports = async () => {
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
    placeholder?.classList.remove("ph-hidden");
  } else {
    userReports.map((report) => {
      tableBody.innerHTML += `
      <tr class="ticket-row">
      <td>${report.tokenID}</td>
      <td>${report.category}</td>
      <td  id=${report.status}>${report.status}</td>
      <td>${report.submittedOn}</td>
      </tr>`

    });
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
ticketsPage.innerHTML += loadHeader("Support Request Portal");
ticketsPage.innerHTML += loadSidebar();
ticketsPage.innerHTML += loadTicketsPage();
ticketsPage.innerHTML += loadSpinner()
headerActions();
sidebarActions();
loadReports();

const tableBody = document.getElementById("tbody") as HTMLTableElement;
const placeholder = document.getElementById("ph");
const closeBtn = document.getElementById("btn-close");

closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.user.html"
})
