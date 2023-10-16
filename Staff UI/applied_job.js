import app from '../config/newconfig.js';
import { getDatabase, set, ref, update, get, child, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const database = getDatabase(app);
const auth = getAuth();
const storage = getStorage()
const storageref = sRef(storage);
const appliedJobCardsContainer = document.getElementById('appliedJobCards');


auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log(user)
        var uid = user.uid;
        const user_ref = ref(database, 'Staff/' + uid)
        
        sessionStorage.setItem("userID", uid);
        let job; // Declare a variable to store the jobs data
        let userData;
        // console.log(userData);

        const welcome_msg = document.querySelector(".welcome-msg");
        
        async function getUserDataFromFirebase() {
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

        async function main() {
            try {
                await getUserDataFromFirebase();
                welcome_msg.innerHTML = "Welcome, " + userData.Staff_FName;
                console.log(userData);
                
                for (const i in userData.applied_jobs){
                    let job_uid = userData.applied_jobs[i];
                    let jobRef = ref(database, 'jobs/' + job_uid);
                    async function getJobFromFirebase(){
                        try{
                            const snapshot = await get(jobRef);
                            if (snapshot.exists()){
                                job = snapshot.val();
                            }
                            else{
                                job = null
                            }
                        }
                        catch(error){
                            console.error("Error fetching jobs:", error);
                            throw error;
                        }
                    }
                    await getJobFromFirebase();
                    console.log(job)
                    const jobCardHTML = `
                        <div class="col-md-6">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h5 class="card-title">${job.title}</h5>
                                    <p class="card-text">${job.details}</p>
                                    <a class = "btn btn-primary" href ="role_listing.html?=${job_uid}">More Details</a>
                                </div>
                            </div>
                        </div>
                    `;
                    appliedJobCardsContainer.innerHTML += jobCardHTML;


                    
                }

            } catch (error) {
                // Handle any errors here
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

