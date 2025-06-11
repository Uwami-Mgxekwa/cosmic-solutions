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
                  <h2>USER LOGIN</h2>
                  <p class="title-left">Be part of the Cosmos</p>
                  <form id="user-form">
                    <div class="form-group">
                      <input type="text" id="user-username" name="user-username" placeholder="Username" required>
                    </div>
                    <div class="form-group">
                      <div class="pass-container">
                        <input type="password" id="user-password" name="user-password" placeholder="Password" required>
                        <img src="/eye-password-show.svg" id="user-password-eye" alt="Toggle password visibility"/>
                      </div>
                    </div>
                    <button type="submit" id="user-submit">Login</button>
                  </form>
                  <div class="signuptext">
                    <p>Don't have an Account?</p>
                    <p><a href="/src/pages/sign-up.user.html">Sign Up Now</a> and Report your computer problem</p>
                  </div>
                </div>
            </div>
            <div class="content right" id="admin-login">
                <div class="card">
                  <h2>ADMIN LOGIN</h2>
                  <p class="title-right">Manage a Cosmos</p>
                  <form id="admin-form">
                    <div class="form-group">
                      <input type="email" id="admin-username" name="admin-username" placeholder="Email" required>
                    </div>
                    <div class="form-group">
                      <div class="pass-container">
                        <input type="password" id="admin-password" name="admin-password" placeholder="Password" required>
                        <img src="/eye-password-show.svg" id="admin-password-eye" alt="Toggle password visibility"/>
                      </div>
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

const userSubmitBtn = document.getElementById("user-submit") as HTMLButtonElement;
const adminSubmitBtn = document.getElementById("admin-submit") as HTMLButtonElement;
const adminPasswordEye = document.getElementById("admin-password-eye") as HTMLImageElement;
const userPasswordEye = document.getElementById("user-password-eye") as HTMLImageElement;

const pcNumber = document.getElementById("user-username") as HTMLInputElement;
const userpass = document.getElementById("user-password") as HTMLInputElement;
const adminEmail = document.getElementById("admin-username") as HTMLInputElement;
const adminpass = document.getElementById("admin-password") as HTMLInputElement;

const setupPasswordToggle = (eyeElement: HTMLImageElement, passwordInput: HTMLInputElement) => {
  eyeElement.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    // Toggle password visibility
    passwordInput.type = isPassword ? "text" : "password";

    eyeElement.src = isPassword ? "/eye-password-hide.svg" : "/eye-password-show.svg";

    eyeElement.style.transform = "scale(0.9)";
    setTimeout(() => {
      eyeElement.style.transform = "scale(1)";
    }, 150);
    passwordInput.focus();
  });

  eyeElement.addEventListener("mouseenter", () => {
    eyeElement.style.opacity = "1";
  });

  eyeElement.addEventListener("mouseleave", () => {
    eyeElement.style.opacity = "0.6";
  });
};

setupPasswordToggle(adminPasswordEye, adminpass);
setupPasswordToggle(userPasswordEye, userpass);

userSubmitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const form = document.getElementById("user-form") as HTMLFormElement;

  if (checkFormValidity(form)) {
    userSubmitBtn.classList.add('loading');
    userSubmitBtn.disabled = true;
    const originalText = userSubmitBtn.textContent;
    userSubmitBtn.textContent = 'Logging in...';

    spinnerActionsAdd();

    const data = {
      pc: pcNumber.value.trim(),
      password: userpass.value
    };

    try {
      const res = await login(Endpoints.userLoginUrl, data);

      if (!res?.ok) {
        popUp("Login Error", res?.content.message || "Login failed. Please try again.");
        popupActions();
      } else {
        const resData = {
          pc: res.content.user.pc,
          room: res.content.user.room
        };

        storeData("user", resData);

        userSubmitBtn.textContent = 'Success!';
        setTimeout(() => {
          window.location.href = "./src/pages/dashboard.user.html";
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      popUp("Connection Error", "Unable to connect. Please check your internet connection and try again.");

      const res = await login(Endpoints.userLoginUrl, data)
      if (!res?.ok) {
        let message = res?.content.message
        if (typeof message == "undefined") {
          message = "Seems like there is a network error or the server is down"
        }
        popUp("Login Error", message)

        popupActions();
      }
    } finally {
      spinnerActionsRemove();
      userSubmitBtn.classList.remove('loading');
      userSubmitBtn.disabled = false;
      userSubmitBtn.textContent = originalText || 'Login';
    }
  }
});

adminSubmitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const form = document.getElementById("admin-form") as HTMLFormElement;

  if (checkFormValidity(form)) {
    adminSubmitBtn.classList.add('loading');
    adminSubmitBtn.disabled = true;
    const originalText = adminSubmitBtn.textContent;
    adminSubmitBtn.textContent = 'Logging in...';

    spinnerActionsAdd();

    const data = {
      email: adminEmail.value.trim().toLowerCase(),
      password: adminpass.value
    };

    let ep = "";
    if (data.email.includes("tech")) {
      ep = Endpoints.technicianLoginUrl;
    } else {
      ep = Endpoints.adminLoginUrl;
    }

    try {
      const res = await login(ep, data);
      if (!res?.ok) {
        popUp("Login Error", res?.content.message || "Login failed. Please try again.");
        popupActions();
      } else {
        const resData = {
          email: res.content.user.email,
          role: res.content.user.role,
          clearance_level: res.content.user.clearance_level
        };

        storeData("admin", resData);

        // Success feedback
        adminSubmitBtn.textContent = 'Success!';
        setTimeout(() => {
          window.location.href = "./src/pages/dashboard.admin.html";
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      popUp("Connection Error", "Unable to connect. Please check your internet connection and try again.");
      const res = await login(ep, data)
      if (!res?.ok) {
        let message = res?.content.message
        if (typeof message == "undefined") {
          message = "Seems like there is a network error or the server is down"
        }
        popUp("Login Error", message)

        popupActions();
      }
    } finally {
      spinnerActionsRemove();
      adminSubmitBtn.classList.remove('loading');
      adminSubmitBtn.disabled = false;
      adminSubmitBtn.textContent = originalText || 'Login';
    }
  }
});

const checkFormValidity = (form: HTMLFormElement): boolean => {
  const inputs = form.querySelectorAll('input[required]');
  let isValid = true;

  inputs.forEach(input => {
    const inputElement = input as HTMLInputElement;
    if (!inputElement.value.trim()) {
      inputElement.style.borderColor = 'var(--error)';
      inputElement.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
      isValid = false;

      inputElement.addEventListener('input', () => {
        inputElement.style.borderColor = '';
        inputElement.style.boxShadow = '';
      }, { once: true });
    }
  });

  if (!isValid) {
    form.style.animation = 'shake 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
      form.style.animation = '';
    }, 500);
  }

  return isValid;
};

const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

const enhanceInputs = () => {
  const inputs = document.querySelectorAll('input');

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement?.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement?.classList.remove('focused');
      }
    });

    input.addEventListener('input', () => {
      if (input.validity.valid) {
        input.style.borderColor = 'var(--success)';
      } else if (input.value) {
        input.style.borderColor = 'var(--error)';
      } else {
        input.style.borderColor = '';
      }
    });
  });
};

enhanceInputs();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement?.tagName === 'INPUT') {
      const form = activeElement.closest('form');
      const submitButton = form?.querySelector('button[type="submit"]') as HTMLButtonElement;
      submitButton?.click();
    }
  }
});

const manageFocus = () => {
  const firstUserInput = document.getElementById('user-username');
  firstUserInput?.focus();
};

setTimeout(manageFocus, 100);
