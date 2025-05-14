import { loadSpinner, spinnerActionsAdd, spinnerActionsRemove } from './components/spinner';
import './css/index.style.css'
import { storeData } from './lib/local-storage';
import { login } from './lib/login';

const userLoginUrl = "https://nodeserver-v2.onrender.com/api/user/login"
const adminLoginUrl = "https://nodeserver-v2.onrender.com/api/admin/login"
// const userLoginUrl = "http://localhost:8080/api/user/login"
// const adminLoginUrl = "http://localhost:8080/api/admin/login"
const main = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");
const loadIndexPage = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="logo">
          <img src="/meteor.svg" />
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
main.innerHTML += loadSpinner()

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

userSubmitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  spinnerActionsAdd()
  const form = document.getElementById("user-form") as HTMLFormElement;
  if (checkFormValidity(form)) {
    const data = {
      pc: pcNumber.value,
      password: userpass.value
    }
    const res = await login(userLoginUrl, data)
    if (!res?.ok) {
      alertMessage.innerText = res?.content.message
      const timout = setTimeout(() => {
        alertMessage.innerText = ""
        clearTimeout(timout)
      }, 2000)
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
  spinnerActionsAdd()
  const form = document.getElementById("admin-form") as HTMLFormElement;
  if (checkFormValidity(form)) {
    const data = {
      email: adminEmail.value,
      password: adminpass.value
    }
    const res = await login(adminLoginUrl, data)
    if (!res?.ok) {
      alertMessage.innerText = res?.content.message
      const timout = setTimeout(() => {
        alertMessage.innerText = ""
        clearTimeout(timout)
      }, 2000)
      return
    }
    const resData = {
      email: res.content.user.email
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

