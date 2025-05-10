import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import '../css/status.style.css'

const statusPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonUser = localStorage.getItem("user") as string;
const userDetails = JSON.parse(jsonUser);

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
        <div class="details-container">
          <form class="search-form">
            <input type="text" name="search" id="search" placeholder="Search Token ID"/>
            <button type="submit">Search </button>
          </form>
          <h2>Ticlets Details:</h2>
          <div class="ticket-info">
            <div class="info-row">
              <span class="info-key">Token ID</span>|<span class="info-value">CS-5902</span>
            </div>
            <div class="info-row">
              <span class="info-key">Issue Category</span>|<span class="info-value">Network</span>
            </div>
            <div class="info-row">
              <span class="info-key">Computer Number</span>|<span class="info-value">R2</span>
            </div>
            <div class="info-row">
              <span class="info-key">Room Number</span>|<span class="info-value">PC001</span>
            </div>
            <div class="info-row">
              <span class="info-key">Status</span>|<span class="info-value">In Progress</span>
            </div>
            <div class="info-row">
              <span class="info-key">Notes</span>|<span class="info-value">Investigating Network Failure</span>
            </div>
            <div class="info-row">
              <span class="info-key">Submitted On</span>|<span class="info-value">May 5,2025</span>
            </div>
          </div>

        </div>
        <div class="action-btn">
          <buttons class="btn-close" id="btn-close">Close</button>
        </div>
      </div>
    `
  )
}

statusPage.innerHTML += loadHeader("Support Request Portal");
statusPage.innerHTML += loadSidebar();
statusPage.innerHTML += loadStatusPage();
headerActions();
sidebarActions();

const closeBtn = document.getElementById("btn-close");

closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.user.html"
})
