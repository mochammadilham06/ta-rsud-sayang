// Import the functions you need from the SDKs you need
import CONST from '@/utils/getEnv';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: CONST.FIREBASE_APIKEY,
  authDomain: CONST.FIREBASE_AUTH_DOMAIN,
  projectId: CONST.FIREBASE_PROJECT_ID,
  storageBucket: CONST.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: CONST.FIREBASE_MESSAGING_SENDER_ID,
  appId: CONST.FIREBASE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
