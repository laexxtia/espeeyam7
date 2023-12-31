import app from "../config/newconfig.js";
import FirebaseService from "../config/firebaseService.js";

const firebaseService = new FirebaseService(app)
var currentURL = window.location.href;
const userID = sessionStorage.getItem("userID");
var url = new URL(currentURL);
var search = url.search.slice(2);
console.log(search)

const jobRef = firebaseService.getDatabaseRef(`jobs/${search}`)
const user_ref = firebaseService.getDatabaseRef(`Staff/${userID}`)
const jobContainer = document.querySelector(".card-body")

// const user_ref = ref(database, "Staff/"+)
let job;
let userData;

async function getJobFromFirebase() {
    try {
      job = await firebaseService.getDatabaseValue(jobRef);
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

let job_deadline = ''

async function main(){
    try{
        await getJobFromFirebase();
        await getUserDataFromFirebase();

        if(job && userData){
            
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
            job_deadline = job.deadline;
            console.log(job_deadline);

            let deadline = document.createElement("p")
            deadline.setAttribute("class", "fw-bold");
            deadline.innerHTML = "Application Deadline: "
            let deadline_date = document.createElement("p");
            deadline_date.setAttribute("class", "text-danger");
            deadline_date.setAttribute("id", "deadline-date");
            deadline_date.innerHTML = job_deadline;
            deadline.appendChild(deadline_date);
            jobDescription.appendChild(deadline);
            jobContainer.appendChild(jobDescription);

            //responsibilities
            // let jobResponsibilties = document.createElement("div");
            // let jobResponsibilitiesTitleDiv = document.createElement("div");
            // jobResponsibilties.setAttribute("class", "mb-5");
            // jobResponsibilitiesTitleDiv.setAttribute("class", "d-flex mb-2");
            // let jobResponsibilitiesTitle = document.createElement("h2");
            // jobResponsibilitiesTitle.innerHTML = "Responsibilities";
            // jobResponsibilitiesTitleDiv.appendChild(jobResponsibilitiesTitle);
            // jobResponsibilties.appendChild(jobResponsibilitiesTitleDiv);
            // let jobResponsibiltiesText = document.createElement("p");
            // jobResponsibiltiesText.innerHTML = job.responsibilities;
            // jobResponsibilties.appendChild(jobResponsibiltiesText);
            
            // jobContainer.appendChild(jobResponsibilties);
            
            // Skills Required
            // let jobSkills = document.createElement("div"); 
            let jobSkillsTitleDiv = document.createElement("div");
            // jobSkills.setAttribute("class", "mb-5");
            jobSkillsTitleDiv.setAttribute("class", "d-flex mb-2");
            let jobSkillsTitle = document.createElement("h2"); 
            jobSkillsTitle.innerHTML = "Skills Required";
            // console.log(job.Skills);
            // let jobSkillsList = document.createElement("ul");
            // for (const i in job.Skills){
            //     let jobSkillsListItem = document.createElement("li");
            //     jobSkillsListItem.innerHTML = job.Skills[i];
            //     console.log(job.Skills[i]);
            //     jobSkillsList.append(jobSkillsListItem);
            // }

            // jobSkillsTitleDiv.appendChild(jobSkillsTitle);
            // jobSkills.appendChild(jobSkillsTitleDiv);
            // jobSkills.appendChild(jobSkillsList);
            // jobContainer.append(jobSkills);

            // new skills list logic --------------------------------------------------------------------------
            let skillListsContainer = document.createElement("div");
            skillListsContainer.appendChild(jobSkillsTitle);
            skillListsContainer.appendChild(jobSkillsTitleDiv);

            // Create a list for skills that the staff has and match the job
            let hasSkillList = document.createElement("ul");
            hasSkillList.style.listStyleImage = "url('./images/yes-skill.png')";
            hasSkillList.style.margin = "0";

            // Create a list for skills without a match
            let noSkillList = document.createElement("ul");
            noSkillList.style.listStyleImage = "url('./images/check-mark.png')";
            noSkillList.style.color = "#524f4f";

            for (const i in job.Skills) {
                let jobSkillsListItem = document.createElement("li");

                // Create the skill text
                let skillText = document.createElement("span");
                skillText.innerHTML = job.Skills[i];

                // Append the skill text to the appropriate list based on whether the staff has the skill
                if (userData.Skills.includes(job.Skills[i])) {
                    jobSkillsListItem.appendChild(skillText);
                    hasSkillList.appendChild(jobSkillsListItem);
                } else {
                    jobSkillsListItem.appendChild(skillText);
                    noSkillList.appendChild(jobSkillsListItem);
                }
            }

            // Append the lists to the skill lists container
            skillListsContainer.appendChild(hasSkillList);
            skillListsContainer.appendChild(noSkillList);


            // Append the skill lists container to the job container
            jobContainer.appendChild(skillListsContainer);

            // ---------------------------------------------------------------------------------------------------


            // how you match
            let jobSkillsMatch = document.createElement("div");
            let jobSkillsMatchTitleDiv=document.createElement("div");
            jobSkillsMatch.setAttribute("class", "mb-5");
            jobSkillsMatchTitleDiv.setAttribute("class", "d-flex mb-2");
            let jobSkillsMatchTitle=document.createElement("h2");
            jobSkillsMatchTitle.innerHTML= "Skills Match Percentage";
            let skills_matched_counter = 0;
            let skills_missing = [];
            for (const i in job.Skills) {
                for (const j in userData.Skills) {
                    if (userData.Skills[j].toLowerCase() === job.Skills[i].toLowerCase()){
                        skills_matched_counter +=1;
                    }
                    else{
                        if(!skills_missing.includes(job.Skills[i]) && !userData.Skills.includes(job.Skills[i])){
                            skills_missing.push(job.Skills[i]);
                        }
                        
                    }
                }
            };
            console.log(skills_missing);
            console.log(skills_matched_counter);
            console.log(job.Skills);
            let jobskillspercentage = document.createElement("h2");
            let jobSkillsMatchText = document.createElement("p");

            console.log(job.Skills.length);
            const skillmatchpercentage = (skills_matched_counter)/(job.Skills.length);
            console.log(Math.round(skillmatchpercentage*100));

            if (skillmatchpercentage < 0.5){
                jobskillspercentage.innerHTML = Math.round(skillmatchpercentage*100) + "%"
                jobskillspercentage.style.color = "#fc215e";
            }
            else if (skillmatchpercentage === 0.5) {
                jobskillspercentage.innerHTML = Math.round(skillmatchpercentage*100) + "%"
                jobskillspercentage.style.color = "#ffbe00";
            }
            else{
                jobskillspercentage.innerHTML =Math.round(skillmatchpercentage*100) + "%"
                jobskillspercentage.style.color = "#00db96";
            }
            
            if (skills_matched_counter >= Object.keys(job.Skills).length){
                jobSkillsMatchText.innerHTML = "You meet all the skill requirements for this job.";
            }
            else if (skills_matched_counter == 1) {
                jobSkillsMatchText.innerHTML =skills_matched_counter + " skill matches your profile. Stand out by adding other skills you have."
            }
            else if(skills_matched_counter < Object.keys(job.Skills).length){
                jobSkillsMatchText.innerHTML = skills_matched_counter + " skills match your profile. Stand out by adding other skills you have.";
            }

            jobSkillsMatchTitleDiv.appendChild(jobSkillsMatchTitle);
            jobSkillsMatch.appendChild(jobSkillsMatchTitleDiv);
            jobSkillsMatch.appendChild(jobskillspercentage);
            jobSkillsMatch.appendChild(jobSkillsMatchText);
            jobContainer.append(jobSkillsMatch);
            
            //apply now function
            async function applyNow() {
                if (confirm("Are you sure you want to apply for this job?")) {
                    const userAppliedJobsRef = firebaseService.getDatabaseRef(`Staff/${userID}/applied_jobs`); // Reference to the user's applied jobs array
                    const jobApplicantRef = firebaseService.getDatabaseRef(`jobs/${search}/applicants`); // Reference to the applicant array for a specific job
            
                    // Fetch the user's applied jobs array
                    const userAppliedJobs = await firebaseService.getDatabaseValue(userAppliedJobsRef);
                    const appliedJobsArray = userAppliedJobs || [];
            
                    // Add the new job ID to the array
                    appliedJobsArray.push(search);
            
                    // Set the updated array back in the database
                    await firebaseService.set(userAppliedJobsRef, appliedJobsArray);
            
                    // Fetch the job's applicant array
                    const jobApplicants = await firebaseService.getDatabaseValue(jobApplicantRef);
                    const applicantArray = jobApplicants || [];
            
                    // Add user ID to the applicant array
                    applicantArray.push(userID);
            
                    // Set the updated array back in the database
                    await firebaseService.set(jobApplicantRef, applicantArray);
            
                    // Show success message and reload the page
                    swal({
                        title: "Good job!",
                        text: "You have successfully applied for the job!",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    setTimeout(window.location.reload.bind(window.location), 1000);
                }
                
            }
            
            //apply now button 
            console.log(userData.applied_jobs)
            if (typeof userData.applied_jobs === 'undefined' || !Object.values(userData.applied_jobs).includes(search)) { 
                // Apply Now button
                console.log("creating button")
                let applynowbtndiv = document.createElement("div");
                applynowbtndiv.setAttribute("class", "apply-btn mt-3");
                applynowbtndiv.setAttribute("id", "apply-btn");
                let applynowbtn = document.createElement("button");
                applynowbtn.setAttribute("class", "btn btn-outline-primary fs-4 px-3");
                applynowbtn.setAttribute("id", "apply-btn");
                applynowbtn.setAttribute("href", "javascript:void(0);"); // Set the href attribute to "javascript:void(0);" to make it clickable
                applynowbtn.addEventListener("click", function () {
                    applyNow(); // Call your applyNow function on button click
                });
                applynowbtn.innerHTML = "Apply Now";
                applynowbtndiv.appendChild(applynowbtn);
                jobContainer.appendChild(applynowbtndiv);
            }
            else if(Object.values(userData.applied_jobs).includes(search)){
                console.log("creating button")
                let applynowbtndiv = document.createElement("div");
                applynowbtndiv.setAttribute("class", "apply-btn mt-3");
                applynowbtndiv.setAttribute("id", "apply-btn");
                let applynowbtn = document.createElement("button");
                applynowbtn.setAttribute("class", "btn btn-secondary fs-4 px-3");
                applynowbtn.setAttribute("disabled", ""); // Set the disabled attribute to make the button disabled
                applynowbtn.innerHTML = "You have applied for this position ";
                applynowbtndiv.appendChild(applynowbtn);
                jobContainer.appendChild(applynowbtndiv);
            };

            // date responsiveness
            function getDeadline() {
                let currentDate = new Date();
                let deadline_date = document.getElementById('deadline-date');
                let applyBtn = document.getElementById("apply-btn");

                // converting job deadline into a datetime object with time
                let time_text = "23:59";
                let dateTimeText = job.deadline + " " + time_text;
                let deadlineObj = new Date(dateTimeText); 

                if (currentDate > deadlineObj) {
                    // Application deadline has passed
                    deadline_date.innerHTML = "Closed";
                    applyBtn.style.display = "none";
                }

            };

            getDeadline();

        }
    } catch (error){

    }

}

main();