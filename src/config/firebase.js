import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyDN3pKuDedYmBpd2htOYWv3jiHao-3xaVk",
  authDomain: "fir-tutorial-fdb7f.firebaseapp.com",
  projectId: "fir-tutorial-fdb7f",
  storageBucket: "fir-tutorial-fdb7f.appspot.com",
  messagingSenderId: "207111840018",
  appId: "1:207111840018:web:adb82cd0d2a422bcc6d3cb",
  measurementId: "G-3FLTZKCTFV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const googleProvider=new GoogleAuthProvider();
export const  db=getFirestore(app);
export const storage=getStorage(app);