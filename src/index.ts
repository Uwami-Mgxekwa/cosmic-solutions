import { popUp, popupActions } from './components/popup';
import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from './components/spinner';
import './css/index.style.css'
import Endpoints from './lib/endpoint';
import { storeData } from './lib/local-storage';
import { login } from './lib/login';

const main = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const loadIndexPage = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
      <div class="container">
        <div class="form-wrapper">
          <div class="content left" id="user-login">
              <div class="card">
                <h2> USER LOGIN</h2>
                <p class="title-left">Be part of the Cosmos</p>
                <form id="user-form">
                  <input type="text" id="user-username" name="user-username" placeholder="Username" required>
                  <div class="pass-container">
                  <input type="password" id="user-password" name="user-password" placeholder="Password" required>

                    <img src="/eye-password-show.svg" id="user-password-eye"/>
                    </div>
                  <button type="submit" id="user-submit">Login</button>
                </form>
                <div>
                  <p class="signuptext">Dont have an Account?</p>
                  <p class="signuptext"><a href="/src/pages/sign-up.user.html">Sign Up Now</a> and Report your computer problem</p>
                </div>
              </div>
          </div>
          <div class="content right" id="admin-login">
              <div class="card">
                <h2>ADMIN LOGIN</h2>
                <p class="title-right">Manage a Cosmos</p>
                <form id="admin-form">
                  <input type="text" id="admin-username" name="admin-username" placeholder="Email" required>
                  <div class="pass-container">
                    <input type="password" id="admin-password" name="admin-password" placeholder="Password" required>
                    <img src="/eye-password-show.svg" id="admin-password-eye"/>
                  </div>
                  <button type="submit" id="admin-submit">Login</button>
                </form>
              </div>
          </div>
        </div>
      </div>
      </div>
    `
  )
}

main.innerHTML += loadIndexPage();
main.innerHTML += loadSpinner()

const tabs = document.querySelectorAll(".tab");
const userLoginContent = document.getElementById("user-login");
const adminLoginContent = document.getElementById("admin-login");
const userTab = document.getElementById("user");
const adminTab = document.getElementById("admin");
const userSubmitBtn = document.getElementById("user-submit");
const adminSubmitBtn = document.getElementById("admin-submit");
const adminPasswordEye = document.getElementById("admin-password-eye") as HTMLImageElement;
const userPasswordEye = document.getElementById("user-password-eye") as HTMLImageElement;

const pcNumber = document.getElementById("user-username") as HTMLInputElement;
const userpass = document.getElementById("user-password") as HTMLInputElement;
const adminEmail = document.getElementById("admin-username") as HTMLInputElement;
const adminpass = document.getElementById("admin-password") as HTMLInputElement;

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

adminPasswordEye.addEventListener("click", () => {
  if (adminPasswordEye.getAttribute("src") == "/eye-password-show.svg") {
    adminPasswordEye.setAttribute("src", "/eye-password-hide.svg")
    adminpass.setAttribute("type", "text");
  } else {
    adminPasswordEye.setAttribute("src", "/eye-password-show.svg")
    adminpass.setAttribute("type", "password");
  }
})

userPasswordEye.addEventListener("click", () => {
  if (userPasswordEye.getAttribute("src") == "/eye-password-show.svg") {
    userPasswordEye.setAttribute("src", "/eye-password-hide.svg")
    userpass.setAttribute("type", "text");
  } else {
    userPasswordEye.setAttribute("src", "/eye-password-show.svg")
    userpass.setAttribute("type", "password");
  }
})
userSubmitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const form = document.getElementById("user-form") as HTMLFormElement;
  if (checkFormValidity(form)) {
    spinnerActionsAdd()
    const data = {
      pc: pcNumber.value,
      password: userpass.value
    }
    const res = await login(Endpoints.userLoginUrl, data)
    if (!res?.ok) {
      popUp("Login Error", res?.content.message)
      popupActions();
      spinnerActionsRemove()
      return
    }
    const resData = {
      pc: res.content.user.pc,
      room: res.content.user.room
    }
    spinnerActionsRemove()
    storeData("user", resData)
    window.location.href = "./src/pages/dashboard.user.html"
  }
})

adminSubmitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const form = document.getElementById("admin-form") as HTMLFormElement;
  if (checkFormValidity(form)) {
    spinnerActionsAdd()
    const data = {
      email: adminEmail.value,
      password: adminpass.value
    }
    let ep = "";
    if (data.email.includes("tech")) {
      ep = Endpoints.technicianLoginUrl;
    } else {
      ep = Endpoints.adminLoginUrl;
    }
    const res = await login(ep, data)
    if (!res?.ok) {
      popUp("Login Error", res?.content.message)
      popupActions();
      spinnerActionsRemove()
      return
    }
    const resData = {
      email: res.content.user.email,
      role: res.content.user.role,
      clearance_level: res.content.user.clearance_level
    }
    spinnerActionsRemove()
    storeData("admin", resData);
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

