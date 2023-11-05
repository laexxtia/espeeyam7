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
    console.log(user.uid);
    const user_ref = firebaseService.getDatabaseRef(`Staff/${uid}`);
    var currentURL = window.location.href;
    var url = new URL(currentURL);
    var search = url.search.slice(2);
    const job_ref = firebaseService.getDatabaseRef(`jobs/` + search);
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

    function hideAllJobCards() {
      const jobCards = document.querySelectorAll(".job-card");
      jobCards.forEach((card) => {
        card.style.display = "none";
      });
    }

    function showAllJobCards() {
      const jobCards = document.querySelectorAll(".job-card");
      jobCards.forEach(card => {
          card.style.display = "block";
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
        jobs = await firebaseService.getDatabaseValue(job_ref);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }
    }

    async function getUserDataFromFirebase() {
      userData = await firebaseService.getDatabaseValue(user_ref);
    }

    // skills filter, copied over from staff UI--------------------------------------------------------

    async function getSkillsFromDatabase() {
      try {
          await getJobsFromFirebase()
          const allSkills = [];
          for (const i in jobs){
              console.log(jobs[i]['Skills']);
              const skill_list = jobs[i]['Skills']
              for (const j in skill_list){
                  if(!allSkills.includes(skill_list[j])){
                      allSkills.push(skill_list[j])
                  }
              }
          }

          return allSkills

      } catch (error) {
          console.error("Error fetching skills:", error);
          throw error;
      }
  }

    function filterJobCardsBySkills() {
      const selectedSkills = Array.from(document.querySelectorAll(".skill-button.active"))
          .map(skillButton => skillButton.innerText.toLowerCase());
  
      if (selectedSkills.length === 0) {
          showAllJobCards();
          return;
      }
  
      hideAllJobCards(); 

      for (const jobId in jobs) {
        const job = jobs[jobId];

        // selectedSkills is all lowercase, convert job.Skills to all lowercase accordingly
        job.Skills = job.Skills.map(skill => skill.toLowerCase());

        if (selectedSkills.every(skill => job.Skills.includes(skill))) {
          const jobCard = document.getElementById(`job-card-${jobId}`);
          if (jobCard) {
            jobCard.style.display = "block"
          }
        }
      }
  }

  async function generateSkillCheckboxes() {
    const allSkills = await getSkillsFromDatabase();
    const skillsFilter = document.querySelector(".skills-filter");



    allSkills.forEach(skill => {
        const skillElement = document.createElement("button");
        skillElement.classList.add("skill-button", "rounded-pill"); 
        skillElement.innerText = skill;

        skillElement.addEventListener("click", () => {
            console.log(skillElement.innerText)
            skillElement.classList.toggle("active");
            filterJobCardsBySkills();
        });

        skillsFilter.appendChild(skillElement);
    });

    const clearAllLink = document.createElement("a");
    clearAllLink.href = "#";
    clearAllLink.id = "clear-all-link";
    clearAllLink.innerText = "Clear All";
    skillsFilter.appendChild(clearAllLink);
    
    clearAllLink.addEventListener("click", () => {
        const skillButtons = document.querySelectorAll(".skill-button");
        skillButtons.forEach(button => {
            button.classList.remove("active");
        });
        filterJobCardsBySkills();
    });

}

generateSkillCheckboxes();

// --------------------------------------------------------------------------------------------------


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
            
            // set job.Skills as jobCard id for skills filter function
            jobCard.setAttribute("id", `job-card-${jobId}`);

            let title = document.createElement("h3");
            title.classList.add("job-title");
            title.innerText = job.title;
  
            let details = document.createElement("div");
            details.classList.add("details");
            details.innerText = job.details;

            let btndiv = document.createElement("div");
            btndiv.classList.add("btndiv");
  
            let detailsbtn = document.createElement("a");
            detailsbtn.setAttribute("class", "btn btn-primary");
            detailsbtn.innerHTML = "More Details";
            detailsbtn.href = "role_listing.html?=" + jobId
            

            let applicantbtn = document.createElement("a");
            applicantbtn.setAttribute("class", "btn btn-outline-primary");
            applicantbtn.innerHTML = "View Applicants";
            applicantbtn.href = "applicant_list.html" + "?=" + jobId;

            btndiv.appendChild(detailsbtn);
            btndiv.appendChild(applicantbtn);
  
            // jobCard.appendChild(image); // Append the image
            jobCard.appendChild(title);
            jobCard.appendChild(details);
  
            // jobCard.appendChild(skill_row); // Append the skill row
  
            // jobCard.appendChild(detailsbtn);
            // jobCard.appendChild(applicantbtn);
            jobCard.appendChild(btndiv);
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
  
    main();
  } else {
    console.log("No user is signed in.");
    window.location.href = '/Login UI/login.html';
  }
});
