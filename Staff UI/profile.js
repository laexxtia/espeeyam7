import app from '../config/newconfig.js';
import { getDatabase, set, ref, update, get, child, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const database = getDatabase(app);
const auth = getAuth();
const storage = getStorage()
const storageref = sRef(storage);
const jobsRef = ref(database, 'jobs'); // Assuming 'jobs' is the path to your jobs data

auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log(user)
        var uid = user.uid;
        const user_ref = ref(database, 'Staff/' + uid)

        console.log("USER IS LOGGED IN")
        console.log("User UID: " + uid);
        console.log('User email:'+ user.email);
        getUserDataFromFirebase()

        let jobs; // Declare a variable to store the jobs data
        let userData

        const jobsHeading = document.querySelector(".container-fluid h2");
        const jobsMainContainer = document.querySelector(".jobs-list-container")
        const jobSearch = document.querySelector(".form-control")

        let searchTerm = "";

        jobSearch.addEventListener("input", () => {
            searchTerm = jobSearch.value.toLowerCase();
            console.log("Search Term:", searchTerm); // Check if searchTerm is updated
            main();
        });

        async function getUserDataFromFirebase() {
            try {
                const snapshot = await get(user_ref); // Retrieve data from the Firebase Realtime Database using the 'user_ref' you defined
                if (snapshot.exists()) {
                    userData = snapshot.val(); // Assign the retrieved data to the 'userData' variable
                    console.log(userData.Staff_FName)
                    const staff_name = userData.Staff_FName + " " + userData.Staff_LName
                    const staff_email = userData.Email
                    const skills = userData.Skills
                    let staffname = document.getElementById('staffname')
                    staffname.innerHTML = staff_name
                    let staffemail = document.getElementById('staffemail')
                    staffemail.innerHTML = staff_email
                    let staffskills = document.getElementById('staffskills')
                    staffskills.innerHTML = skills

                } else {
                    userData = null; // Set 'userData' to null or another appropriate value when no data exists
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                throw error;
            }
        }
        


        // Call the main function initially
        main();

        // You can now use 'uid' in your application as needed.
    } else {
        // No user is signed in. Handle this case if necessary.
        console.log("No user is signed in.");
        window.location.href = '/Login UI/login.html'
    }
});


