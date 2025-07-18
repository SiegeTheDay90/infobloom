import * as auth from "../firebase/authFunctions.js";

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

// Handle Sign Up
const signUpForm = forms.signUp || {};
signUpForm.onsubmit = async (e) => {
  e.preventDefault();
  let [year, month, day] = document.getElementById("signUpBirthdate").value.split("-");

  
  
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;
  const firstName = document.getElementById("signUpFirstName").value;
  const lastName = document.getElementById("signUpLastName").value;
  const birthDate = new Date(year, month-1, day).toDateString();
  const mathPeriod = document.getElementById("signUpPeriod").value;
  try {
    await auth.signUp(email, password, {email, firstName, lastName, birthDate, mathPeriod});
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
