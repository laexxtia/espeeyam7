import { getDatabase, set, ref, update, get, child, push } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";


class FirebaseService {
    constructor(app) {
      this.database = getDatabase(app);
      this.auth = getAuth(app);
      this.storage = getStorage();
      this.currentUser = null;
    }
  
    async signInWithEmailAndPassword(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        this.currentUser = userCredential.user;
        return userCredential.user;
      } catch (error) {
        console.error("Error signing in:", error);
        throw error;
      }
    }
  
    async signOut() {
      try {
        await signOut(this.auth);
        this.currentUser = null;
      } catch (error) {
        console.error("Error signing out:", error);
        throw error;
      }
    }
  
    async onAuthStateChanged(callback) {
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        callback(user);
      });
    }
  
    async getDatabaseValue(refPath) {

      const snapshot = await get(refPath);
      return snapshot.val();
    }
  
    async uploadFileToStorage(refPath, file) {
      const storageRef = sRef(this.storage, refPath);
      await uploadBytes(storageRef, file);
    }
  
    async getDownloadURLFromStorage(refPath) {
      const storageRef = sRef(this.storage, refPath);
      return getDownloadURL(storageRef);
    }

    async fetchSkillsFromFirebase() {
        const skillsRef = this.getDatabaseRef('Skills');
        try {
          const snapshot = await get(skillsRef);
          if (snapshot.exists()) {
            const skillsData = snapshot.val();
            return Object.values(skillsData);
          } else {
            return null;
          }
        } catch (error) {
          throw error;
        }
      }
      
      async fetchJobsFromFirebase() {
        const skillsRef = this.getDatabaseRef('jobs');
        try {
          const snapshot = await get(skillsRef);
          if (snapshot.exists()) {
            const skillsData = snapshot.val();
            return Object.values(skillsData);
          } else {
            return null;
          }
        } catch (error) {
          throw error;
        }
      }

      getDatabaseRef(path) {
        return ref(this.database, path);
      }

      pushData(ref, data) {
        return push(ref, data);
      }
  }
  
  
  export default FirebaseService;
  