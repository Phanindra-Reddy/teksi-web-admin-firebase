// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  browserPopupRedirectResolver,
  browserSessionPersistence,
  getAuth,
  initializeAuth,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvuzmkoq5z-RqjGx8ocCCMzHiSo1iNSeg",
  authDomain: "teksi-cabs.firebaseapp.com",
  projectId: "teksi-cabs",
  storageBucket: "teksi-cabs.appspot.com",
  messagingSenderId: "128086614580",
  appId: "1:128086614580:web:f8f878ed63327373ae6061",
  measurementId: "G-ZZL3H65804",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const firestoreDb = getFirestore(app);
export const realDb = getDatabase(app);
export const storage = getStorage(app);

// export const auth = initializeAuth(app, {
//   persistence: browserSessionPersistence,
//   popupRedirectResolver: browserPopupRedirectResolver,
// });

// Firebase Cloud Messaging ( Push Notifications )
export const messaging = getMessaging(app);

export const setupNotifications = async () => {
  try {
    // Request permission for notifications
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
      // Get the FCM token
      const token = await getToken(messaging, {
        vapidKey1:
          "BMSX0kbe3pLV0vTlZS-JYq0LP48TUU2yg2SpjyGNWtM9yE-bW9Tk7ZQ9P1RBjd0SKmMqGPFHn-H1Z890ERqHjiA",
      });
      console.log("FCM Token:", token);
      const realDb = getDatabase();
      set(ref(realDb, `fcmToken/`), token);
    } else {
      console.log("Notification permission denied.");
    }
    // Handle foreground notifications
    onMessage(messaging, (payload) => {
      console.log("Foreground Message:", payload);
      // Handle the notification or update your UI
    });
  } catch (error) {
    console.error("Error setting up notifications:", error);
  }
};
