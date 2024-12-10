import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIEAhujAN7Avcf2JKFQVbXEx125db-jjU",
  authDomain: "pluginlive-e5530.firebaseapp.com",
  projectId: "pluginlive-e5530",
  storageBucket: "pluginlive-e5530.firebasestorage.app",
  messagingSenderId: "547265511300",
  appId: "1:547265511300:web:68411c70f4e381cd8d67d1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
