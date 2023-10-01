const jobs = [
    {
        title: "Software Engineer",
        image: "images/software-engineer.png",
        details:
        "Responsible for designing, developing and maintaining software systems and applications.",
        // openPositions: "2",
        link: "role_listing.html",
        appLink: "applicant_list.html"
    },
    
    {
        title: "Data Scientist",
        image: "images/data-scientist.png",
        details:
        "Responsible for collecting, analyzing and interpreting large data sets to help organizations make better decisions.",
        // openPositions: "3",
        link: "#",
        appLink: "applicant_list.html"
    },
    
    {
        title: "Project Manager",
        image: "images/project-manager.png",
        details:
        "Responsible for planning, executing and closing projects on time and within budget.",
        // openPositions: "1",
        link: "#",
        appLink: "applicant_list.html"
    },
    
    {
        title: "Product Manager",
        image: "images/product-manager.png",
        details:
        "Responsible for managing the entire product life cycle, from ideation to launch and post-launch maintenance.",
        // openPositions: "1",
        link: "#",
        appLink: "applicant_list.html"
    },
    
    {
        title: "Sales Representative",
        image: "images/sales-representative.png",
        details:
        "Responsible for reaching out to potential customers and closing sales deals.",
        // openPositions: "4",
        link: "#",
        appLink: "applicant_list.html"
    },

]

const jobsHeading = document.querySelector(".container-fluid h2");
const jobsMainContainer = document.querySelector(".jobs-list-container")
const jobSearch = document.querySelector(".form-control")

let searchTerm ="";


if (jobs.length==1){
    jobsHeading.innerHTML = `${jobs.length} Job`; 
} else if(jobs.length == 0){
    jobsHeading.innerHTML = `No Jobs`
} else{
    jobsHeading.innerHTML=`${jobs.length} Jobs`
}

function createJobListingCards() {
    let jobsContainer = document.createElement("div");
    jobsContainer.setAttribute("class", "row mx-auto");

    jobsContainer.innerHTML="";
    jobsMainContainer.innerHTML="";

    let matchingJobsCount = 0;

    jobs.forEach(job => {
        // console.log(job.title);
        if(job.title.toLowerCase().includes(searchTerm.toLowerCase())){

            let jobCard = document.createElement("div");
            jobCard.setAttribute("class", "col-3 box") 

            let image = document.createElement("img");
            image.src = job.image
            image.setAttribute("width", "30px")
            image.setAttribute("height", "30px")


            let title = document.createElement("h3");
            title.classList.add("job-title");
            title.innerText = job.title;

            let details = document.createElement("div");
            details.classList.add("details");
            details.innerText = job.details;

            let detailsbtn = document.createElement("a")
            detailsbtn.setAttribute("class", "btn btn-primary")
            detailsbtn.innerHTML = "More Details";
            detailsbtn.href = job.link;

            let applicantsbtn = document.createElement("a")
            applicantsbtn.setAttribute("class", "btn btn-primary applicantsbtn")
            applicantsbtn.innerHTML = "View Applicants";
            applicantsbtn.href = job.appLink;

            jobCard.appendChild(image);
            jobCard.appendChild(title);
            jobCard.appendChild(details);
            jobCard.appendChild(detailsbtn);
            jobCard.appendChild(applicantsbtn)

            jobsContainer.append(jobCard)
            
            jobsMainContainer.append(jobsContainer)
            matchingJobsCount++
        }
        if (matchingJobsCount === 1) {
            jobsHeading.innerHTML = `${matchingJobsCount} Job`;
        } else if(matchingJobsCount == 0){
            jobsHeading.innerHTML = `No Jobs`
        } else{
            jobsHeading.innerHTML=`${jobs.length} Jobs`
        }
    
    })
}

createJobListingCards();

jobSearch.addEventListener("input",(e) =>{
    searchTerm=e.target.value;
    createJobListingCards();
})

function createNew(){
    let createbtn = document.createElement('button');
    createbtn.textContent = 'New Listing';
    createbtn.setAttribute("class", "btn btn-primary")

    createbtn.addEventListener('click', function() {
        // Redirect to create_listing.html in the same folder
        window.location.href = 'create_listing.html';
      });

    const buttonContainer = document.getElementById('createNew');
    buttonContainer.appendChild(createbtn);
}

createNew()
