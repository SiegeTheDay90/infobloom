import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc, collection, query, where, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export async function createProfile(userData){

    const profile = {
        ...userData,
        createdAt: serverTimestamp()
    };
    const docRef = doc(db, "users", userData.uid);
    try{
        await setDoc(docRef, profile);;
        return profile;
    } catch(error){
        console.error("Error in createProfile:17");
        throw error;
    }

}

export async function updateProfile(userData){
    const profile = {
        ...userData,
        updatedAt: serverTimestamp()
    };
    const docRef = doc(db, "users", userData.uid);
    try{
        await updateDoc(docRef, profile);;
        return profile;
    } catch(error){
        console.error("Error in updateProfile:33");
        throw error;
    }
}

export async function getProfile(user){
    const fetchedDoc = await getDoc(doc(db, "users", user.uid));
    return fetchedDoc.data();
}

export async function updateStoredData(){
    const allData = await getAllData();
    localStorage.setItem('InfoBloomData', JSON.stringify(allData));
    localStorage.setItem('InfoBloomLastUpdatedAt', Date.now());
}

export async function getAllData(){
    const collectionRef = collection(db, "users");
    const snapshot = await getDocs(collectionRef);
    const allData = {};
    snapshot.forEach(doc => {
        const data = doc.data();
        console.log(data.email, " => ", data.firstName, data.lastName);
        allData[doc.id] = data;
    })
    return allData;
}