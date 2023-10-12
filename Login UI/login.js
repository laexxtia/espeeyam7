import app from '../config/newconfig.js';
import { getDatabase, set, ref, update, get, child, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, browserSessionPersistence, setPersistence} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage()
const storageref = sRef(storage);

let login = document.getElementById('submit')

let userData

async function getUserDataFromFirebase(user_ref) {
    try {
        const snapshot = await get(user_ref); // Retrieve data from the Firebase Realtime Database using the 'user_ref' you defined
        if (snapshot.exists()) {
            userData = snapshot.val(); // Assign the retrieved data to the 'userData' variable
        } else {
            userData = null; // Set 'userData' to null or another appropriate value when no data exists
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

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
                      const userUID = user.uid
                      const user_ref = ref(database, 'Staff/' + userUID)
                      getUserDataFromFirebase(user_ref)
                      console.log(userUID)
                      console.log(userData)
                    

                    
                      
                      if(userRole == '1'){
                        setPersistence(auth, browserSessionPersistence)
                        window.location.href = '/Staff UI/job_listing.html';
                      }
                      else{
                        setPersistence(auth, browserSessionPersistence)
                        window.location.href = '/Admin UI/job_listing.html';
                      }

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







