const applicants = [
    {
        name: "John Tan",
        image: "images/software-engineer.png",
        skills: "Python",
        role: "Software Engineer",
        profile: '#'
    },
    
    {
        name: "Xin Wei",
        image: "images/software-engineer.png",
        skills: "Javascript",
        role: "Software Engineer",
        profile: '#'
    },

    {
        name: "Jaslyn Zhu",
        image: "images/software-engineer.png",
        skills: "Python",
        role: "Software Engineer",
        profile: '#'
    },

    {
        name: "Kelsie",
        image: "images/software-engineer.png",
        skills: "Python",
        role: "Software Engineer",
        profile: '#'
    },

]
const appHeading = document.querySelector("h2");

if (applicants.length==1){
    appHeading.innerHTML = `Showing ${applicants.length} Applicants for ${applicants.role}`; 
} else if(applicants.length == 0){
    appHeading.innerHTML = `No Applicants for ${applicants[0].role}`
} else{
    appHeading.innerHTML=`${applicants.length} Applicants for ${applicants[0].role}`
}

const appMainContainer = document.querySelector(".apps-list-container")
const skillSearch = document.querySelector(".form-control")

let searchTerm ="";

function createApplicantList() {
    let appContainer = document.createElement("ul");
    appContainer.setAttribute("class", "list-group list-group-flush");

    appMainContainer.innerHTML=``;

    let matchingAppCount = 0;

    applicants.forEach(applicant => {
        // console.log(job.title);
        if(applicant.skills.toLowerCase().includes(searchTerm.toLowerCase())){

            let appList = document.createElement("li");
            appList.setAttribute("class", "list-group-item") 
            appList.setAttribute("style","display:flex; justify-content:space-between; align-items:center")

            // let image = document.createElement("img");
            // image.src = job.image
            // image.setAttribute("width", "30px")
            // image.setAttribute("height", "30px")

            let nameSkills = document.createElement("div")
            nameSkills.setAttribute("class","nameSkills")

            let name = document.createElement("h3");
            name.classList.add("name");
            name.innerText = applicant.name;

            let skills = document.createElement("div");
            skills.classList.add("skills");
            skills.innerText = `Skills: ${applicant.skills}`;

            nameSkills.appendChild(name)
            nameSkills.appendChild(skills)

            let viewbtn = document.createElement("a")
            viewbtn.setAttribute("class", "btn btn-primary")
            viewbtn.setAttribute("style","display:flex; align-items:center")
            viewbtn.innerHTML = "View";
            viewbtn.href = applicant.profile;

            // let applicantsbtn = document.createElement("a")
            // applicantsbtn.setAttribute("class", "btn btn-primary applicantsbtn")
            // applicantsbtn.innerHTML = "View Applicants";
            // applicantsbtn.href = job.appLink;

            // jobCard.appendChild(image);
            appList.appendChild(nameSkills);
            // appList.appendChild(skills);
            appList.appendChild(viewbtn);
            // jobCard.appendChild(applicantsbtn)

            appContainer.append(appList)
            
            appMainContainer.append(appContainer)
            matchingAppCount++
        }
        if (matchingAppCount === 1) {
            appHeading.innerHTML = `${matchingAppCount} Applicant for ${applicants[0].role}`;
        } else if(matchingAppCount == 0){
            appHeading.innerHTML = `No Applicants for ${applicants.role}`
        } else{
            appHeading.innerHTML=`${matchingAppCount} Applicants for ${applicants[0].role}`
        }
    
    })
}

createApplicantList();

skillSearch.addEventListener("input",(e) =>{
    searchTerm=e.target.value;
    createApplicantList();
})
