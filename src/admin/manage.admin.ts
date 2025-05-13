import '../css/manage.style.css'
import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import { getReportByID } from '../lib/get-reports';

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
let query = urlSearch[1].split("=")[1]
let userReports: Array<any> = [];

let report = userReports.find((rep) => rep.tokenID == query);
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
          <button class="btn-delete" id="btn-delete">Delete Report</button>
        </div>

        <div class="details-container">
          <h2>Report Details:</h2>
          <div class="ticket-info"></div>
        </div>
        <div class="action-btn">
          <button class="btn-close" id="btn-close">Close</button>
        </div>
      </div>
    `
  )
}

const loadDetails = async (detailsID: string) => {
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

managePage.innerHTML += loadHeader("Admin Dashboard");
managePage.innerHTML += loadSidebar();
managePage.innerHTML += loadManagePage();
headerActions()
sidebarActions()
loadDetails(id);

const ticketInfoContainer = document.querySelector(".ticket-info") as HTMLDivElement;
const closeBtn = document.getElementById("btn-close");
const updateBtn = document.getElementById("btn-update");
const addBtn = document.getElementById("btn-add");
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

deleteBtn?.addEventListener("click", (e) => {
  e.preventDefault()
  deleteReport()
})


const updateStatus = () => {
  const updateModal = document.createElement("div");
  updateModal.classList.add("update_modal")
  updateModal.innerHTML = `
    <div>
      <div class="header">
        <h1>Update Report Status</h1>
        <h2>TokenID: ${report?.tokenID}</h2>
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
  let statusValue = "";

  statuses.forEach((status: any) => {
    status.addEventListener("click", () => {
      statusValue = status.value;
    })
  })

  updateBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(statusValue)
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
        <h2>TokenID: ${report?.tokenID}</h2>
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

  updateBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(notes.value)
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
        <h2>TokenID: ${report?.tokenID}</h2>
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

  updateBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("deleted")
  })

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault()
    const updateModal = document.querySelector(".update_modal") as HTMLElement;
    managePage.removeChild(updateModal);
  })
}
