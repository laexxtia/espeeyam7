import app from "../config/newconfig.js";
import {
    getDatabase,
    set,
    ref,
    update,
    get,
    child,
    push
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import {
    getStorage,
    ref as sRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const database = getDatabase(app)
var currentURL = window.location.href;
const userID = sessionStorage.getItem("userID");
var url = new URL(currentURL);
var search = url.search.slice(2);
console.log(search)
const jobRef = ref(database, 'jobs/' + search);
const user_ref = ref(database, 'Staff/' + userID);
const jobContainer = document.querySelector(".card-body")

console.log(user_ref);
// const user_ref = ref(database, "Staff/"+)
let job;
let userData;
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
async function main(){
    try{
        await getJobFromFirebase();
        await getUserDataFromFirebase();
        if(job && userData){
            // console.log(job);

            // Job Title
            let jobTitle = document.createElement("h1");
            jobTitle.setAttribute("class", "role-title mb-3");
            jobTitle.innerHTML = job.title;
            console.log(jobTitle);
            
            //horizontal line 
            jobContainer.appendChild(jobTitle);
            const horizontal_line = document.createElement("hr");
            jobContainer.appendChild(horizontal_line);

            //Job Description 
            let jobDescription = document.createElement("div");
            let jobDescriptionTitleDiv = document.createElement("div");
            jobDescription.setAttribute("class", "mt-5 mb-5");
            jobDescriptionTitleDiv.setAttribute("class", "d-flex mb-1")
            let jobDescriptionTitle = document.createElement("h2")
            jobDescriptionTitle.innerHTML = "About the Job"
            jobDescriptionTitleDiv.appendChild(jobDescriptionTitle);
            jobDescription.appendChild(jobDescriptionTitleDiv);
            let jobDescriptionText = document.createElement("p");
            jobDescriptionText.innerHTML = job.details;
            jobDescription.appendChild(jobDescriptionText);

            //deadline
            let deadline = document.createElement("p")
            deadline.setAttribute("class", "fw-bold");
            deadline.innerHTML = "Application Deadline:"
            let deadline_date = document.createElement("p");
            deadline_date.setAttribute("class", "fw-bold text-danger");
            deadline_date.setAttribute("id", "deadline");
            deadline.appendChild(deadline_date);
            jobDescription.appendChild(deadline);
            jobContainer.appendChild(jobDescription);
            console.log(jobDescription);

            //responsibilities
            let jobResponsibilties = document.createElement("div");
            let jobResponsibilitiesTitleDiv = document.createElement("div");
            jobResponsibilties.setAttribute("class", "mb-5");
            jobResponsibilitiesTitleDiv.setAttribute("class", "d-flex mb-2");
            let jobResponsibilitiesTitle = document.createElement("h2");
            jobResponsibilitiesTitle.innerHTML = "Responsibilities";
            jobResponsibilitiesTitleDiv.appendChild(jobResponsibilitiesTitle);
            jobResponsibilties.appendChild(jobResponsibilitiesTitleDiv);
            jobContainer.appendChild(jobResponsibilties);
            

            // Skills Required
            let jobSkills = document.createElement("div"); 
            let jobSkillsTitleDiv = document.createElement("div");
            jobSkills.setAttribute("class", "mb-5");
            jobSkillsTitleDiv.setAttribute("class", "d-flex mb-2");
            let jobSkillsTitle = document.createElement("h2"); 
            jobSkillsTitle.innerHTML = "Skills Required";
            console.log(job.Skills);
            let jobSkillsList = document.createElement("ul");
            for (const i in job.Skills){
                let jobSkillsListItem = document.createElement("li");
                jobSkillsListItem.innerHTML = job.Skills[i];
                console.log(job.Skills[i]);
                jobSkillsList.append(jobSkillsListItem);
            }

            jobSkillsTitleDiv.appendChild(jobSkillsTitle);
            jobSkills.appendChild(jobSkillsTitleDiv);
            jobSkills.appendChild(jobSkillsList);
            jobContainer.append(jobSkills);


            // how you match
            let jobSkillsMatch = document.createElement("div");
            let jobSkillsMatchTitleDiv=document.createElement("div");
            jobSkillsMatch.setAttribute("class", "mb-5");
            jobSkillsMatchTitleDiv.setAttribute("class", "d-flex mb-2");
            let jobSkillsMatchTitle=document.createElement("h2");
            jobSkillsMatchTitle.innerHTML= "How You Match";
            let skills_matched_counter = 0;
            let skills_missing = [];
            for (const i in job.Skills) {
                for (const j in userData.Skill) {
                    if (userData.Skill[j].toLowerCase() === job.Skills[i].toLowerCase()){
                        skills_matched_counter +=1;
                    }
                    else{
                        if(!skills_missing.includes(job.Skills[i]) && !userData.Skill.includes(job.Skills[i])){
                            skills_missing.push(job.Skills[i]);
                        }
                        
                    }
                }
            };
            console.log(skills_missing);
            console.log(skills_matched_counter);
            console.log(job.Skills);
            let jobSkillsMatchText = document.createElement("p");
            
            if (skills_matched_counter >= Object.keys(job.Skills).length){
                jobSkillsMatchText.innerHTML = "You meet all the skill requirements for this job.";
            }
            else if(skills_matched_counter < Object.keys(job.Skills).length){
                jobSkillsMatchText.innerHTML = skills_matched_counter + " skills match your profile. Stand out by adding other skills you have.";
            }


            jobSkillsMatchTitleDiv.appendChild(jobSkillsMatchTitle);
            jobSkillsMatch.appendChild(jobSkillsMatchTitleDiv);
            jobSkillsMatch.appendChild(jobSkillsMatchText);
            jobContainer.append(jobSkillsMatch);




            
            //salary 





            



        }
    } catch (error){

    }

}

main()
// JavaScript function to show a confirmation alert
// const jobDetails = {
//     title: "Product Owner",
//     description: "Lorem ipsum dolor sit amet...",
//     requirements: [
//         "Minimum 2 years of experience",
//         "Bachelor's degree in a related field",
//         "Strong communication skills"
//     ],
//     skills: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
//     salary: "$60,000 - $80,000 per year"
// };

// function applyNow() {
//     if (confirm("Are you sure you want to apply for this job?")) {
//         swal("Good job!", "You have successfully applied for the job!", "success");
//         // Get existing applied jobs from local storage or initialize an empty array
//         const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];

//         // Add the new job to the array
//         appliedJobs.push(jobDetails);

//         // Store updated applied jobs in local storage
//         localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));

//     }
// }

// for deadline
// document.addEventListener("DOMContentLoaded", function () {

//     // application deadline date (year, month (0-11), day) - applicants can apply UP TILL 2359 of deadline date
//     const deadlineDate = new Date(2023, 9, 7, 23, 59);

//     // current date
//     const currentDate = new Date();

//     if (currentDate <= deadlineDate) {
//         // before deadline - shows deadline date
//         document.getElementById("deadline").textContent = deadlineDate.toDateString();
//     } else {
//         // after deadline - shows applications closed
//         document.getElementById("deadline").innerHTML = `
//                                     <div class="d-flex">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-ban-fill mt-1 me-2" viewBox="0 0 16 16">
//                                             <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM2.71 12.584c.218.252.454.488.706.707l9.875-9.875a7.034 7.034 0 0 0-.707-.707l-9.875 9.875Z"/>
//                                         </svg>
//                                         <p class="fw-bold text-danger">Applications Closed</p>
//                                     </div>
//                                     `;

//         // removes apply now button
//         document.getElementById("apply-btn").style.display = "none";
//     }
// });