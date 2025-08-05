import * as auth from "../firebase/authFunctions.js";
import { updateProfile, updateStoredData } from "../firebase/dataFunctions.js";
import { updateDisplay } from "../ui/data-display.js";
import { sanitizeAndCheckProfanity } from "../util/profanity-checker.js";

// Handle Sign Out
const signOutButton = document.getElementById("signOutButton") || {};
signOutButton.onclick = async (e) => {
  e.preventDefault();
  try {
    if(confirm("Are you sure you want to sign out?")) {
      await auth.signOutUser();
      alert("Signed out successfully.");
    }
  } catch (err) {
    alert("Sign-out error: " + err.message);
  }
};

// Profile Update Button
const updateProfileBtn = document.getElementById("updateProfileBtn") || {};
const profileBadgeForms = Array.from(document.querySelectorAll(".badge-form .form-control,.form-select"));
const userId = localStorage.getItem("InfoBloomUser");
const profile = {uid: userId};
updateProfileBtn.onclick = async (e) => {
  try{
    profileBadgeForms.forEach((input) => {
      if(input.value) {
        if(sanitizeAndCheckProfanity(input.value) === false){
          profile[input.name] = input.value;
        } else {
          alert(`Inappropriate language detected in your ${input.name}. Please revise.`);
          return;
        }
      }
    })
    await updateProfile(profile);
    await updateStoredData();
    updateProfileBtn.classList.add("d-none");
    updateDisplay();
  } catch(error){
    console.log("Profile could not update.");
    throw error;
  }
}

const menuButtons = {
  myProfile: document.getElementById('showMyProfile'),
  myData: document.getElementById('showMyData'),
  populationData: document.getElementById('showPopulationData'),
  wordClouds: document.getElementById('showWordClouds'),
  forceRefresh: document.getElementById('forceRefresh'),
}

const mainDivs = {
  myProfile: document.getElementById('myProfile'),
  myData: document.getElementById('myData'),
  populationData: document.getElementById('populationData'),
  wordClouds: document.getElementById('wordClouds'),
}

function showForm(formKey) {
  Object.keys(mainDivs).forEach((key) => {
    if (key === formKey) {
      menuButtons[key].classList.add("active");
      mainDivs[key].classList.add("active");
      window.location.hash = `#${key}Tab`;
    } else {
      menuButtons[key].classList.remove("active");
      mainDivs[key].classList.remove("active");
    }
  });
}

// Attach menu buttons
document.getElementById("showMyProfile")?.addEventListener('click', () => showForm("myProfile"));
document.getElementById("showMyData")?.addEventListener('click', () => showForm("myData"));
document.getElementById("showPopulationData")?.addEventListener('click', () => showForm("populationData"));
document.getElementById("showWordClouds")?.addEventListener('click', () => showForm("wordClouds"));
document.getElementById("forceRefresh")?.addEventListener('click', async () => {await updateStoredData(); updateDisplay();});

if(window.location.hash === "#myProfileTab") {
  showForm("myProfile");
} else if(window.location.hash === "#myDataTab") {
  showForm("myData");
} else if (window.location.hash === "#wordCloudsTab") {
  showForm("wordClouds");
}

if(window.location.href.split("/").at(-1).split("#")[0] === "data.html") updateDisplay();