import '../css/dashboard.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getReports } from '../lib/get-reports';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import { getUsers } from '../lib/get-users';
import Endpoints from '../lib/endpoint';
import { io } from "socket.io-client";
import { popUp, popupActions } from '../components/popup';
const socket = io(Endpoints.socketUrl);

const dasboardPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonAdmin = localStorage.getItem("admin") as string;
let userReports: Array<any> = [];
let adminDetails: any = {};
if (!jsonAdmin) {
  localStorage.clear();
  window.location.href = "/"
}
adminDetails = JSON.parse(jsonAdmin);


export const loadAdminDash = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="panel">
          <h1>Welcome,</h1>
          <div class="panel-info">
            <h2>[ Admin: ${adminDetails.email} ]</h2>
          </div>
          <div class="panel-stats">
            <h3>Registered Computers: <span id="registered-pcs"></span><h3>
           <ul>
              <li>Online:<span id="online-pcs"></span></li>
              <li>Offline: <span id="offline-pcs"></span></li>
            </ul> 
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
            <div class="placeholder"></div>
        </div>
      </div>
    `
  )
}

dasboardPage.innerHTML += loadHeader("Admin Dashboard");
dasboardPage.innerHTML += loadSidebar()
dasboardPage.innerHTML += loadAdminDash();
dasboardPage.innerHTML += loadSpinner();

const tableBody = document.getElementById("tbody") as HTMLTableElement;
const regBtn = document.getElementById("btn-reg");
const searchBtn = document.getElementById("search-btn");
const placeholder = document.querySelector(".placeholder") as HTMLDivElement;

const registeredPcs = document.getElementById("registered-pcs") as HTMLSpanElement
const onlinePcs = document.getElementById("online-pcs") as HTMLSpanElement
const offlinePcs = document.getElementById("offline-pcs") as HTMLSpanElement

const loadReports = async () => {
  tableBody?.replaceChildren("")
  spinnerActionsAdd();
  let reportsEndpoint = "";
  if (adminDetails.email.includes("tech")) {
    reportsEndpoint = Endpoints.assignedTechniciansReportsUrl(adminDetails.email);
  } else {
    reportsEndpoint = Endpoints.reportsUrl;
  }
  const res = await getReports(reportsEndpoint);
  if (!res?.ok) {
    if (res.abort) {
      popUp("Time Out", res.content.message)
      popupActions()
    }
    userReports = [];
  } else {
    userReports = res?.content
  }

  if (userReports.length < 1) {
    placeholder.innerHTML = `<p>No reports at the moment</p>`
  } else {
    placeholder.innerHTML = " ";
    placeholder.innerHTML = " ";
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
    placeholder.innerHTML = `<p>No reports at the moment</p>`
  } else {
    placeholder.innerHTML = " ";
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
    if (res.abort) {
      popUp("Time Out", res.content.message)
      popupActions()
    }
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

const loadStats = async () => {
  let registered: any = [];
  let online: any = []
  let offline: any = []

  const res = await getUsers(Endpoints.usersUrl);
  if (!res?.ok) {
    registered = []
    online = []
    online = []
  } else {
    registered = res.content.users;
    online = res.content.users.filter((user: any) => user.logged_in == true)
    offline = res.content.users.filter((user: any) => user.logged_in == false)
    registeredPcs.innerHTML = registered.length
    onlinePcs.innerHTML = online.length;
    offlinePcs.innerHTML = offline.length
  }

}

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

headerActions();
sidebarActions();
loadReports();
loadStats();

socket.on("updateReports", () => {
  loadReports();
});

socket.on("updateStats", () => {
  console.log("logged outj")
  loadStats();
})
