import '../css/dashboard.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getReports } from '../lib/get-reports';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import Endpoints from '../lib/endpoint';

const dasboardPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");

const jsonAdmin = localStorage.getItem("admin") as string;
const adminDetails = JSON.parse(jsonAdmin);

let userReports: Array<any> = [];

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
        <div class="action-btns">
          <button class="btn-track" id="btn-reg">Register A Computer</button>
        </div>
        <div class="form-wrapper">
          <form class="search-form">
            <input type="text" name="search" id="search" placeholder="Search Token ID"/>
            <button type="submit" id="reset-btn">Reset </button>
            <button type="submit" id="search-btn">Search </button>
          </form>
        </div>
        <div class="table-container admin-table">
          <table class="table">
            <caption id="caption">Select Ticket To Manage</caption>
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
          <p>There Are No Reports At The Moment</p>
         </div>
      </div>
    `
  )
}

const loadReports = async () => {
  spinnerActionsAdd();
  let reportsEndpoint = "";
  if (adminDetails.email.includes("tech")) {
    reportsEndpoint = Endpoints.assignedTechniciansReportsUrl(adminDetails.email);
  } else {
    reportsEndpoint = Endpoints.reportsUrl;
  }
  const res = await getReports(reportsEndpoint);
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
      <td id=${report.status}>${report.status}</td>
      <td>${report.submittedOn}</td>
      </tr>`

    });

    const ticketRows = document.querySelectorAll(".ticket-row");
    ticketRows.forEach((ticketRow, key) => {
      ticketRow.addEventListener("click", () => {
        const reportToken = userReports[key].tokenID;
        const reportId = userReports[key]._id;
        window.location.href = `../pages/manage.admin.html?id=${reportId}+q=${reportToken}`
      })
    })
  }
  spinnerActionsRemove()
}

const loadSearchedReports = (sr: any) => {
  if (sr.length < 1) {
    placeholder?.classList.remove("ph-hidden");
  } else {
    sr.map((report: any) => {
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
        window.location.href = `../pages/manage.admin.html?id=${reportId}+q=${reportToken}`
      })
    })
  }

}

const search = async () => {
  spinnerActionsAdd()
  const searchField = document.getElementById("search") as HTMLInputElement;
  const searchKey = searchField.value;
  if (searchKey == " ") {
    return
  }
  let reportsEndpoint = ""
  if (adminDetails.email.includes("tech")) {
    reportsEndpoint = Endpoints.assignedTechniciansReportsUrl(adminDetails.email);
  } else {
    reportsEndpoint = Endpoints.reportsUrl;
  }
  const res = await getReports(reportsEndpoint);
  let userReports = []
  if (!res?.ok) {
    userReports = [];
  } else {
    userReports = res?.content
  }
  const report = userReports.find((rep: any) => rep.tokenID == searchKey);
  if (!report) {
    return
  }

  let searchedReports = [report];
  tableBody.innerHTML = " "
  loadSearchedReports(searchedReports);
  spinnerActionsRemove();
}

dasboardPage.innerHTML += loadHeader("Admin Dashboard");
dasboardPage.innerHTML += loadSidebar()
dasboardPage.innerHTML += loadAdminDash();
dasboardPage.innerHTML += loadSpinner();
headerActions();
sidebarActions();
loadReports();

const tableBody = document.getElementById("tbody") as HTMLTableElement;
const placeholder = document.getElementById("ph");
const regBtn = document.getElementById("btn-reg");
const searchBtn = document.getElementById("search-btn");

searchBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  search();
})

if (adminDetails.clearance_level > 0) {
  regBtn?.setAttribute("disabled", "")
}

regBtn?.addEventListener("click", () => {
  window.location.href = "../pages/register.admin.html"
})
