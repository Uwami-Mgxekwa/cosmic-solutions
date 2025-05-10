import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import '../css/manage.style.css'

const statusPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");

export const loadStatusPage = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="panel">
          <h1>Ticket Status</h1>
          <div class="panel-info">
            <h2>[ Admin: tech.admin@cosmic ]</h2>
          </div>
        </div>

        <div class="action-btns">
          <button class="btn-update" id="btn-new">Update Status</button>
          <button class="btn-add" id="btn-view">Add Notes</button>
        </div>

        <div class="details-container">
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

statusPage.innerHTML += loadHeader("Admin Dashboard");
statusPage.innerHTML += loadSidebar();
statusPage.innerHTML += loadStatusPage();
headerActions()
sidebarActions()

const closeBtn = document.getElementById("btn-close");

closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.admin.html"
})
