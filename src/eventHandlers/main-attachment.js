import * as auth from "../firebase/authFunctions.js";

// Handle Sign Out
const signOutButton = document.getElementById("signOutButton") || {};
signOutButton.onclick = async (e) => {
  e.preventDefault();
  try {
    await auth.signOutUser();
    sessionStorage.removeItem("userProfile_IB");
    alert("Signed out successfully.");
  } catch (err) {
    alert("Sign-out error: " + err.message);
  }
};

const menuButtons = {
    myProfile: document.getElementById('showMyProfile'),
    myData: document.getElementById('showMyData'),
    populationData: document.getElementById('showPopulationData')
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