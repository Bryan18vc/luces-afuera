
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
  "apiKey": "AIzaSyDmq74BLw4PlUy6BuX9HnsvOeMEoQvN9x8",
  "authDomain": "michi-online-a66e1.firebaseapp.com",
  "databaseURL": "https://michi-online-a66e1-default-rtdb.firebaseio.com/",
  "projectId": "michi-online-a66e1",
  "storageBucket": "michi-online-a66e1.firebasestorage.app",
  "messagingSenderId": "667003559125",
  "appId": "1:667003559125:web:f5767fa0b52ec744c4d65c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
