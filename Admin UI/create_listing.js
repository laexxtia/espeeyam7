import app from '../config/newconfig.js';
import { getDatabase, set, ref, update, get, child, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";

const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage()
const storageref = sRef(storage);

let skills = [];

// Define a function to fetch skills from the Firebase database
async function fetchSkillsFromFirebase() {
  const skillsRef = ref(database, 'Skills'); // Use the appropriate reference
  try {
    const snapshot = await get(skillsRef);
    if (snapshot.exists()) {
      const skillsData = snapshot.val();
      skills = Object.values(skillsData);
    } else {
      console.log('No skills data available.');
    }
  } catch (error) {
    console.error('Error fetching skills data:', error);
  }
}

// Define a function to populate the shared datalist
function populateDropdown() {
  const skillsDropdown = document.getElementById('skills');
  skillsDropdown.innerHTML = '';
  skills.forEach(skill => {
    const option = document.createElement('option');
    option.value = skill;
    skillsDropdown.appendChild(option);
  });
}

// Define a function to handle search input for all input elements
function handleSearchInput() {
  const inputElements = document.querySelectorAll('input[list="skills"]');
  inputElements.forEach(inputElement => {
    const searchTerm = inputElement.value.charAt(0).toLowerCase();
    // The rest of the code for handling input and filtering
    // For example, you can filter skills starting with searchTerm
    const filteredSkills = skills.filter(skill =>
      skill.toLowerCase().startsWith(searchTerm)
    );
    // Then, you can update the displayed options in the shared datalist
    const skillsDropdown = document.getElementById('skills');
    skillsDropdown.innerHTML = '';
    filteredSkills.forEach(skill => {
      const option = document.createElement('option');
      option.value = skill;
      skillsDropdown.appendChild(option);
    });
  });
}

// Add event listeners and fetch data
document.querySelectorAll('input[list="skills"]').forEach(inputElement => {
  inputElement.addEventListener('input', handleSearchInput);
});

fetchSkillsFromFirebase()
  .then(() => populateDropdown())
  .catch(error => console.error('Error:', error));


const jobsRef = ref(database, 'jobs')
const createBtn = document.getElementById('submit')


if (createBtn != null){
  createBtn.addEventListener("click", async function() { 
  const jobTitle = document.getElementById('jobTitle').value
  const details = document.getElementById('jobDescription').value
  const location = document.getElementById('jobLocation').value
  const department = document.getElementById('jobDept').value
  const skill1 = document.getElementById('skill1').value
  const skill2 = document.getElementById('skill2').value
  const skill3 = document.getElementById('skill3').value
  const skill4 = document.getElementById('skill4').value
  const skill5 = document.getElementById('skill5').value
  const salary = document.getElementById('jobSalary').value
  const deadline = document.getElementById('deadline').value


  const allValuesFilled = (
    jobTitle !== "" &&
    details !== "" &&
    location !== "" &&
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
    if(allValuesFilled && filledSkills.length >= 1){
      const jobData = {
        title: jobTitle,
        details: details,
        location: location,
        department: department,
        Skills: filledSkills,
        salary: parseInt(salary),
        deadline: new Date(`${deadline}`).getTime()
      }

      push(jobsRef, jobData).then(function() {
        console.log("Data has been successfully added!");
      }).catch(function(error) {
        console.error("Error adding data:", error);
      });

    }
    else{
      alert("Please fill all fields");
      console.log(filledSkills)
      console.log('jobTitle: ', jobTitle);
      console.log('details: ', details);
      console.log('location: ', location);
      console.log('department: ', department);
      console.log('skill1: ', skill1);
      console.log('skill2: ', skill2);
      console.log('skill3: ', skill3);
      console.log('skill4: ', skill4);
      console.log('skill5: ', skill5);
      console.log('salary: ', salary);
      console.log('deadline: ', deadline);
    }
    


  })
}
