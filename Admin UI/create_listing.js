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

if (createBtn) {
  
  createBtn.addEventListener("click", async function () {
    Swal.fire({
      position: 'middle',
      icon: 'success',
      title: 'Role listing has been updated',
      showConfirmButton: false,
      timer: 1500
  })

    const jobTitle = document.getElementById('jobTitle').value;
    const details = document.getElementById('jobDescription').value;
    // const responsibilities = document.getElementById('jobResponsibilities').value;
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
        // responsibilities: responsibilities,
        // qualifications: qualifications,
        department: department,
        Skills: filledSkills,
        // salary: parseInt(salary),
        deadline: deadline,
        link: 'role_listing.html',
        applicants_list: 'applicant_list.html',
      }

      firebaseService.pushData(jobsRef, jobData)
        .then(() => {
          console.log("Data has been successfully added!");
          swal({
            title: "Success!",
            text: "You have successfully created a new job listing!",
            timer: 3000, // Set the timer to 8 seconds (8000 milliseconds)
            type: success,
            showConfirmButton: false
          });
      
          setTimeout(() => {
            // Redirect to 'job_listing.html' after the SweetAlert animation
            window.location.href = 'job_listing.html';
          }, 3000); // Adjust the timeout to match the timer duration
        })
        .catch(error => {
          console.error("Error adding data:", error);
        });
    } else {
      // alert("Please fill all fields");
      Swal.fire({
        position: 'middle',
        icon: 'info',
        title: 'Please fill all fields',
        showConfirmButton: false,
        timer: 1500
    })
      // Your code to handle validation errors
      console.log(deadline)
    }
  });
}

const cancelBtn = document.getElementById('cancel')

if (cancelBtn) {
    cancelBtn.addEventListener("click", async function () {
        Swal.fire({
            title: 'Are you sure?',
            text: "Your changes will not be saved!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#808080',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Continue editing'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "job_listing.html";
            }        
        });
    });
}
