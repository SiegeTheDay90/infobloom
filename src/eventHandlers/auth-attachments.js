import * as auth from "../firebase/authFunctions.js";
import { sanitizeAndCheckProfanity } from "../util/profanity-checker.js";

// Toggle Forms
const forms = {
  signIn: document.getElementById("signInForm"),
  signUp: document.getElementById("signUpForm"),
  reset: document.getElementById("resetForm"),
  delete: document.getElementById("deleteForm")
};

function showForm(formKey) {
  Object.keys(forms).forEach((key) => {
    if (key === formKey) {
      forms[key].classList.add("active");
      toggleButtons[key].classList.add("active");
    } else {
      forms[key].classList.remove("active");
      toggleButtons[key].classList.remove("active");
    }
  });
}

// Toggle Buttons
const toggleButtons = {
  signIn: document.getElementById("showSignIn"),
  signUp: document.getElementById("showSignUp"),
  reset: document.getElementById("showReset"),
  delete: document.getElementById("showDelete")
};

// Attach menu buttons
document.getElementById("showSignIn")?.addEventListener('click', () => showForm("signIn"));
document.getElementById("showSignUp")?.addEventListener('click', () => showForm("signUp"));
document.getElementById("showReset")?.addEventListener('click', () => showForm("reset"));
document.getElementById("showDelete")?.addEventListener('click', () => showForm("delete"));

// Handle Sign In
const signInForm = forms.signIn || {};
signInForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;
  try {
    await auth.signIn(email, password);
  } catch (err) {
    alert("Sign-in error: " + err.message);
  }
};

const demoButton = document.getElementById("demoBtn") || {};
demoButton.onclick = async (e) => {
  e.preventDefault();
  const email = "ClarenceSmith90@gmail.com";
  const password = "family";
  try {
    await auth.signIn(email, password);
  } catch (err) {
    alert("Sign-in error: " + err.message);
  }
}


// Handle Sign Up
const signUpForm = forms.signUp || {};
signUpForm.onsubmit = async (e) => {
  e.preventDefault();

  const form = document.getElementById("signUpForm");
  const [year, month, day] = document.getElementById("signUpBirthDate").value.split("-");
  const birthDate = new Date(year, month - 1, day);

  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;
  const firstName = document.getElementById("signUpFirstName").value;
  const lastName = document.getElementById("signUpLastName").value;
  const preferredName = document.getElementById("signUpPreferredName").value;
  const mathPeriod = parseInt(document.getElementById("signUpPeriod").value);

  const heightInInches = parseFloat(document.getElementById("signUpHeightInInches").value) || null;
  const hoursOfSleep = parseFloat(document.getElementById("signUpHoursOfSleep").value) || null;
  const screenTimeHours = parseFloat(document.getElementById("signUpScreenTimeHours").value) || null;

  const favoriteSubject = document.getElementById("signUpFavoriteSubject").value || null;
  const careerInterest = document.getElementById("signUpCareerInterest").value || null;
  const favoriteSocialMedia = document.getElementById("signUpFavoriteSocialMedia").value || null;
  const languagesSpoken = document.getElementById("signUpLanguagesSpoken").value || null;

  const hasPets = document.getElementById("signUpHasPets").value === "true";
  const petType = hasPets ? document.getElementById("signUpPetType").value : null;

  const motivationalQuote = document.getElementById("signUpMotivationalQuote").value || null;
  const superpower = document.getElementById("signUpSuperpowerChoice").value || null;

  // New fields
  const countriesVisited = parseInt(document.getElementById("signUpCountriesVisited").value) || 0;
  const siblings = parseInt(document.getElementById("signUpSiblings").value) || 0;
  const shoeSize = parseFloat(document.getElementById("signUpShoeSize").value) || null;
  const foodSpending = parseFloat(document.getElementById("signUpFoodSpending").value) || null;


  // ❗ Profanity validation using bad-words
  const textFields = {
    firstName,
    lastName,
    careerInterest,
    languagesSpoken,
    petType,
    motivationalQuote,
    superpower
  };

  for (const [fieldName, textValue] of Object.entries(textFields)) {
    if (textValue && sanitizeAndCheckProfanity(textValue)) {
      alert(`Inappropriate language detected in your ${fieldName}. Please revise.`);
      return;
    }
  }

  // Password confirmation check
  const confirmPassword = document.getElementById("signUpConfirmPassword").value;
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const userData = {
    email,
    firstName,
    lastName,
    preferredName,
    birthDate,
    mathPeriod,
    heightInInches,
    hoursOfSleep,
    screenTimeHours,
    favoriteSubject,
    careerInterest,
    favoriteSocialMedia,
    languagesSpoken,
    hasPets,
    petType,
    motivationalQuote,
    superpower,
    countriesVisited,
    siblings,
    shoeSize,
    foodSpending,
  };

  try {
    await auth.signUp(email, password, userData);
  } catch (err) {
    alert("Sign-up error: " + err.message);
  }
};


// Handle Password Reset
const resetForm = forms.reset || {};
resetForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;
  try {
    await auth.resetPassword(email);
    alert("Reset email sent. Check your inbox.");
  } catch (err) {
    alert("Reset error: " + err.message);
  }
};

const deleteForm = forms.delete || {};
deleteForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("deleteEmail").value;
  const password = document.getElementById("deletePassword").value;
  try {
    if(confirm("Are you sure? This cannot be undone.")){
      await auth.deleteAccount(email, password);
      alert(`Deleted ${email}`);
    }
  } catch (err) {
    alert("Delete error: " + err.message);
  }
};




// Handle Google
// const googleBtn = document.getElementById("googleSignIn");
// if (googleBtn) {
//   googleBtn.onclick = async () => {
//     try {
//       await auth.signInWithGoogle(); // assuming you’ve exported this function
//       // Note: if using `signInWithRedirect`, you may not reach this point immediately.
//     } catch (err) {
//       alert("Google Sign-In error: " + err.message);
//     }
//   };
// }
