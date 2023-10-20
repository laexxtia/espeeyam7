import app from "../config/newconfig.js";
import {
    getDatabase,
    set,
    ref,
    update,
    get,
    child,
    push
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const database = getDatabase(app);
var currentURL = window.location.href;
console.log(currentURL)
const userID = sessionStorage.getItem("userID");
var url = new URL(currentURL);
var search = url.search.slice(2);
console.log(search)
const jobRef = ref(database, 'jobs/' + search);
const user_ref = ref(database, 'Staff/' + userID);
const jobContainer = document.querySelector(".card-body")
console.log("hi")

document.addEventListener('DOMContentLoaded', async function () {
    
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams)
    const jobId = urlParams.get('jobKey');

    if (!jobId) {
        // Handle the case when jobId is not provided in the URL.
        console.log("error")
        return;
    }

    // Retrieve job listing data from Firebase
    try {
        const jobData = await firebaseService.getDataById('jobs', jobId);

        if (jobData) {
            // Populate the form fields with retrieved data
            document.getElementById('jobTitle').value = jobData.title;
            console.log(jobData.title)
            document.getElementById('jobDescription').value = jobData.details;
            document.getElementById('jobDept').value = jobData.department;
            document.getElementById('skill1').value = jobData.Skills[0];
            document.getElementById('skill2').value = jobData.details[1];
            document.getElementById('skill3').value = jobData.details[2];
            document.getElementById('skill4').value = jobData.details[3];
            document.getElementById('skill5').value = jobData.details[4];

            // Populate other fields similarly

            // Add a click event listener to the "Save" button
            document.getElementById('save').addEventListener('click', async function () {
                // Update job listing data with the new values
                jobData.title = document.getElementById('jobTitle').value;
                jobData.details = document.getElementById('jobDescription').value;

                // Update other fields similarly

                // Save the updated job data back to Firebase
                await firebaseService.updateData('jobs', jobId, jobData);

                // Redirect back to the job listing page
                window.location.href = 'job_listing.html';
            });
        } else {
            // Handle the case when jobData is not found in the database.
        }
    } catch (error) {
        // Handle any errors that may occur during data retrieval.
        console.error('Error fetching job data:', error);
    }
});
