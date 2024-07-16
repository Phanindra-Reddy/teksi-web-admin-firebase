// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  // Your Firebase config here
  apiKey: "AIzaSyCvuzmkoq5z-RqjGx8ocCCMzHiSo1iNSeg",
  authDomain: "teksi-cabs.firebaseapp.com",
  projectId: "teksi-cabs",
  storageBucket: "teksi-cabs.appspot.com",
  messagingSenderId: "128086614580",
  appId: "1:128086614580:web:f8f878ed63327373ae6061",
  measurementId: "G-ZZL3H65804",
});

const messaging = firebase.messaging();

// Customize background notification handling here
messaging.onBackgroundMessage((payload) => {
  console.log("Background Message:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/teksi_logo_white.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
