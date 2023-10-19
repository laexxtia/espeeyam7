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

// Deadline date ( can uncomment later)
// const jobDeadline = jobContainer.querySelector('.deadline').textContent;
// console.log(jobDeadline)

// const deadlineDate = new Date(jobDeadline);
// const deadlineDateString = deadlineDate.toISOString().substring(0, 10);
// // console.log(deadlineDateString)

// document.getElementById('deadline').value = deadlineDateString;

