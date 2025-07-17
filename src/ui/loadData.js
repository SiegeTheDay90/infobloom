import { getAllData } from "../firebase/dataFunctions";

const user = JSON.parse(sessionStorage.getItem('userProfile_IB'));
const uid = user?.uid;
// debugger;

if(uid){
    getAllData();
}