import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoxvTy8RgZfPpLIwNCrZLlG0T-78Vg1Fk",
  authDomain: "nwitter-reloaded-cce1a.firebaseapp.com",
  projectId: "nwitter-reloaded-cce1a",
  storageBucket: "nwitter-reloaded-cce1a.appspot.com",
  messagingSenderId: "586885029123",
  appId: "1:586885029123:web:52fcdccf69981205e19d36",
};

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
