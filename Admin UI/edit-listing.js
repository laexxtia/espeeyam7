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

const jobDescription = jobContainer.querySelector('.jobDescription').textContent;
console.log(jobDescription)

const jobSkills = jobContainer.querySelector('.skills').textContent;
console.log(jobSkills)

const jobDeadline = jobContainer.querySelector('.deadline').textContent;
console.log(jobDeadline)


