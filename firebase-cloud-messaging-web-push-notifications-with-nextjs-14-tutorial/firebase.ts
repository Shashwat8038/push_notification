import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCvBzkUColukhHiPtuAKl4oqNkRfgmmy4",
  authDomain: "imp-pwa.firebaseapp.com",
  projectId: "imp-pwa",
  storageBucket: "imp-pwa.appspot.com",
  messagingSenderId: "137270323444",
  appId: "1:137270323444:web:3da77a5e440bb5ee6916a1",
  measurementId: "G-KX11V3246L"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
