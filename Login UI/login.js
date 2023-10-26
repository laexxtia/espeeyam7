import app from '../config/newconfig.js';
import FirebaseService from '../config/firebaseService.js';

const firebaseService = new FirebaseService(app)

let login = document.getElementById('submit');

if (login != null) {
  login.addEventListener("click", async function () {
    const inputEmail = document.getElementById('email').value;
    const inputPassword = document.getElementById('password').value;
    console.log(inputEmail);
    console.log(inputPassword);

    if (inputEmail !== "" && inputPassword !== "") {
      try {
        await firebaseService.signInWithEmailAndPassword(inputEmail, inputPassword);

        // Use onAuthStateChanged to redirect based on user role
        firebaseService.onAuthStateChanged(async function (user) {
          if (user) {
            const userUID = user.uid;
            console.log(userUID)
            const user_ref = firebaseService.getDatabaseRef('Staff/' + userUID);
            const userData = await firebaseService.getDatabaseValue(user_ref);
            if (userData) {
              const user_accesss = userData.Access_Rights;
              if (user_accesss == 1) {
                window.location.href = '../Staff UI/job_listing.html';
              } else {
                window.location.href = '../Admin UI/job_listing.html';
              }
            } else {
              console.log("User data not found");
            }
          } else {
            console.log("User is not signed in");
          }
        });
      } catch (error) {
        // Handle login failure and show an alert with the error message
        console.error("Login failed:", error);
        alert("Login failed. Please check your email and password.");
      }
    } else {
      alert("Both fields are required!");
    }
  });
}
