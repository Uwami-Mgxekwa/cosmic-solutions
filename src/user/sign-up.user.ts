import "../css/sign-up.style.css"
import { countries } from "../lib/countries";
const main = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement("div");

const loadRegisterPage = () => {
  return (
    container.innerHTML = `
      <div class="wrapper">
        <div class="container">
          <div class="form-wrapper">
            <div class="content left">
                <div class="card">
                  <h2> USER REGISTER</h2>
                  <p class="title-left">Join the Cosmos</p>
                  <form id="user-form">
                    <input type="text" id="user-name" name="user-name" placeholder="Name" required>
                    <input type="text" id="user-lastName" name="user-lastName" placeholder="Last Name" required>
                    <input type="text" id="user-email" name="user-email" placeholder="Email" required>
                  <div class="country-wrapper">
                    <input type="text" id="user-country" name="user-country" placeholder="Country" required>
                    <ul id="autocomplete"></ul>
                  </div>
                    <input type="password" id="user-password" name="user-password" placeholder="Password" required>
                    <button type="submit" id="user-submit">Sign Up</button>
                  </form>
                  </div>
                <div>
                  <p class="signuptext">Already Signed Up?</p>
                  <p class="signuptext"><a href="/">Log In Now</a> and Report your computer problem</p>
                </div>
            </div>
            <div class="content right">
              <img src="/galactic-tech.png"/>
            </div>

          </div>
      </div>
    `
  )
}
main.innerHTML += loadRegisterPage();

const userCountry = document.getElementById("user-country") as HTMLInputElement;
const autocomplete = document.getElementById("autocomplete") as HTMLElement;

userCountry.addEventListener("keyup", (e) => {
  e.preventDefault()
  if (userCountry.value.length < 1) {
    autocomplete.replaceChildren("")
    return;
  }
  complete(userCountry.value)

});

const complete = (val: string) => {
  let searchList: any = [];
  countries.forEach((c) => {

    if (c.name.toLowerCase().includes(val.toLowerCase())) {
      searchList.push(c.name)
    }
  });

  autocomplete.replaceChildren("")
  searchList.forEach((l: any) => {
    autocomplete.innerHTML += `
      <li class="country" data-set-name=${l}>${l}</li>
    `
  })
  const country = document.querySelectorAll(".country");
  country.forEach((cou) => {
    cou.addEventListener("click", () => {
      userCountry.value = cou.getAttribute("data-set-name") || " "
      autocomplete.replaceChildren("")
    })
  })
}

