import '../css/dashboard.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getReports } from '../lib/get-reports';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import { getUsers } from '../lib/get-users';
import Endpoints from '../lib/endpoint';
import { io } from "socket.io-client";
import { popUp, popupActions } from '../components/popup';
import { getTechnicians } from '../lib/get-technicians';
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
<div class="container">
  <div class="wrapper">
    <div class="panel">
      <h1>Welcome,</h1>
      <div class="panel-info">
        <h2>[ Admin: ${adminDetails.email} ]</h2>
      </div>
    </div>
    <div class="action-btns">
      <button class="btn-track" id="btn-reg">Register A Computer</button>
      <button class="btn-add-ticket" id="btn-add-ticket">New Report</button>
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
  <div class="side-wrapper">
    <div class="stats-container">
      <h1>Computer Overview</h1>
      <div class="total-pc">
        <p>Number of computers</p>
        <h3 id="registered-pcs">0</h3>
      </div>
      <div class="pc-wrapper">
        <div class="pc-stat">
          <p>Online</p>
          <h3 id="online-pcs">0</h3>
        </div>
        <div class="pc-stat">
          <p>Offline</p>
          <h3 id="offline-pcs">0</h3>
        </div>
      </div>
    </div>
    <div class="chart-wrapper">
      <h1>Report Overview</h1>
      <div class="total-reports">
        <p>Number of reports:</p>
        <h3 id="tot-reports">0</h3>
      </div>
      <div class="chart-info">
        <p>Open</p>
        <div class="bar">
          <span id="bar-open"></span>
        </div>
      </div>
      <div class="chart-info">
        <p>In progress</p>
        <div class="bar">
          <span id="bar-inprogress"></span>
        </div>
      </div>
      <div class="chart-info">
        <p>Resolved</p>
        <div class="bar">
          <span id="bar-resolved"></span>
        </div>
      </div>
    </div>
    <div class="techs-header">
      <h1>Registered Techs</h1>
    </div>
    <div class="tech-wrapper">
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
const addBtn = document.getElementById("btn-add-ticket");
const searchBtn = document.getElementById("search-btn");
const placeholder = document.querySelector(".placeholder") as HTMLDivElement;

const registeredPcs = document.getElementById("registered-pcs") as HTMLElement
const totalReports = document.getElementById("tot-reports") as HTMLElement
const onlinePcs = document.getElementById("online-pcs") as HTMLElement
const offlinePcs = document.getElementById("offline-pcs") as HTMLElement
const barOpen = document.getElementById("bar-open") as HTMLElement
const barInprogress = document.getElementById("bar-inprogress") as HTMLElement
const barResolved = document.getElementById("bar-resolved") as HTMLElement
const techsWrapper = document.querySelector(".tech-wrapper") as HTMLElement;

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

    totalReports.innerHTML = userReports.length.toString();

    const ticketRows = document.querySelectorAll(".ticket-row");
    ticketRows.forEach((ticketRow, key) => {
      ticketRow.addEventListener("click", () => {
        const reportToken = userReports[key].tokenID;
        const reportId = userReports[key]._id;
        window.location.href = `../pages/manage.admin.html?id=${reportId}+q=${reportToken}`
      })
    })
  }
  loadChart(res);
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

const loadComputers = async () => {
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

const loadChart = (res: any) => {
  let totalReports = 0;
  let openReports = 0;
  let inprogressReports = 0;
  let resolvedReports = 0;

  let reports = res.content;
  totalReports = reports.length;
  openReports = reports.filter((report: any) => report.status == "open").length
  inprogressReports = reports.filter((report: any) => report.status == "inprogress").length
  resolvedReports = reports.filter((report: any) => report.status == "resolved").length
  let w = openReports / totalReports * 100;
  barOpen.style.width = `${w}%`
  barOpen.innerHTML = openReports.toString();
  w = inprogressReports / totalReports * 100;
  barInprogress.style.width = `${w}%`
  barInprogress.innerHTML = inprogressReports.toString();
  w = resolvedReports / totalReports * 100;
  barResolved.style.width = `${w}%`
  barResolved.innerHTML = resolvedReports.toString();
}

const loadTechs = async () => {
  const res = await getTechnicians(Endpoints.techniciansUrl);
  if (!res?.ok) {
  } else {
    let techs = res.content;
    techs.map((tech: any) => {
      techsWrapper.innerHTML += `
<div class="tech">
<div class="tech-img">
<img src="/technician.svg"/>
</div>
<div class"tech-info">
<p> ${tech.email}</p>
<div class="info2">
<p>Status: ${tech.logged_in ? "Online" : "Offline"}</p>
<p>Clearance: ${tech.clearance_level}</p>
</div>
</div>
</div>
`
    })
  }

}

const loadStats = async () => {
  loadComputers();
  loadReports();
  loadTechs()

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

addBtn?.addEventListener("click", () => {
  window.location.href = "../pages/report.admin.html"
})

headerActions();
sidebarActions();
loadStats();

socket.on("updateReports", () => {
  loadReports();
});

socket.on("updateStats", () => {
  console.log("logged out")
  loadStats();
})
