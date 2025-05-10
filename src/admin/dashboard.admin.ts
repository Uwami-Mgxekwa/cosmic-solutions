import '../css/dashboard.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { reports } from '../assets/data';

const dasboardPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonAdmin = localStorage.getItem("admin") as string;
const adminDetails = JSON.parse(jsonAdmin);
let userReports = reports;
const jsonReports = localStorage.getItem("local-reports") as string;
if (jsonReports) {
  const reportArray = JSON.parse(jsonReports) as [];
  userReports = [...reportArray, ...userReports];
}


export const loadAdminDash = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="panel">
          <h1>Welcome,</h1>
          <div class="panel-info">
            <h2>[ Admin: ${adminDetails.email} ]</h2>
          </div>
          
        </div>
        <div>
          <form class="search-form">
            <input type="text" name="search" id="search" placeholder="Search Token ID"/>
            <div class="filter">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
              <select name="filter">
                <option>Filter By Status</option>
                <option>Open</option>
                <option>In progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <button type="submit">Search </button>
          </form>
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
      </div>
    `
  )
}

dasboardPage.innerHTML += loadHeader("Admin Dashboard");
dasboardPage.innerHTML += loadSidebar()
dasboardPage.innerHTML += loadAdminDash();
headerActions();
sidebarActions();

const tableBody = document.getElementById("tbody") as HTMLTableElement;
userReports.map((report) => {
  tableBody.innerHTML += `
      <tr class="ticket-row">
      <td>${report.tokenID}</td>
      <td>${report.category}</td>
      <td>${report.status}</td>
      <td>${report.submittedOn}</td>
      </tr>`

});
const ticketRows = document.querySelectorAll(".ticket-row");

ticketRows.forEach((ticketRow) => {
  ticketRow.addEventListener("click", () => {
    window.location.href = "../pages/manage.admin.html"
  })
})


