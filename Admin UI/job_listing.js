import app from '../config/newconfig.js';
import FirebaseService from '../config/firebaseService.js'; // Import the FirebaseService class
const firebaseService = new FirebaseService(app);

async function createNew() {
  let createbtn = document.createElement('button');
  createbtn.textContent = 'New Listing';
  createbtn.setAttribute("class", "btn btn-primary");

  createbtn.addEventListener('click', function () {
    // Redirect to create_listing.html in the same folder
    window.location.href = 'create_listing.html';
  });

  const buttonContainer = document.getElementById('createNew');
  buttonContainer.appendChild(createbtn);
}
createNew()

firebaseService.onAuthStateChanged(async (user) => {
  if (user) {
    // User is signed in.
    console.log(user);
    const uid = user.uid;
    console.log(user.uid)
    const user_ref = `Staff/${uid}`;
    let jobs; // Declare a variable to store the jobs data
    let userData;

    const jobsHeading = document.querySelector(".container-fluid h2");
    const jobsMainContainer = document.querySelector(".jobs-list-container");
    const jobSearch = document.querySelector(".form-control");

    let searchTerm = "";

    jobSearch.addEventListener("input", () => {
      searchTerm = jobSearch.value.toLowerCase();
      console.log("Search Term:", searchTerm); // Check if searchTerm is updated
      main();
    });

    // Function to hide all job cards
    function hideAllJobCards() {
      const jobCards = document.querySelectorAll(".job-card");
      jobCards.forEach((card) => {
        card.style.display = "none";
      });
    }

    // Now you can work with the 'jobs' variable here
    let jobsContainer = document.createElement("div");
    jobsContainer.setAttribute("class", "row mx-auto");

    jobsContainer.innerHTML = "";
    jobsMainContainer.innerHTML = "";

    let matchingJobsCount = 0;

    async function getJobsFromFirebase() {
      try {
        jobs = await firebaseService.getDatabaseValue('jobs');
      } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }
    }

    async function getUserDataFromFirebase() {
      userData = await firebaseService.getDatabaseValue(user_ref);
    }

    // To use the function and get the jobs data:
    // ... (Previous code)

// To use the function and get the jobs data:
async function main() {
    try {
      await getJobsFromFirebase(); // Fetch the jobs data
      await getUserDataFromFirebase();
      if (jobs && userData) {
        hideAllJobCards(); // Hide all job cards
  
        // Update the job count in the heading
        jobsHeading.innerHTML = `${Object.keys(jobs).length} Jobs`;
  
        // Clear existing job cards before adding new ones
        jobsContainer.innerHTML = "";
  
        for (const jobId in jobs) {
          const job = jobs[jobId];
          if (job.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            let jobCard = document.createElement("div");
            jobCard.setAttribute("class", "col-3 box job-card");

            let title = document.createElement("h3");
            title.classList.add("job-title");
            title.innerText = job.title;
  
            let details = document.createElement("div");
            details.classList.add("details");
            details.innerText = job.details;
  
            let detailsbtn = document.createElement("a");
            detailsbtn.setAttribute("class", "btn btn-primary");
            detailsbtn.innerHTML = "More Details";
            detailsbtn.href = job.link;
  
            // jobCard.appendChild(image); // Append the image
            jobCard.appendChild(title);
            jobCard.appendChild(details);
  
            // jobCard.appendChild(skill_row); // Append the skill row
  
            jobCard.appendChild(detailsbtn);
            jobsContainer.append(jobCard);
            matchingJobsCount++;
          }
        }
  
        // Append the matching job cards to the jobsMainContainer
        jobsMainContainer.appendChild(jobsContainer);
      } else {
        // Handle the case when no jobs data is available
      }
    } catch (error) {
      // Handle any errors here
    }
  }
  
  // ... (Continued code)
  

    // Call the main function initially
    main();
  } else {
    // No user is signed in. Handle this case if necessary.
    console.log("No user is signed in.");
    window.location.href = '/Login UI/login.html';
  }
});
