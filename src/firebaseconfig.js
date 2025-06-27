import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAfKY4xJUACITpzV7oYqFYVDPkL8Vyi8M4",
  authDomain: "moyeoling.firebaseapp.com",
  projectId: "moyeoling",
  storageBucket: "moyeoling.firebasestorage.app",
  messagingSenderId: "378154757141",
  appId: "1:378154757141:web:c4fc33f542f0bc0400321c",
  measurementId: "G-0KHXFDNFFQ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseMessaging = firebaseApp.messaging();

export async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("Service Worker 등록 성공:", registration);
  } catch (error) {
    console.log("Service Worker 등록 실패:", error);
  }    
}

export function firebaseReqPermission(setFcmToken, setAlarm) {
  firebaseMessaging
  .requestPermission()
  .then(() => {
    return firebaseMessaging.getToken({ vapidKey: 'BDVRVC-WTkT3W6SayD3f74st70u2LAPXV55vAX2UOwCt8lOUXJfOaCcFEccUo3Vv_Z-5BIqBuE5iX9c7UTpaQXg' }); //등록 토큰 받기
  })
  .then(function (token) {
    console.log(token)
    setFcmToken(token);
  })
  .catch(function (error) {
    console.log("FCM Error : ", error);
  });

  firebaseMessaging.onMessage((payload) => {
    console.log(payload)
    setAlarm({num:+payload.data.num, title:payload.data.title, body:payload.data.body})
  });  
}