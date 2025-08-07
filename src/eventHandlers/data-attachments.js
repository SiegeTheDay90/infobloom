import * as auth from "../firebase/authFunctions.js";
import { updateProfile, updateStoredData } from "../firebase/dataFunctions.js";
import { updateDisplay } from "../ui/data-display.js";
import { sanitizeAndCheckProfanity } from "../util/profanity-checker.js";

// Sign Out
const signOutButton = document.getElementById("signOutButton");
signOutButton?.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    if (confirm("Are you sure you want to sign out?")) {
      await auth.signOutUser();
      alert("Signed out successfully.");
    }
  } catch (err) {
    alert("Sign-out error: " + err.message);
  }
});

// Update Profile
const updateProfileBtn = document.getElementById("updateProfileBtn");
const profileBadgeForms = Array.from(document.querySelectorAll(".badge-form .form-control,.form-select"));
const userId = localStorage.getItem("InfoBloomUser");
const profile = { uid: userId };

updateProfileBtn?.addEventListener("click", async () => {
  try {
    profileBadgeForms.forEach((input) => {
      if (input.value) {
        if (sanitizeAndCheckProfanity(input.value) === false) {
          profile[input.name] = input.value;
        } else {
          alert(`Inappropriate language detected in your ${input.name}. Please revise.`);
          return;
        }
      }
    });

    await updateProfile(profile);
    await updateStoredData();
    updateProfileBtn.classList.add("d-none");
    updateDisplay();
  } catch (error) {
    console.error("Profile could not update.", error);
  }
});

// === Menu Navigation Setup ===
const menuButtons = {
  myProfile: document.getElementById("showMyProfile"),
  myPercentiles: document.getElementById("showMyPercentiles"),
  univariateData: document.getElementById("showUnivariate"),
  bivariateData: document.getElementById("showBivariate"),
  qualitativeData: document.getElementById("showQualitative"),
};

const mainDivs = {
  myProfile: document.getElementById("myProfile"),
  myPercentiles: document.getElementById("myPercentiles"),
  univariateData: document.getElementById("univariateData"),
  bivariateData: document.getElementById("bivariateData"),
  qualitativeData: document.getElementById("qualitativeData"),
};

function showTab(tabKey) {
  for (const key in mainDivs) {
    menuButtons[key]?.classList.toggle("active", key === tabKey);
    mainDivs[key]?.classList.toggle("active", key === tabKey);
  }
  window.location.hash = `#${tabKey}Tab`;
}

// Attach listeners
Object.entries(menuButtons).forEach(([key, btn]) => {
  btn?.addEventListener("click", () => showTab(key));
});

// Hash-based tab load
const tabHash = window.location.hash;
if (tabHash.includes("myPercentiles")) showTab("myPercentiles");
else if (tabHash.includes("univariateData")) showTab("univariateData");
else if (tabHash.includes("bivariateData")) showTab("bivariateData");
else if (tabHash.includes("qualitativeData")) showTab("qualitativeData");
else showTab("myProfile");

// Optional: Data display
if (window.location.href.split("/").at(-1).split("#")[0] === "data.html") {
  updateDisplay();
}
