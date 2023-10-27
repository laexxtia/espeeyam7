import app from "../config/newconfig.js";
import FirebaseService from '../config/firebaseService.js';

// Initialize FirebaseService with your Firebase app
const firebaseService = new FirebaseService(app);

firebaseService.onAuthStateChanged(async (user) => {
    if (user) {
        var uid = user.uid;

        console.log("USER IS LOGGED IN");

        sessionStorage.setItem("userID", uid);
        const user_ref = firebaseService.getDatabaseRef('Staff/' + uid);

        let jobs;
        let userData;

        const jobsHeading = document.querySelector(".container-fluid h2");
        const jobsMainContainer = document.querySelector(".jobs-list-container");
        const jobSearch = document.querySelector(".form-control");
        const welcome_msg = document.querySelector(".welcome-msg");

        let searchTerm = "";

        function createJobCards() {

            for (const jobId in jobs) {
                const job = jobs[jobId];
                console.log(job);
                // not creating job cards for jobs that are past application deadline
                let currentDate = new Date();
                let job_deadline = new Date(job.deadline + " 23:59"); 

                if (currentDate > job_deadline) {
                    continue;
                }

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
                    detailsbtn.href = "role_listing.html?=" + jobId

                    // jobCard.appendChild(image);
                    jobCard.appendChild(title);
                    jobCard.appendChild(details);

                    let skill_row = document.createElement("div")
                    skill_row.setAttribute("class", "skillrow")
                    let skill_text = document.createElement("p")
                    skill_text.setAttribute("class", "skilltext")
                    skill_text.innerHTML = "Skills Needed:"
                    let skill_buttons = document.createElement("div")
                    skill_buttons.setAttribute("class", "scrollable-div")

                    skill_row.append(skill_text)
                    for (const i in job.Skills) {
                        let skills_needed = document.createElement("span");
                        skills_needed.innerText = job.Skills[i]; // Set the default text
                        
                        for (const j in userData.Skill) {
                            if (userData.Skill[j].toLowerCase() === job.Skills[i].toLowerCase()) {
                                skills_needed.setAttribute("class", "btn btn-success test");
                                skill_buttons.prepend(skills_needed);
                                break; // Skill matched, no need to continue checking
                            } else {
                                skills_needed.setAttribute("class", "btn btn-secondary test disabled");
                                skill_buttons.appendChild(skills_needed);
                            }
                        }
                        skill_row.append(skill_buttons)
                    }
                                            
                    
                    jobCard.appendChild(skill_row);
                    jobCard.appendChild(detailsbtn);
                    
                    console.log(job.Skills)
                    jobCard.dataset.skills = job.Skills.join(", ");

                    jobsContainer.append(jobCard)
                    matchingJobsCount++
                }
            }

            // Append the matching job cards to the jobsMainContainer
            jobsMainContainer.appendChild(jobsContainer);

        }
        function showAllJobCards() {
            const jobCards = document.querySelectorAll(".job-card");
            jobCards.forEach(card => {
                card.style.display = "block";
            });
        }

        jobSearch.addEventListener("input", () => {
            searchTerm = jobSearch.value.toLowerCase();
            console.log("Search Term:", searchTerm); // Check if searchTerm is updated
            main();
        });

        function hideAllJobCards() {
            const jobCards = document.querySelectorAll(".job-card");
            jobCards.forEach((card) => {
                card.style.display = "none";
            });
        }

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

        async function getSkillsFromDatabase() {
            try {
                // Reference to your Firebase Realtime Database jobs node
                await getJobsFromFirebase()
                const allSkills = [];
                for (const i in jobs){
                    const skill_list = jobs[i]['Skills']
                    for (const j in skill_list){
                        if(!allSkills.includes(skill_list[j])){
                            allSkills.push(skill_list[j])
                        }
                    }
                }

                return allSkills

            } catch (error) {
                console.error("Error fetching skills:", error);
                throw error;
            }
        }

        function filterJobCardsBySkills() {
            const selectedSkills = Array.from(document.querySelectorAll(".skill-button.active"))
                .map(skillButton => skillButton.innerText.toLowerCase());
        
            if (selectedSkills.length === 0) {
                showAllJobCards();
                return;
            }
        
            hideAllJobCards();
        
            for (const jobCard of jobsContainer.querySelectorAll(".job-card")) {

                const skillsAttribute = jobCard.dataset.skills;
    
                if (skillsAttribute) {
                    const jobSkills = skillsAttribute.split(",").map(skill => skill.trim().toLowerCase());
            
                    const matchingSkills = selectedSkills.filter(skill => jobSkills.includes(skill));
            
                    if (matchingSkills.length === selectedSkills.length) {
                        jobCard.style.display = "block";
                    } else {
                        jobCard.style.display = "none";
                    }
                } else {
                    // Handle the case when the data-skills attribute is not defined for this job card.
                    // You can choose to show it or hide it, depending on your requirements.
                    jobCard.style.display = "block"; // Show the card as a fallback
                }
            }
        }
        

        // Function to dynamically generate skill checkboxes based on the available skills
        async function generateSkillCheckboxes() {
            const allSkills = await getSkillsFromDatabase();
            const skillsFilter = document.querySelector(".skills-filter");

            allSkills.forEach(skill => {
                const skillElement = document.createElement("button");
                skillElement.classList.add("skill-button", "rounded-pill"); 
                skillElement.innerText = skill;

                skillElement.addEventListener("click", () => {
                    console.log(skillElement.innerText)
                    skillElement.classList.toggle("active");
                    filterJobCardsBySkills();
                });

                skillsFilter.appendChild(skillElement);
            });

            const clearAllLink = document.createElement("a");
            clearAllLink.href = "#";
            clearAllLink.id = "clear-all-link";
            clearAllLink.innerText = "Clear All";
            skillsFilter.appendChild(clearAllLink);
            
            clearAllLink.addEventListener("click", () => {
                const skillButtons = document.querySelectorAll(".skill-button");
                skillButtons.forEach(button => {
                    button.classList.remove("active");
                });
                filterJobCardsBySkills();
            });

        }
        
        
        generateSkillCheckboxes();


        async function main() {
            try {
                await getJobsFromFirebase(); // Fetch the jobs data
                await getUserDataFromFirebase();
                if (jobs && userData) {
                    hideAllJobCards(); // Hide all job cards

                    // Update the job count in the heading
                    // if (Object.keys(jobs).length == 1) {
                    //     jobsHeading.innerHTML = `${Object.keys(jobs).length} Job`;
                    // } else if (Object.keys(jobs).length == 0) {
                    //     jobsHeading.innerHTML = `No Jobs`;
                    // } else {
                    //     jobsHeading.innerHTML = `${Object.keys(jobs).length} Jobs`;
                    // }

                    // Clear existing job cards before adding new ones
                    jobsContainer.innerHTML = "";

                    welcome_msg.innerHTML = "Welcome, " + userData.Staff_FName;

                    createJobCards()

                    const jobCards = document.querySelectorAll(".job-card");
                    const jobCardsArray = Array.from(jobCards);

                    const displayedJobCards = jobCardsArray.filter(card => getComputedStyle(card).display !== "none");
                    const numberOfDisplayedJobCards = displayedJobCards.length;
                    console.log("Number of displayed job cards: " + numberOfDisplayedJobCards);
                    jobsHeading.innerHTML = `${numberOfDisplayedJobCards} Jobs`;

                } else {
                    // Handle the case when no jobs data is available
                }
            } catch (error) {
                // Handle any errors here
            }
        }

        main();
    } else {
        console.log("No user is signed in.");
        window.location.href = '/Login UI/login.html';
    }
});