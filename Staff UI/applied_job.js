import app from '../config/newconfig.js';
import FirebaseService from '../config/firebaseService.js';

// Initialize FirebaseService with your Firebase app
const firebaseService = new FirebaseService(app);

const appliedJobCardsContainer = document.getElementById('appliedJobCards');

firebaseService.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in.
        console.log(user);
        const uid = user.uid;
        const user_ref = firebaseService.getDatabaseRef('Staff/' + uid);

        sessionStorage.setItem("userID", uid);
        let userData;
        
        async function getUserDataFromFirebase() {
            try {
                const userDataSnapshot = await firebaseService.getDatabaseValue(user_ref);
                userData = userDataSnapshot;
            } catch (error) {
                console.error("Error fetching user data:", error);
                throw error;
            }
        }

        async function main() {
            try {
                await getUserDataFromFirebase();
                const welcome_msg = document.querySelector(".welcome-msg");
                welcome_msg.innerHTML = "Welcome, " + userData.Staff_FName;
                console.log(userData);

                for (const job_uid of userData.applied_jobs) {
                    const jobRef = firebaseService.getDatabaseRef('jobs/' + job_uid);

                    async function getJobFromFirebase() {
                        try {
                            const jobSnapshot = await firebaseService.getDatabaseValue(jobRef);
                            const job = jobSnapshot;
                            return job;
                        } catch (error) {
                            console.error("Error fetching jobs:", error);
                            throw error;
                        }
                    }

                    const job = await getJobFromFirebase();
                    console.log(job);

                    const jobCardHTML = `
                        <div class="col-md-6">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h5 class="card-title">${job.title}</h5>
                                    <p class="card-text">${job.details}</p>
                                    <a class="btn btn-primary" href="role_listing.html?=${job_uid}">More Details</a>
                                </div>
                            </div>
                        </div>
                    `;
                    appliedJobCardsContainer.innerHTML += jobCardHTML;
                }
            } catch (error) {
                console.error("Error in main function:", error);
            }
        }

        // Call the main function initially
        main();
    } else {
        // No user is signed in. Handle this case if necessary.
        console.log("No user is signed in.");
        window.location.href = '/Login UI/login.html';
    }
});
