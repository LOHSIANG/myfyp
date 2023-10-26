import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAq9iz42f8drunTi1d2wyoEXsR8vOYFNys",
  authDomain: "ims-reactjs.firebaseapp.com",
  databaseURL: "https://ims-reactjs-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ims-reactjs",
  storageBucket: "ims-reactjs.appspot.com",
  messagingSenderId: "523303252798",
  appId: "1:523303252798:web:8d4aadce226f49e5d1726f",
  measurementId: "G-G09XT4B206"
};

const app = initializeApp(firebaseConfig);
export const database = getAuth(app)