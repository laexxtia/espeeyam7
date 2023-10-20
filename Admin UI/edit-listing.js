import app from '../config/newconfig.js';
import {
    getDatabase,
    set,
    ref,
    update,
    get,
    child,
    push
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const database = getDatabase(app);

import FirebaseService from '../config/firebaseService.js';
const firebaseService = new FirebaseService(app);

const url = new URL(window.location.href);
const search = url.search.slice(2);
const jobRef = ref(database, 'jobs/' + search);

let job;

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

async function main(){
    try{
        await getJobFromFirebase();
        if(job){
            document.getElementById('jobTitle').value = job.title; 
            document.getElementById('jobDescription').value = job.details;
            document.getElementById('jobDept').value = job.department; 
            document.getElementById('deadline').value = job.deadline;
            for (let i = 0; i < job.Skills.length; i++) {
                const skillInput = document.getElementById(`skill${i + 1}`);
                skillInput.value = job.Skills[i];
            }

            
        }
    } catch (error){
        console.error("Error in main:", error);

    }

}

main()

async function fetchSkillsAndPopulateDropdown() {
try {
    const skills = await firebaseService.fetchSkillsFromFirebase();
    if (skills) {
    populateDropdown(skills);
    } else {
    console.log('No skills data available.');
    }
} catch (error) {
    console.error('Error fetching skills data:', error);
}
}

function populateDropdown(skills) {
const skillsDropdown = document.getElementById('skills');
skillsDropdown.innerHTML = '';
skills.forEach(skill => {
    const option = document.createElement('option');
    option.value = skill;
    skillsDropdown.appendChild(option);
});
}

// Fetch skills data and populate the datalist
fetchSkillsAndPopulateDropdown();

const saveBtn = document.getElementById('save');

if (saveBtn) {
    
    saveBtn.addEventListener("click", async function () {
        Swal.fire({
            position: 'middle',
            icon: 'success',
            title: 'Role listing has been updated',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            // Redirect to role_listing.html
            window.location.href = `role_listing.html?=${encodeURIComponent(search)}`;
        });
        
    const jobTitle = document.getElementById('jobTitle').value;
    const details = document.getElementById('jobDescription').value;
    const responsibilities = document.getElementById('jobResponsibilities').value;
    // const qualifications = document.getElementById('jobQualifications')
    const department = document.getElementById('jobDept').value;
    const skill1 = document.getElementById('skill1').value;
    const skill2 = document.getElementById('skill2').value;
    const skill3 = document.getElementById('skill3').value;
    const skill4 = document.getElementById('skill4').value;
    const skill5 = document.getElementById('skill5').value;
    // const salary = document.getElementById('jobSalary').value;
    const deadline = document.getElementById('deadline').value;

    const allValuesFilled = (
    jobTitle !== "" &&
    details !== "" &&
    department !== "" &&
    deadline !== ""
    );

    const filledSkills = [];

    if (skill1 !== "") {
    filledSkills.push(skill1);
    }
    if (skill2 !== "") {
    filledSkills.push(skill2);
    }
    if (skill3 !== "") {
    filledSkills.push(skill3);
    }
    if (skill4 !== "") {
    filledSkills.push(skill4);
    }
    if (skill5 !== "") {
    filledSkills.push(skill5);
    }

    if (allValuesFilled && filledSkills.length >= 1) {
    const jobData = {
        title: jobTitle,
        details: details,
        responsibilities: responsibilities,
        // qualifications: qualifications,
        department: department,
        Skills: filledSkills,
        // salary: parseInt(salary),
        deadline: deadline
    }

    const jobRef = firebaseService.getDatabaseRef(`jobs/${search}`);
    firebaseService.updateData(jobRef, jobData)
        .then(() => {
        console.log("Data has been successfully updated!");
        })
        .catch(error => {
        console.error("Error updating data:", error);
        });


    // firebaseService.pushData(jobRef, jobData)

    //     .then(() => {
    //     console.log("Data has been successfully updated!");
    //     })
    //     .catch(error => {
    //     console.error("Error updating data:", error);
    //     });

    // jobRef.update(jobData)
    //   .then(() => {
    //     console.log("Data has been successfully updated!");
    //   })
    //   .catch(error => {
    //     console.error("Error updating data:", error);
    //   });
    } 
    
    else {
    Swal.fire({
        position: 'middle',
        icon: 'info',
        title: 'Please fill all fields',
        showConfirmButton: false,
        timer: 1500
    })
    }
});
}