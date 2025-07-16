import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
import { deleteUser, getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";
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

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is still signed in:", user.email);
    } else {
        console.log("User is signed out");
        if(window.location.href.slice(-9) !== "auth.html"){
            window.location.replace("./auth.html");
        }
    }
});