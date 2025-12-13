'use client';
    
import { User } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider'; 

/**
 * Interface for the return value of the useUser hook.
 */
export interface UseUserResult {
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
 * @returns {UseUserResult} An object containing the user, loading state, and error.
 */
export function useUser(): UseUserResult {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
}
