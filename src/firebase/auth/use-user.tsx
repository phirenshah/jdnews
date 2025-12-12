'use client';
    
import { useState, useEffect } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider'; // Adjusted path if needed

/**
 * Interface for the return value of the useAuth hook.
 */
export interface UseAuthResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * React hook to get the current authenticated user from Firebase.
 *
 * This hook subscribes to Firebase's authentication state and provides the
 * current user object, a loading state, and any potential errors. It's designed
 * to be used within a `FirebaseProvider` context.
 *
 * @returns {UseAuthResult} An object containing the user, loading state, and error.
 */
export function useAuth(): UseAuthResult {
  const { auth } = useFirebase(); // Get the auth instance from context

  const [user, setUser] = useState<User | null>(auth?.currentUser || null);
  const [isUserLoading, setIsLoading] = useState<boolean>(!auth?.currentUser);
  const [userError, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      // Optional: Set an error if auth service is not available
      // setError(new Error("Firebase Auth service is not available."));
      return;
    }

    // Set initial loading state. If there's already a user, we are not "loading"
    // in the sense of waiting for the very first auth check.
    setIsLoading(!auth.currentUser);

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsLoading(false);
        setError(null); // Clear error on successful auth state change
      },
      (error) => {
        console.error("useAuth: onAuthStateChanged error:", error);
        setUser(null);
        setError(error);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [auth]); // Rerun effect if the auth instance changes

  return { user, isUserLoading, userError };
}
