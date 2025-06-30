import firebase from "firebase";
const FIREBASE_VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
    return firebaseMessaging.getToken({ vapidKey: FIREBASE_VAPID_KEY }); //등록 토큰 받기
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
    console.log("📨 알람 데이터:", payload);
    console.log("📨 제목:", payload.data.title);
    console.log("📨 내용:", payload.data.body);
    console.log("📨 번호:", payload.data.num);
    setAlarm({num:+payload.data.num, title:payload.data.title, body:payload.data.body})
  });  
}