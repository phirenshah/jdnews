'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Always initialize with the config object for consistent behavior across all environments.
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  const auth = getAuth(firebaseApp);
  setPersistence(auth, browserLocalPersistence);
  
  return {
    firebaseApp,
    auth: auth,
    firestore: getFirestore(firebaseApp)
  };
}

export function getRecaptchaVerifier(auth: any, container: HTMLElement) {
    const recaptchaVerifier = new RecaptchaVerifier(auth, container, {
        size: 'invisible'
    });
    return recaptchaVerifier;
}


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './auth/use-user';
