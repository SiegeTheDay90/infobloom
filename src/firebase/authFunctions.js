import { initializeApp } from "firebase/app"
import { deleteUser, getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import { createProfile, getProfile, getAllData, updateStoredData } from "./dataFunctions";
import { updateDisplay } from "../ui/data-display";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function signUp(email, password, profile){
    try {
        sessionStorage.setItem('InfoBloomTempProfile', JSON.stringify(profile));
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw error; // optional: rethrow if you want to handle it elsewhere
    }
}

export async function signIn(email, password){
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error) {
        console.error(error.code, ":", error.message);
        throw error;
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

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is still signed in:", user.email);
        
        // Store current user id
        localStorage.setItem("InfoBloomUser", user.uid);

        // Last time data updated (or null)
        const lastUpdate = new Date(Number(localStorage.getItem('InfoBloomLastUpdatedAt')));
        const now = new Date();

        // Reload data if >30 minutes old, or missing
        if(now - lastUpdate >= 30 * 60 * 1000 || !localStorage.getItem('InfoBloomData') || sessionStorage.getItem('InfoBloomTempProfile')){
        // if(!localStorage.getItem('InfoBloomData') || sessionStorage.getItem('InfoBloomTempProfile')){
            try{
                const tempProfile = JSON.parse(sessionStorage.getItem('InfoBloomTempProfile'));
                if(tempProfile){
                    await createProfile({...user, ...tempProfile});
                    sessionStorage.removeItem('InfoBloomTempProfile')
                }
                await updateStoredData();
                console.log("New Data Printed Above?");            
            } catch(error){
                console.error("Data did not update properly.");
                console.error(error);
            }
        }

        // redirect if not on data page
        if(window.location.href.slice(-9) !== "data.html"){
            // setTimeout(() => 
                window.location.replace("./data.html")
            // , 500);
        }
    } else {
        console.log("User is signed out");

        // Remove user, keep data?
        localStorage.removeItem('InfoBloomUser');
        // localStorage.removeItem('InfoBloomData');
        // localStorage.removeItem('InfoBloomLastUpdatedAt');

    
        // redirect if not on auth page
        if(window.location.href.slice(-9) !== "auth.html"){
            // setTimeout(() => 
                window.location.replace("./auth.html")
            // , 500);
        }
    }
});


// Call this function when your app loads, *after* Firebase is initialized.
// This is the function that processes the result after the redirect.
// getRedirectResult(auth)
//   .then((result) => {
//     if (result) {
//       // This means a redirect result was successfully processed.
//       // The user object is part of this result.
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;
//       const user = result.user;
      
//       console.log("Redirect sign-in successful!");
//       console.log("User:", user.displayName, user.email);
      
//       // No need to explicitly update UI here, onAuthStateChanged will handle it.
//     } else {
//       // No redirect result to process, or user signed in previously (handled by onAuthStateChanged).
//     }
//   })
//   .catch((error) => {
//     // Handle errors from the redirect.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     const email = error.customData.email;
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     console.error("Error during redirect sign-in:", errorMessage);
//   });

// Remember to also have your onAuthStateChanged listener running!
// It will pick up the user from the redirect result.
