import * as auth from "../firebase/authFunctions.js";
import { updateProfile, updateStoredData } from "../firebase/dataFunctions.js";
import { updateDisplay } from "../ui/data-display.js";

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
      if(input.value){
        profile[input.name] = input.value;
      }
    })
    await updateProfile(profile);
    await updateStoredData();
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
    forceRefresh: document.getElementById('forceRefresh')
}

const mainDivs = {
    myProfile: document.getElementById('myProfile'),
    myData: document.getElementById('myData'),
    populationData: document.getElementById('populationData')
}

function showForm(formKey) {
    Object.keys(mainDivs).forEach((key) => {
      if (key === formKey) {
        menuButtons[key].classList.add("active");
        mainDivs[key].classList.add("active");
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
document.getElementById("forceRefresh")?.addEventListener('click', async () => {await updateStoredData(); updateDisplay();});


if(window.location.href.slice(-9) == "data.html") updateDisplay();