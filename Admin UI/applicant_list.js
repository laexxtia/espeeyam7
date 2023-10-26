import app from '../config/newconfig.js';
import FirebaseService from '../config/firebaseService.js';

const firebaseService = new FirebaseService(app)
const applicantProfileCardContainer = document.getElementById('applicantCards');
var currentURL = window.location.href;
var url = new URL(currentURL);
var jobID = url.search.slice(2);

const jobRef = firebaseService.getDatabaseRef('jobs/' + jobID);
const applicantContainer = document.querySelector("#applicants");

let job;
let applicants;  
let userData;

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
            applicants = job.applicants
            for (const i in applicants){
                const userRef = firebaseService.getDatabaseRef("Staff/" + applicants[i]);

                async function getUserDataFromFirebase() {
                    try {
                        const snapshot = await firebaseService.getDatabaseValue(userRef); // Retrieve data from the Firebase Realtime Database using the 'user_ref' you defined
                        if (snapshot) {
                            userData = snapshot; // Assign the retrieved data to the 'userData' variable
                        } else {
                            userData = null; // Set 'userData' to null or another appropriate value when no data exists
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                        throw error;
                    }
                }
                await getUserDataFromFirebase();
                console.log(userData);
                const applicantCardHTML = `
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${userData.Staff_FName} ${userData.Staff_LName}</h5>
                            <p class="card-text">Email: ${userData.Email}</p>
                            <p class="card-text">Country: ${userData.Country}</p>
                            <p class="card-text">Department: ${userData.Dept}</p>
                            <div class = skillrow>

                            </div>
                        </div>
                    </div>
                </div>
                `
                applicantContainer.innerHTML += applicantCardHTML;
                const skillrow = document.querySelector(".skillrow");
                var skill_btns = document.createElement("div");
                skill_btns.setAttribute("class", "scrollable-div")
                console.log("hi")
                for (const i in job.Skills) {
                    let skills_needed = document.createElement("span");
                    skills_needed.innerText = job.Skills[i]; // Set the default text
                    
                    for (const j in userData.Skill) {
                        if (userData.Skill[j].toLowerCase() === job.Skills[i].toLowerCase()) {
                            skills_needed.setAttribute("class", "btn btn-success test");
                            break; // Skill matched, no need to continue checking
                        } else {
                            skills_needed.setAttribute("class", "btn btn-secondary test disabled");
                        }
                    }
                    skill_btns.appendChild(skills_needed);
                    skillrow.appendChild(skill_btns);
                    console.log(skillrow);
                }
                
            }
            
        }
    } catch(error){

    }
};
// const applicants = [
//     {
//         name: "John Tan",
//         image: "images/software-engineer.png",
//         skills: "Python",
//         role: "Software Engineer",
//         profile: '#'
//     },
    
//     {
//         name: "Xin Wei",
//         image: "images/software-engineer.png",
//         skills: "Javascript",
//         role: "Software Engineer",
//         profile: '#'
//     },

//     {
//         name: "Jaslyn Zhu",
//         image: "images/software-engineer.png",
//         skills: "Python",
//         role: "Software Engineer",
//         profile: '#'
//     },

//     {
//         name: "Kelsie",
//         image: "images/software-engineer.png",
//         skills: "Python",
//         role: "Software Engineer",
//         profile: '#'
//     },

// ]
// const appHeading = document.querySelector("h2");

// if (applicants.length==1){
//     appHeading.innerHTML = `Showing ${applicants.length} Applicants for ${applicants.role}`; 
// } else if(applicants.length == 0){
//     appHeading.innerHTML = `No Applicants for ${applicants[0].role}`
// } else{
//     appHeading.innerHTML=`${applicants.length} Applicants for ${applicants[0].role}`
// }

// const appMainContainer = document.querySelector(".apps-list-container")
// const skillSearch = document.querySelector(".form-control")

// let searchTerm ="";

// function createApplicantList() {
//     let appContainer = document.createElement("ul");
//     appContainer.setAttribute("class", "list-group list-group-flush");

//     appMainContainer.innerHTML=``;

//     let matchingAppCount = 0;

//     applicants.forEach(applicant => {
//         // console.log(job.title);
//         if(applicant.skills.toLowerCase().includes(searchTerm.toLowerCase())){

//             let appList = document.createElement("li");
//             appList.setAttribute("class", "list-group-item") 
//             appList.setAttribute("style","display:flex; justify-content:space-between; align-items:center")

//             // let image = document.createElement("img");
//             // image.src = job.image
//             // image.setAttribute("width", "30px")
//             // image.setAttribute("height", "30px")

//             let nameSkills = document.createElement("div")
//             nameSkills.setAttribute("class","nameSkills")

//             let name = document.createElement("h3");
//             name.classList.add("name");
//             name.innerText = applicant.name;

//             let skills = document.createElement("div");
//             skills.classList.add("skills");
//             skills.innerText = `Skills: ${applicant.skills}`;

//             nameSkills.appendChild(name)
//             nameSkills.appendChild(skills)

//             let viewbtn = document.createElement("a")
//             viewbtn.setAttribute("class", "btn btn-primary")
//             viewbtn.setAttribute("style","display:flex; align-items:center")
//             viewbtn.innerHTML = "View";
//             viewbtn.href = applicant.profile;

//             let applicantsbtn = document.createElement("a")
//             applicantsbtn.setAttribute("class", "btn btn-primary applicantsbtn")
//             applicantsbtn.innerHTML = "View Applicants";
//             applicantsbtn.href = job.appLink;

//             // jobCard.appendChild(image);
//             appList.appendChild(nameSkills);
//             // appList.appendChild(skills);
//             appList.appendChild(viewbtn);
//             jobCard.appendChild(applicantsbtn)

//             appContainer.append(appList)
            
//             appMainContainer.append(appContainer)
//             matchingAppCount++
//         }
//         if (matchingAppCount === 1) {
//             appHeading.innerHTML = `${matchingAppCount} Applicant for ${applicants[0].role}`;
//         } else if(matchingAppCount == 0){
//             appHeading.innerHTML = `No Applicants for ${applicants.role}`
//         } else{
//             appHeading.innerHTML=`${matchingAppCount} Applicants for ${applicants[0].role}`
//         }
    
//     })
// }

main();

// skillSearch.addEventListener("input",(e) =>{
//     searchTerm=e.target.value;
//     createApplicantList();
// })
