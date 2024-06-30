// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth, getReactNativePersistence } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzIn5oVxhRKIqtM0KVr8ZNPNEj8msLTc0",
  authDomain: "animelist-d8a6a.firebaseapp.com",
  projectId: "animelist-d8a6a",
  storageBucket: "animelist-d8a6a.appspot.com",
  messagingSenderId: "716237391059",
  appId: "1:716237391059:web:1ce2a9255b69bd21654026",
  measurementId: "G-2296YZV5Y0"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);