import { initializeApp } from "firebase/app";

import { 
getAuth 
} from "firebase/auth";

import {
getFirestore
} from "firebase/firestore";



const firebaseConfig = {

apiKey: "AIzaSyAEoYL8Yh-mohVSLOY66QAdTg70xUd4nzQ",
authDomain: "cryptox-fe048.firebaseapp.com",
projectId: "cryptox-fe048",
storageBucket: "cryptox-fe048.firebasestorage.app",
messagingSenderId: "775341539641",
appId: "1:775341539641:web:c92c21bc479f79a542a8e8",
measurementId: "G-7YHS6WM0KF"

};




const app = initializeApp(firebaseConfig);



export const auth = getAuth(app);


export const db = getFirestore(app);