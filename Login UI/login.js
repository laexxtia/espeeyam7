import app from '../config/newconfig.js';
import { getDatabase, set, ref, update, get, child, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, browserSessionPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage()
const storageref = sRef(storage);

let login = document.getElementById('submit')

if (login != null) {
    login.addEventListener("click", function() {
        const inputEmail = document.getElementById('email').value;
        const inputPassword = document.getElementById('password').value;
        console.log(inputEmail);
        console.log(inputPassword);

        if (inputEmail !== "" && inputPassword !== "") {
            signInWithEmailAndPassword(auth, inputEmail, inputPassword)
                .then(function(userCredential) {
                    // Handle successful login (userCredential.user contains the user object)
                    const user = userCredential.user;
                    console.log(user);
                    console.log("User signed in:", user);

                    onAuthStateChanged(auth, function(user) {
                        if (user) {
                            // User is signed in, redirect to authenticated page
                            const userUID = user.uid
                            const user_ref = ref(database, 'Staff/' + userUID);
                            let userData;

                            function getUserDataFromFirebase(callback) {
                                get(user_ref)
                                    .then(function(snapshot) {
                                        if (snapshot.exists()) {
                                            userData = snapshot.val();
                                        } else {
                                            userData = null;
                                        }
                                        callback(userData); // Pass the userData to the callback function
                                    })
                                    .catch(function(error) {
                                        console.error("Error fetching user data:", error);
                                        throw error;
                                    });
                            }

                            // Call the function with a callback
                            getUserDataFromFirebase(function(userData) {
                                // Now you can use 'userData' after it's populated
                                const user_accesss = userData.Access_Rights;
                                if(user_accesss ==1){
                                    window.location.href ='../Staff UI/job_listing.html'
                                }

                                else{
                                    window.location.href ='../Admin UI/job_listing.html'
                                }
                                // Continue with any other actions that depend on 'userData'
                                // ...
                            });
                        } else {
                            // User is signed out, redirect to login page
                            console.log("user is not signed in");
                        }
                    });
                })
                .catch(function(error) {
                    // Handle login failure and show an alert with the error message
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Login failed with error code:", errorCode);
                    console.error("Error message:", errorMessage);
                    alert("Login failed. Please check your email and password.");
                });
        } else {
            alert("Both fields are required!");
        }
    });
}








