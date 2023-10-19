import app from "../config/newconfig.js";
import FirebaseService from '../config/firebaseService.js'; // Import the FirebaseService class

// Initialize FirebaseService with your Firebase app
const firebaseService = new FirebaseService(app);

firebaseService.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in.
        var uid = user.uid;

        console.log("USER IS LOGGED IN");
        // console.log("User UID: " + uid);

        sessionStorage.setItem("userID", uid);
        const user_ref = firebaseService.getDatabaseRef('Staff/' + uid);

        let jobs; // Declare a variable to store the jobs data
        let userData;
        // console.log(userData)

        const jobsHeading = document.querySelector(".container-fluid h2");
        const jobsMainContainer = document.querySelector(".jobs-list-container");
        const jobSearch = document.querySelector(".form-control");
        const welcome_msg = document.querySelector(".welcome-msg");

        let searchTerm = "";

        jobSearch.addEventListener("input", () => {
            searchTerm = jobSearch.value.toLowerCase();
            console.log("Search Term:", searchTerm); // Check if searchTerm is updated
            main();
        });

        // Function to hide all job cards
        function hideAllJobCards() {
            const jobCards = document.querySelectorAll(".job-card");
            jobCards.forEach((card) => {
                card.style.display = "none";
            });
        }

        // Now you can work with the 'jobs' variable here
        let jobsContainer = document.createElement("div");
        jobsContainer.setAttribute("class", "row mx-auto");

        jobsContainer.innerHTML = "";
        jobsMainContainer.innerHTML = "";

        let matchingJobsCount = 0;

        async function getJobsFromFirebase() {
            try {
                const jobsRef = firebaseService.getDatabaseRef('jobs');
                const snapshot = await firebaseService.getDatabaseValue(jobsRef);
                if (snapshot) {
                    jobs = snapshot; // Assign the retrieved data to the 'jobs' variable
                } else {
                    // console.log("No jobs data available");
                    jobs = null; // Set 'jobs' to null or another appropriate value when no data exists
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
                throw error;
            }
        }

        async function getUserDataFromFirebase() {
            try {
                const snapshot = await firebaseService.getDatabaseValue(user_ref); // Retrieve data from the Firebase Realtime Database using the 'user_ref' you defined
                if (snapshot) {
                    userData = snapshot; // Assign the retrieved data to the 'userData' variable
                } else {
                    userData = null; // Set 'userData' to null or another appropriate value when no data exists
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                throw error;
            }
        }

        // To use the function and get the jobs data:
        async function main() {
            try {
                await getJobsFromFirebase(); // Fetch the jobs data
                await getUserDataFromFirebase();
                if (jobs && userData) {
                    hideAllJobCards(); // Hide all job cards

                    // Update the job count in the heading
                    if (Object.keys(jobs).length == 1) {
                        jobsHeading.innerHTML = `${Object.keys(jobs).length} Job`;
                    } else if (Object.keys(jobs).length == 0) {
                        jobsHeading.innerHTML = `No Jobs`;
                    } else {
                        jobsHeading.innerHTML = `${Object.keys(jobs).length} Jobs`;
                    }

                    // Clear existing job cards before adding new ones
                    jobsContainer.innerHTML = "";

                    welcome_msg.innerHTML = "Welcome, " + userData.Staff_FName;

                    for (const jobId in jobs) {
                        const job = jobs[jobId];
                        // console.log(jobId)
                        // console.log(searchTerm);
                        if (job.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                            let jobCard = document.createElement("div");
                            jobCard.setAttribute("class", "col-3 box job-card")


                            let title = document.createElement("h3");
                            title.classList.add("job-title");
                            title.innerText = job.title;

                            let details = document.createElement("div");
                            details.classList.add("details");
                            details.innerText = job.details;


                            let detailsbtn = document.createElement("a")
                            detailsbtn.setAttribute("class", "btn btn-primary")
                            detailsbtn.innerHTML = "More Details";
                            detailsbtn.href = job.link + "?=" + jobId

                            // jobCard.appendChild(image);
                            jobCard.appendChild(title);
                            jobCard.appendChild(details);

                            let skill_row = document.createElement("div")
                            skill_row.setAttribute("class", "skillrow")
                            let skill_text = document.createElement("p")
                            skill_text.setAttribute("class", "skilltext")
                            skill_text.innerHTML = "Skills Needed:"
                            let skill_buttons = document.createElement("div")
                            // console.log(job.Skills)
                            skill_buttons.setAttribute("class", "scrollable-div")

                            skill_row.append(skill_text)
                            for (const i in job.Skills) {
                                let skills_needed = document.createElement("span");
                                skills_needed.innerText = job.Skills[i]; // Set the default text
                                
                                for (const j in userData.Skill) {
                                    if (userData.Skill[j].toLowerCase() === job.Skills[i].toLowerCase()) {
                                        skills_needed.setAttribute("class", "btn btn-success test");
                                        break; // Skill matched, no need to continue checking
                                    } else {
                                        skills_needed.setAttribute("class", "btn btn-secondary test disabled");
                                    }
                                }
                                
                                skill_buttons.append(skills_needed);
                                skill_row.append(skill_buttons)
                            }
                                                    
                            
                            jobCard.appendChild(skill_row);
                            jobCard.appendChild(detailsbtn);

                            jobsContainer.append(jobCard)
                            matchingJobsCount++
                        }
                    }

                    // Append the matching job cards to the jobsMainContainer
                    jobsMainContainer.appendChild(jobsContainer);
                } else {
                    // Handle the case when no jobs data is available
                }
            } catch (error) {
                // Handle any errors here
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



