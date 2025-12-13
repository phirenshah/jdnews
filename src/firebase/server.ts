
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp, credential } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: DO NOT MODIFY THIS FILE

function initializeFirebaseAdmin(): FirebaseApp {
  if (!getApps().length) {
    // Check for explicit service account credentials in environment variables
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            return initializeApp({
                credential: credential.cert(serviceAccount),
                ...firebaseConfig
            });
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT. Initializing with default credentials.", e);
            // Fallback to default credentials if parsing fails
            return initializeApp({
                ...firebaseConfig
            });
        }
    } else {
        // Initialize with default credentials if service account is not provided
        return initializeApp({
            ...firebaseConfig
        });
    }
  }
  return getApp();
}

const adminApp = initializeFirebaseAdmin();
const firestore = getFirestore(adminApp);

export { adminApp, firestore };
