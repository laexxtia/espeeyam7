import app from '../config/newconfig.js';
import { getDatabase, set, ref, update, get, child, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const database = getDatabase(app);
const auth = getAuth();

auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log(user)
        var uid = user.uid;
        console.log(uid)
        const user_ref = ref(database, 'Staff/' + uid)

        console.log("USER IS LOGGED IN")
        console.log("User UID: " + uid);
        console.log('User email:'+ user.email);
        getUserDataFromFirebase()

        let userData

        async function getUserDataFromFirebase() {
            try {
                const snapshot = await get(user_ref); 
                if (snapshot.exists()) {
                    userData = snapshot.val(); 
                    const staff_name = userData.HR_FName + " " + userData.HR_LName
                    const staff_email = userData.Email
                    
                    let staffname = document.getElementById('staffname')
                    staffname.innerHTML = staff_name
                    
                    let staffemail = document.getElementById('staffemail')
                    staffemail.innerHTML = staff_email

                } else {
                    userData = null;
                }

            } catch (error) {
                console.error("Error fetching user data:", error);
                throw error;
            }
        }

    } else {
        // No user is signed in. Handle this case if necessary.
        console.log("No user is signed in.");
        window.location.href = '/Login UI/login.html'
    }
});


