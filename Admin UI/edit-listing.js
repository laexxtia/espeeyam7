import app from '../config/newconfig.js';
import FirebaseService from '../config/firebaseService.js';

const firebaseService = new FirebaseService(app);

// Get the jobContainer query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams)
const jobContainerHTML = urlParams.get('jobContainer');
console.log(jobContainerHTML)

// Convert the jobContainer HTML string to a DOM element
const jobContainer = document.createElement('div');
jobContainer.innerHTML = jobContainerHTML;
console.log(jobContainer)

// Get the job data from the jobContainer element
const jobTitle = jobContainer.querySelector('.role-title').textContent;
console.log(jobTitle)

document.getElementById('jobTitle').value = jobTitle;


const jobDescription = jobContainer.querySelector('.jobDescription').textContent;
console.log(jobDescription)
document.getElementById('jobDescription').value = jobDescription;


const jobSkills = jobContainer.querySelector('.skills');
const jobSkillsItems = jobSkills.querySelectorAll('li');

for (let i = 0; i < jobSkillsItems.length; i++) {
    const skillInput = document.getElementById(`skill${i + 1}`);
    skillInput.value = jobSkillsItems[i].textContent;
  }



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

const jobsRef = firebaseService.getDatabaseRef('jobs');
const saveBtn = document.getElementById('save');

if (saveBtn != null) {
    
    saveBtn.addEventListener("click", async function () {
        Swal.fire({
            position: 'middle',
            icon: 'success',
            title: 'Role listing has been updated',
            showConfirmButton: false,
            timer: 1500
        })
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

    
    const jobId = '-NgXnPuSQAe3jscWi_-h'

    const jobRef = firebaseService.getDatabaseRef(`jobs/${jobId}`);
    console.log(jobRef)


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