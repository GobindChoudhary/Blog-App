// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
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

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => console.log(err));
  return user;
};
