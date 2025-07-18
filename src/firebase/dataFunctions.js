import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc, collection, query, where, getDocs, getDocsFromServer } from "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export async function createProfile(newUser){

    const profile = {
        uid: newUser.uid,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        birthDate: newUser.birthDate,
        mathPeriod: newUser.mathPeriod,
    };
    const docRef = doc(db, "users", newUser.uid);
    try{
        await setDoc(docRef, profile);;
        return profile;
    } catch{
        return null;
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
    const snapshot = await getDocsFromServer(collectionRef);
    const allData = {};
    snapshot.forEach(doc => {
        const data = doc.data();
        console.log(data.email, " => ", data.firstName, data.lastName);
        allData[doc.id] = data;
    })
    return allData;
}



// const querySnapshot = await getDocs(collection(db, "cities"));
// querySnapshot.forEach((doc) => {
//   // doc.data() is never undefined for query doc snapshots
//   console.log(doc.id, " => ", doc.data());
// });