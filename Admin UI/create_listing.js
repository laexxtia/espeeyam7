import app from '../config/newconfig.js';
import FirebaseService from '../config/firebaseService.js';

const firebaseService = new FirebaseService(app);

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
const createBtn = document.getElementById('submit');

if (createBtn != null) {
  createBtn.addEventListener("click", async function () {
    const jobTitle = document.getElementById('jobTitle').value;
    const details = document.getElementById('jobDescription').value;
    const responsibilities = document.getElementById('jobResponsibilities').value;
    const qualifications = document.getElementById('jobQualifications')

    const department = document.getElementById('jobDept').value;
    const skill1 = document.getElementById('skill1').value;
    const skill2 = document.getElementById('skill2').value;
    const skill3 = document.getElementById('skill3').value;
    const skill4 = document.getElementById('skill4').value;
    const skill5 = document.getElementById('skill5').value;
    const salary = document.getElementById('jobSalary').value;
    const deadline = document.getElementById('deadline').value;

    const allValuesFilled = (
      jobTitle !== "" &&
      details !== "" &&
      department !== "" &&
      salary !== "" &&
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
        qualifications: qualifications,
        department: department,
        Skills: filledSkills,
        salary: parseInt(salary),
        deadline: new Date(`${deadline}`).getTime()
      }

      firebaseService.pushData(jobsRef, jobData)
        .then(() => {
          console.log("Data has been successfully added!");
        })
        .catch(error => {
          console.error("Error adding data:", error);
        });
    } else {
      alert("Please fill all fields");
      // Your code to handle validation errors
    }
  });
}