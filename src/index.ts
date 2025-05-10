import './css/index.style.css'
import meteor from './assets/meteor.svg'
import { admin, user } from './assets/data';
import { storeData } from './lib/local-storage';

const main = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const loadIndexPage = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="logo">
          <img src=${meteor} />
          <h1>cosmic solutions</h1>
        </div>
      <div class="container">
        <div class="tab-container">
          <h1 class="tab tab-active" id="user">User</h1>
          <h1 class="tab" id="admin">Admin</h1>
        </div>
        <div class="form-wrapper">
          <div class="content content-active" id="user-login">
              <div class="card">
                <h2> USER LOGIN</h2>
                <form id="user-form">
                  <input type="text" id="user-username" name="user-username" placeholder="PC Number" required>
                  <input type="password" id="user-password" name="user-password" placeholder="Password" required>
                  <button type="submit" id="user-submit">Login</button>
                </form>
              </div>
          </div>
          <div class="content" id="admin-login">
              <div class="card">
                <h2>ADMIN LOGIN</h2>
                <form id="admin-form">
                  <input type="text" id="admin-username" name="admin-username" placeholder="Email" required>
                  <input type="password" id="admin-password" name="admin-password" placeholder="Password" required>
                  <button type="submit" id="admin-submit">Login</button>
                </form>
              </div>
          </div>
        </div>
      </div>
        <div class="alert">
          <p id="alert-message"></p>
        </div>
      </div>
    `
  )
}

main.innerHTML += loadIndexPage();

const tabs = document.querySelectorAll(".tab");
const userLoginContent = document.getElementById("user-login");
const adminLoginContent = document.getElementById("admin-login");
const userTab = document.getElementById("user");
const adminTab = document.getElementById("admin");
const userSubmitBtn = document.getElementById("user-submit");
const adminSubmitBtn = document.getElementById("admin-submit");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    let id = tab.getAttribute("id");
    if (id == "user") {
      userTab?.classList.add("tab-active");
      adminTab?.classList.remove("tab-active");
      userLoginContent?.classList.add("content-active");
      adminLoginContent?.classList.remove("content-active");
    } else {
      adminTab?.classList.add("tab-active");
      userTab?.classList.remove("tab-active");
      adminLoginContent?.classList.add("content-active");
      userLoginContent?.classList.remove("content-active");
    }

  })

})

const pcNumber = document.getElementById("user-username") as HTMLInputElement;
const userpass = document.getElementById("user-password") as HTMLInputElement;
const adminEmail = document.getElementById("admin-username") as HTMLInputElement;
const adminpass = document.getElementById("admin-password") as HTMLInputElement;
const alertMessage = document.getElementById("alert-message") as HTMLParagraphElement;

userSubmitBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  const form = document.getElementById("user-form") as HTMLFormElement;
  if (checkFormValidity(form)) {
    const registeredUser = user;
    const pcNumberValue = pcNumber.value;
    const userPassValue = userpass.value;
    if (pcNumberValue !== registeredUser.pc && userPassValue !== registeredUser.password) {
      alertMessage.innerText = "Incorrect Credentials"
      const timout = setTimeout(() => {
        alertMessage.innerText = ""
        pcNumber.value = "";
        userpass.value = "";
        clearTimeout(timout)
      }, 2000)
      return
    }

    const data = {
      pc: pcNumberValue,
      room: registeredUser.room
    }

    storeData("user", data)
    window.location.href = "./src/pages/dashboard.user.html"
  }
})

adminSubmitBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  const form = document.getElementById("admin-form") as HTMLFormElement;
  if (checkFormValidity(form)) {
    const registeredAdmin = admin;
    const adminEmailValue = adminEmail.value;
    const adminpassValue = adminpass.value;
    if (adminEmailValue !== registeredAdmin.email && adminpassValue !== registeredAdmin.password) {
      alertMessage.innerText = "Incorrect Credentials"
      const timout = setTimeout(() => {
        alertMessage.innerText = ""
        adminEmail.value = "";
        adminpass.value = "";
        clearTimeout(timout)
      }, 2000)
      return
    }
    const data = {
      email: adminEmailValue,
    }
    storeData("admin", data);
    window.location.href = "./src/pages/dashboard.admin.html"
  }
})

const checkFormValidity = (form: HTMLFormElement) => {
  if (!form.checkValidity()) {
    let tmpSubmit = document.createElement("button");
    form.appendChild(tmpSubmit);
    tmpSubmit.click();
    form.removeChild(tmpSubmit);
    return false;
  } else {
    return true;
  }
};
