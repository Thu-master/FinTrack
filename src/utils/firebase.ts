import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';

// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC6vCOnmWbnDP-4kKg3m2ebjJU4aJFKMPU",
  authDomain: "fintrack-576db.firebaseapp.com",
  projectId: "fintrack-576db",
  storageBucket: "fintrack-576db.firebasestorage.app",
  messagingSenderId: "294724128159",
  appId: "1:294724128159:web:97654d30732d37d3f141aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let authInstance: any;

if (Platform.OS === 'web') {
  // On web, getAuth automatically uses IndexedDB persistence
  authInstance = getAuth(app);
} else {
  // On native, we must provide getReactNativePersistence
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export const auth = authInstance;

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;
