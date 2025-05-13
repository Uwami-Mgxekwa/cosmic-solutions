import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import '../css/status.style.css'
import { getReportByID, getReports } from '../lib/get-reports';

const statusPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonUser = localStorage.getItem("user") as string;

if (!jsonUser) {
  localStorage.clear();
  window.location.href = "/"
}

const userDetails = JSON.parse(jsonUser);
const urlSearch = window.location.search.split("+")
const id = urlSearch[0].split("=")[1];
let query = urlSearch[1].split("=")[1]

export const loadStatusPage = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="panel">
          <h1>Report Status</h1>
          <div class="panel-info">
            <h2>[ Computer No.: PC-${userDetails.pc} ]</h2>
            <h2>[ Room No.: R-${userDetails.room} ]</h2>
          </div>
        </div>
        <div>
          <form class="search-form">
            <input type="text" name="search" id="search" placeholder="Search Token ID (eg:7678)"/>
            <button type="submit" id="search-btn">Search </button>
          </form>

        </div>
        <div class="details-container">
          <h2>Report Details:</h2>
          <div class="ticket-info"></div>
        </div>
        <div class="action-btn">
          <buttons class="btn-close" id="btn-close">Close</button>
        </div>
      </div>
    `
  )
}


const loadDetails = async (detailsID: string) => {
  if (query == "track") {
    return
  } else {
    const res = await getReportByID(`http://localhost:8080/api/report/id/${detailsID}`);
    if (!res?.ok) {
      return
    }
    const report = res?.content.report
    ticketInfoContainer.innerHTML = ` 
            <div class="info-row">
              <span class="info-key">Token ID</span>|<span class="info-value">${report?.tokenID}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Issue Category</span>|<span class="info-value">${report?.category}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Description</span>|<span class="info-value">${report?.description}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Status</span>|<span class="info-value">${report?.status}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Notes</span>|<span class="info-value">${report?.notes}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Computer Number</span>|<span class="info-value">${report?.pc}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Room Number</span>|<span class="info-value">${report?.room}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Submitted On</span>|<span class="info-value">${report?.submittedOn}</span>
            </div>
  `
  }
}

statusPage.innerHTML += loadHeader("Support Request Portal");
statusPage.innerHTML += loadSidebar();
statusPage.innerHTML += loadStatusPage();
headerActions();
sidebarActions();
loadDetails(id);

const ticketInfoContainer = document.querySelector(".ticket-info") as HTMLDivElement;
const closeBtn = document.getElementById("btn-close");
const searchBtn = document.getElementById("search-btn");

closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.user.html"
})

searchBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  search();
})

const search = async () => {
  const searchField = document.getElementById("search") as HTMLInputElement;
  const searchKey = searchField.value;
  if (searchKey == " ") {
    return
  }
  const res = await getReports("http://localhost:8080/api/report/all");
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
  query = searchKey;
  let url = new URL(window.location.href)
  let newUrl = url.origin + url.pathname + `?id=${report._id}+q=${report.tokenID}`
  history.pushState({}, "", newUrl)
  ticketInfoContainer.innerHTML = ""
  loadDetails(report._id);
}

