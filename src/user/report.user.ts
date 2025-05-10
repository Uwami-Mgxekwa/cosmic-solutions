import { headerActions, loadHeader } from '../components/header';
import { loadSidebar, sidebarActions } from '../components/sidebar';
import '../css/report.style.css'
import { storeData } from '../lib/local-storage';

const reportPage = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const jsonUser = localStorage.getItem("user") as string;
const userDetails = JSON.parse(jsonUser);

export const loadUserReport = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="panel">
          <h1>Report A New Issue</h1>
          <div class="panel-info">
            <h2>[ Computer No.: PC-${userDetails.pc} ]</h2>
            <h2>[ Room No.: R-${userDetails.room} ]</h2>
          </div>
        </div>
        <div class="form-container">
          <form>
            <div>
                <h2 class="label">Issue Category</h2>
                <div class="radio-group">
                  <div>
                    <input type="radio" id="network" name="category" value="network">
                    <label for="network">Network</label><br>
                  </div>
                  <div>
                    <input type="radio" id="software" name="category" value="software">
                    <label for="software">Software</label><br>
                  </div>
                  <div>
                    <input type="radio" id="hardware" name="category" value="hardware">
                    <label for="hardware">Hardware</label>
                  </div>
                </div>
            </div>
            <div class="description-container">
              <h2 class="label">Describe The Issue</h2>
              <textarea id="description"></textarea>
            </div>
            <div class="action-btns">
              <button class="btn-submit" id="btn-submit">Submit Report</button>
              <button class="btn-cancel" id="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
        <div class="alert">
          <p id="message"></p>
        </div>
      </div>
    `
  )
}

reportPage.innerHTML += loadHeader("Support Request Portal");
reportPage.innerHTML += loadSidebar();
reportPage.innerHTML += loadUserReport();
headerActions();
sidebarActions();

const submitBtn = document.getElementById("btn-submit");
const cancleBtn = document.getElementById("btn-cancel");
const cats = document.getElementsByName("category") as any;
const description = document.getElementById("description") as HTMLTextAreaElement;
let category = "";
let message = document.getElementById("message") as HTMLParagraphElement;

submitBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  for (let i = 0; i < cats.length; i++) {
    if (cats[i].checked) {
      category = cats[i].value
    }
  }
  if (category == "" && description.value == "" || category == "" || description.value == "") {
    message.innerText = "Make sure to complete your report!"
    const timout = setTimeout(() => {
      message.innerText = ""
      clearTimeout(timout)
    }, 3000)
    return;
  }

  function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  let tokenNumber = getRandomIntInclusive(10, 99).toString() + getRandomIntInclusive(10, 99).toString()
  const data = {
    tokenID: "cs-" + tokenNumber,
    category: category,
    description: description.value,
    status: "open",
    submittedOn: new Date().toLocaleString("en-ZA", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).toLowerCase(),
    notes: "",
    pc: "001",
    room: "1"
  }
  let dataArray = [];
  const jsonArray = localStorage.getItem("local-reports");
  if (jsonArray) {
    dataArray = JSON.parse(jsonArray);
    dataArray.unshift(data);
    storeData("local-reports", dataArray);
  } else {
    dataArray.unshift(data)
    storeData("local-reports", dataArray);
  }
  message.innerText = "Your Report Has Been Submitted"
  const timout = setTimeout(() => {
    message.innerText = ""
    description.value = ""
    clearTimeout(timout)
  }, 2000)
});

cancleBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "../pages/dashboard.user.html"
})
