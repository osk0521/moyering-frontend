// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAfKY4xJUACITpzV7oYqFYVDPkL8Vyi8M4",
  authDomain: "moyeoling.firebaseapp.com",
  projectId: "moyeoling",
  storageBucket: "moyeoling.firebasestorage.app",
  messagingSenderId: "378154757141",
  appId: "1:378154757141:web:c4fc33f542f0bc0400321c",
  measurementId: "G-0KHXFDNFFQ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  if (!(self.Notification && self.Notification.permission === 'granted')) 
    return;

  console.log('Background Message:', payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});