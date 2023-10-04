import app from '../config/newconfig.js';
import { getDatabase, set, ref, update, get, child, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage()
const storageref = sRef(storage);

let login = document.getElementById('submit')

if (login != null) {
    login.addEventListener("click", async function() { // Note the 'async' keyword
        const inputEmail = document.getElementById('email').value;
        const inputPassword = document.getElementById('password').value;
        console.log(inputEmail);
        console.log(inputPassword);

        if (inputEmail !== "" && inputPassword !== "") {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, inputEmail, inputPassword);
                // Handle successful login (userCredential.user contains the user object)
                const user = userCredential.user;
                console.log(user);
                console.log("User signed in:", user);

                // Continue with any other actions after successful login
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                      // User is signed in, redirect to authenticated page
                      window.location.href = '/Staff UI/job_listing.html';
                    } else {
                      // User is signed out, redirect to login page
                      console.log("user is not signed in");
                    }
                  });
                
            } catch (error) {
                // Handle login failure and show an alert with the error message
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Login failed with error code:", errorCode);
                console.error("Error message:", errorMessage);
                alert("Login failed. Please check your email and password.");
            }
        } else {
            alert("Both fields are required!");
        }
    });
}







