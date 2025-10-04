// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkCmsex-uIo1jysBkiytR5q5nFxAWaL-Q",
  authDomain: "blog-app-afce4.firebaseapp.com",
  projectId: "blog-app-afce4",
  storageBucket: "blog-app-afce4.firebasestorage.app",
  messagingSenderId: "674336470396",
  appId: "1:674336470396:web:3a44077c941630d0a820f9",
  measurementId: "G-JGGWC0JL7L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  try {
    // Try popup first, fall back to redirect if COOP error
    await signInWithPopup(auth, provider).then((result) => {
      user = result.user;
    });
  } catch (err) {
    console.log("Popup failed, trying redirect:", err);
    // If popup fails due to COOP, use redirect
    await signInWithRedirect(auth, provider);
    // Handle redirect result on page load
    await getRedirectResult(auth).then((result) => {
      if (result) {
        user = result.user;
      }
    });
  }

  return user;
};
