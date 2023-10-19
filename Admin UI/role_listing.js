import app from "../config/newconfig.js";
import FirebaseService from "../config/firebaseService.js";

const firebaseService = new FirebaseService(app)
var currentURL = window.location.href;
const userID = sessionStorage.getItem("userID");
var url = new URL(currentURL);
var search = url.search.slice(2);
console.log(search)
const jobRef = firebaseService.getDatabaseRef('jobs/' + search);
const user_ref = firebaseService.getDatabaseRef('Staff/' + userID);
const jobContainer = document.querySelector(".card-body")

console.log(user_ref);
let job;

async function getJobFromFirebase() {
    try {
      job = await firebaseService.getDatabaseValue(jobRef);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  }

async function main(){
    try{
        await getJobFromFirebase();
        if(job){
            // console.log(job);

            // Job Title
            let jobTitle = document.createElement("h1");
            jobTitle.setAttribute("class", "role-title mb-3");
            jobTitle.innerHTML = job.title;
            console.log(jobTitle);
            
            // Edit button
            let editButtonDiv = document.createElement("div");
            editButtonDiv.style.display = "flex";
            editButtonDiv.style.justifyContent = "flex-end";

            let editButton = document.createElement("button");
            editButton.setAttribute("class", "btn btn-primary");
            editButton.innerHTML = "Edit";
            editButtonDiv.appendChild(editButton);
            // editButton.addEventListener("click", editJob);
            
            //horizontal line 
            jobContainer.appendChild(editButtonDiv); 

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
            // let jobSkillsMatch = document.createElement("div");
            // let jobSkillsMatchTitleDiv=document.createElement("div");
            // jobSkillsMatch.setAttribute("class", "mb-5");
            // jobSkillsMatchTitleDiv.setAttribute("class", "d-flex mb-2");
            // let jobSkillsMatchTitle=document.createElement("h2");
            // jobSkillsMatchTitle.innerHTML= "How You Match";
            // let skills_matched_counter = 0;
            // let skills_missing = [];
            // for (const i in job.Skills) {
            //     for (const j in userData.Skill) {
            //         if (userData.Skill[j].toLowerCase() === job.Skills[i].toLowerCase()){
            //             skills_matched_counter +=1;
            //         }
            //         else{
            //             if(!skills_missing.includes(job.Skills[i]) && !userData.Skill.includes(job.Skills[i])){
            //                 skills_missing.push(job.Skills[i]);
            //             }
                        
            //         }
            //     }
            // };
            // console.log(skills_missing);
            // console.log(skills_matched_counter);
            // console.log(job.Skills);
            // let jobSkillsMatchText = document.createElement("p");
            
            // if (skills_matched_counter >= Object.keys(job.Skills).length){
            //     jobSkillsMatchText.innerHTML = "You meet all the skill requirements for this job.";
            // }
            // else if (skills_matched_counter == 1) {
            //     jobSkillsMatchText.innerHTML =skills_matched_counter + " skill matches your profile. Stand out by adding other skills you have."
            // }
            // else if(skills_matched_counter < Object.keys(job.Skills).length){
            //     jobSkillsMatchText.innerHTML = skills_matched_counter + " skills match your profile. Stand out by adding other skills you have.";
            // }


            // jobSkillsMatchTitleDiv.appendChild(jobSkillsMatchTitle);
            // jobSkillsMatch.appendChild(jobSkillsMatchTitleDiv);
            // jobSkillsMatch.appendChild(jobSkillsMatchText);
            // jobContainer.append(jobSkillsMatch);

            // //apply now function
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
            // //apply now button 
            // if (!document.querySelector("#apply-btn")) {
            //     // Apply Now button
            //     let applynowbtndiv = document.createElement("div");
            //     applynowbtndiv.setAttribute("class", "apply-btn mt-3");
            //     applynowbtndiv.setAttribute("id", "apply-btn");
            //     let applynowbtn = document.createElement("a");
            //     applynowbtn.setAttribute("class", "btn btn-outline-primary fs-4 px-3");
            //     applynowbtn.setAttribute("href", "javascript:void(0);"); // Set the href attribute to "javascript:void(0);" to make it clickable
            //     applynowbtn.addEventListener("click", function () {
            //         applyNow(); // Call your applyNow function on button click
            //     });
            //     applynowbtn.innerHTML = "Apply Now";
            //     applynowbtndiv.appendChild(applynowbtn);
            //     jobContainer.appendChild(applynowbtndiv);
            // }

        }
    } catch (error){

    }

}

main()