import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
import { deleteUser, getAuth, GoogleAuthProvider, getRedirectResult, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export async function signUp(email, password){
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error(error.code, ":", error.message);
        // throw error; // optional: rethrow if you want to handle it elsewhere
    }
}

export async function signIn(email, password){
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error(error.code, ":", error.message);
        // throw error;
    }
}



export async function signInWithGoogle(){
    const provider = new GoogleAuthProvider();
    return await signInWithRedirect(auth, provider);
}

export const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log("Sign Out Successful");
    } catch (error) {
        console.error(error.code, ":", error.message);
    }
};

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent");
    } catch (error) {
        console.error(error.code, ":", error.message);
        throw error;
    }
}

export async function deleteAccount(email, password){
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await deleteUser(userCredential.user);
        window.location.reload();
    } catch (error) {
        console.error(error.code, ":", error.message);
        throw error;
    }
}

// Call this function when your app loads, *after* Firebase is initialized.
// This is the function that processes the result after the redirect.
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      // This means a redirect result was successfully processed.
      // The user object is part of this result.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      
      console.log("Redirect sign-in successful!");
      console.log("User:", user.displayName, user.email);
      
      // No need to explicitly update UI here, onAuthStateChanged will handle it.
    } else {
      debugger;
      // No redirect result to process, or user signed in previously (handled by onAuthStateChanged).
    }
  })
  .catch((error) => {
    // Handle errors from the redirect.
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error("Error during redirect sign-in:", errorMessage);
  });

// Remember to also have your onAuthStateChanged listener running!
// It will pick up the user from the redirect result.

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is still signed in:", user.email);
        if(window.location.href.slice(-9) == "auth.html"){
            window.location.replace("./index.html");
        }
    } else {
        console.log("User is signed out");
        if(window.location.href.slice(-9) !== "auth.html"){
            window.location.replace("./auth.html");
        }
    }
});