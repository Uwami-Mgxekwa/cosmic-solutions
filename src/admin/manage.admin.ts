import '../css/manage.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getReportByID } from '../lib/get-reports';
import { delReport, updateReport } from '../lib/update-report';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from '../components/spinner';
import Endpoints from '../lib/endpoint';
import { checkDelClearance } from '../lib/check-del-clearance';
import { popUp, popupActions } from '../components/popup';
import { getTechnicians } from '../lib/get-technicians';

import { io } from "socket.io-client";
const socket = io("http://localhost:6969");

const managePage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonAdmin = localStorage.getItem("admin") as string;

if (!jsonAdmin) {
  localStorage.clear();
  window.location.href = "/"
}

const adminDetails = JSON.parse(jsonAdmin);
const urlSearch = window.location.search.split("+")
const id = urlSearch[0].split("=")[1];
let tokenID = "";

export const loadManagePage = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="panel">
          <h1>Ticket Status</h1>
          <div class="panel-info">
            <h2>[ Admin: ${adminDetails.email} ]</h2>
          </div>
        </div>

        <div class="action-btns">
          <button class="btn-update" id="btn-update">Update Status</button>
          <button class="btn-add" id="btn-add">Add Notes</button>
          <button class="btn-assign" id="btn-assign">Assign A Tech</button>
          <button class="btn-delete" id="btn-delete">Delete Report</button>
        </div>

        <div class="details-container">
          <h2>Report Details:</h2>
          <div class="ticket-info">
          </div>
        </div>
        <div class="action-btn">
          <button class="btn-close" id="btn-close">Close</button>
        </div>
      </div>
    `
  )
}

const loadDetails = async (detailsID: string) => {
  spinnerActionsAdd()
  const reportIdUrl = Endpoints.reportIdUrl(detailsID)
  const res = await getReportByID(reportIdUrl);
  if (!res?.ok) {
    return
  }
  spinnerActionsRemove();

  const report = res?.content.report
  tokenID = report?.tokenID;
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
              <span class="info-key">Technician</span>|<span class="info-value">${report?.technician}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Submitted On</span>|<span class="info-value">${report?.submittedOn}</span>
            </div>
  `
}

managePage.innerHTML += loadHeader("Admin Dashboard");
managePage.innerHTML += loadSidebar();
managePage.innerHTML += loadManagePage();
managePage.innerHTML += loadSpinner()
headerActions()
sidebarActions()
loadDetails(id);

const ticketInfoContainer = document.querySelector(".ticket-info") as HTMLDivElement;
const closeBtn = document.getElementById("btn-close");
const updateBtn = document.getElementById("btn-update");
const addBtn = document.getElementById("btn-add");
const assignBtn = document.getElementById("btn-assign");
const deleteBtn = document.getElementById("btn-delete");

closeBtn?.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.admin.html"
});

updateBtn?.addEventListener("click", (e) => {
  e.preventDefault()
  updateStatus();
})

addBtn?.addEventListener("click", (e) => {
  e.preventDefault()
  addNotes();
})

if (adminDetails.clearance_level > 0) {
  assignBtn?.setAttribute("disabled", "")
}
assignBtn?.addEventListener("click", (e) => {
  e.preventDefault()
  assignReport()
})

if (adminDetails.clearance_level > 0) {
  deleteBtn?.setAttribute("disabled", "")
}
deleteBtn?.addEventListener("click", (e) => {
  e.preventDefault()
  if (checkDelClearance(adminDetails.clearance_level)) {
    deleteReport()
  } else {
    popUp("Forbidden Operation", "This action can only be done by admin")
    popupActions();
  }
})


const updateStatus = () => {
  const updateModal = document.createElement("div");
  updateModal.classList.add("update_modal")
  updateModal.innerHTML = `
    <div>
      <div class="header">
        <h1>Update Report Status</h1>
        <h2>TokenID: ${tokenID}</h2>
      </div>
      <form>
        <div>
          <h3>Set Status To:</h3>
        </div>
        <div class="inputGroup">
          <input id="open" name="status" value="open" type="radio"/>
          <div class="labels">
            <label for="open">Open</label>
            <label for="open">Report has not been assigned a technician</label>
          </div>
        </div>
        <div class="inputGroup">
           <input id="inprogress" name="status" value="inprogress" type="radio"/>
          <div class="labels">
            <label for="inprogress">In Progress</label>
            <label for="inprogress">Report has been assigned a technician</label>
          </div>
        </div>
        <div class="inputGroup">
           <input id="resolved" name="status" value="resolved" type="radio"/>
          <div class="labels">
            <label for="resolved">Resolved</label>
            <label for="resolved">Report has been solved</label>
          </div>
        </div>
        <div class="action-btns">
          <button class="btn-status" id="btn-status">Update</button>
          <button class="btn-close" id="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  `
  managePage.appendChild(updateModal);
  const updateBtn = document.getElementById("btn-status");
  const cancelBtn = document.getElementById("btn-cancel");
  const statuses = document.getElementsByName("status");
  let statusValue = "open";

  statuses.forEach((status: any) => {
    status.addEventListener("click", () => {
      statusValue = status.value;
    })
  })

  updateBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    spinnerActionsAdd()
    const updateReportUrl = Endpoints.updateReportStatusUrl(id)
    const res = await updateReport(updateReportUrl, { status: statusValue })
    if (!res?.ok) {
      console.log(res?.content)
    } else {
      console.log(res?.content)
    }
    spinnerActionsRemove();
    window.location.reload();
  })

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const updateModal = document.querySelector(".update_modal") as HTMLElement;
    managePage.removeChild(updateModal);
  })

}

const addNotes = () => {
  const updateModal = document.createElement("div");
  updateModal.classList.add("update_modal")
  updateModal.innerHTML = `
    <div>
      <div class="header">
        <h1>Update Report Notes</h1>
        <h2>TokenID: ${tokenID}</h2>
      </div>
      <form>
        <div>
          <h3>Add Notes to Status:</h3>
          <div class="notes">
            <textarea id="notes"></textarea>
          </div>
        </div>
        <div class="action-btns">
          <button class="btn-status" id="btn-status">Update</button>
          <button class="btn-close" id="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  `
  managePage.appendChild(updateModal);
  const updateBtn = document.getElementById("btn-status");
  const cancelBtn = document.getElementById("btn-cancel");
  const notes = document.getElementById("notes") as HTMLTextAreaElement;

  updateBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    spinnerActionsAdd()
    const updateReportUrl = Endpoints.updateReportNotesUrl(id)
    const res = await updateReport(updateReportUrl, { notes: notes.value })
    if (!res?.ok) {
      console.log(res?.content)
    } else {
      console.log(res?.content)
    }
    spinnerActionsRemove()
    window.location.reload();
  })

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const updateModal = document.querySelector(".update_modal") as HTMLElement;
    managePage.removeChild(updateModal);
  })
}

const assignReport = async () => {
  const techs = await getTechnicians(Endpoints.techniciansUrl);
  const updateModal = document.createElement("div");
  updateModal.classList.add("update_modal")
  updateModal.innerHTML = `
    <div>
      <div class="header">
        <h1>Assign Report To A Technician</h1>
        <h2>TokenID: ${tokenID}</h2>
      </div>
      <form>
        <div>
          <h3>Enter Technician Email</h3>
          <div class="assign">
             <input type="text" id="tech-email" name="tech-email" placeholder="Email" required>
             <ul id="autocomplete"></ul>
          </div>
        </div>
        <div class="action-btns">
          <button class="btn-status" id="btn-status">Update</button>
          <button class="btn-close" id="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  `
  managePage.appendChild(updateModal);
  const updateBtn = document.getElementById("btn-status");
  const cancelBtn = document.getElementById("btn-cancel");
  const email = document.getElementById("tech-email") as HTMLInputElement;
  const autocomplete = document.getElementById("autocomplete") as HTMLUListElement

  email.addEventListener("keyup", (e) => {
    e.preventDefault()
    if (email.value.length < 1) {
      autocomplete.replaceChildren("")
      return;
    }
    complete(email.value)

  });

  const complete = (val: string) => {
    let searchList: any = [];
    techs?.content.forEach((c: any) => {

      if (c.email.toLowerCase().includes(val.toLowerCase())) {
        searchList.push(c.email)
      }
    });

    autocomplete.replaceChildren("")
    searchList.forEach((l: any) => {
      autocomplete.innerHTML += `
      <li class="email" data-set-name=${l}>${l}</li>
    `
    })
    const emails = document.querySelectorAll(".email");
    emails.forEach((m) => {
      m.addEventListener("click", () => {
        email.value = m.getAttribute("data-set-name") || " "
        autocomplete.replaceChildren("")
      })
    })
  }

  updateBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    spinnerActionsAdd()
    const updateReportUrl = Endpoints.assignReportUrl(id)
    const res = await updateReport(updateReportUrl, { technician: email.value })
    if (!res?.ok) {
      console.log(res?.content)
    } else {
      console.log(res?.content)
    }
    spinnerActionsRemove()
    window.location.reload();
  })

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const updateModal = document.querySelector(".update_modal") as HTMLElement;
    managePage.removeChild(updateModal);
  })
}

const deleteReport = () => {
  const updateModal = document.createElement("div");
  updateModal.classList.add("update_modal")
  updateModal.innerHTML = `
    <div>
      <div class="header">
        <h1>Delete Report</h1>
        <h2>TokenID: ${tokenID}</h2>
      </div>
      <form>
        <div class="warning">
          <p>This Action Can't Be Undone</p>
          <p>Delete This Report</p>
        </div>
        <div class="action-btns">
          <button class="btn-status" id="btn-status">Confirm</button>
          <button class="btn-close" id="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  `
  managePage.appendChild(updateModal);
  const updateBtn = document.getElementById("btn-status");
  const cancelBtn = document.getElementById("btn-cancel");

  updateBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    spinnerActionsAdd()
    const updateReportUrl = Endpoints.updateReportDeleteUrl(id)
    const res = await delReport(updateReportUrl, { adminID: adminDetails.email })

    if (!res?.ok) {
      console.log(res?.content)
    } else {
      console.log(res?.content)
    }
    socket.emit("adminDeleteReport")
    spinnerActionsRemove()
    window.location.href = "../pages/dashboard.admin.html"
  })

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const updateModal = document.querySelector(".update_modal") as HTMLElement;
    managePage.removeChild(updateModal);
  })
}
