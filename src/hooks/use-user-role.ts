
'use client';

import { useAuth } from '@/firebase/auth/use-user';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';

type UserRole = 'member' | 'reporter' | 'editor' | 'director' | null;

interface UseUserRoleResult {
  user: DocumentData | null;
  userProfile: DocumentData | null;
  isLoading: boolean;
  role: UserRole;
  isAdmin: boolean;
}

export function useUserRole(): UseUserRoleResult {
  const { user, isUserLoading: isAuthLoading } = useAuth();
  const { firestore } = useFirebase();

  // Guard: Only create doc refs if user is authenticated
  const userDocRef = useMemoFirebase(() => {
    if (user?.uid && firestore) {
      return doc(firestore, 'users', user.uid);
    }
    return null; // Return null if no user
  }, [user?.uid, firestore]);
  
  const roleDocRef = useMemoFirebase(() => {
    if(user?.uid && firestore) {
        return doc(firestore, 'roles', user.uid);
    }
    return null; // Return null if no user
  }, [user?.uid, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);
  const { data: roleDoc, isLoading: isRoleLoading } = useDoc(roleDocRef);
  
  // The isLoading state depends on auth AND the subsequent doc reads.
  const isLoading = isAuthLoading || (!!user && (isProfileLoading || isRoleLoading));

  // Determine role only when not loading and user exists.
  let role: UserRole = null;
  if (!isLoading && user) {
      role = roleDoc ? (roleDoc.role as UserRole) : 'member';
  }
  
  const isAdmin = user?.email === 'jdnewsgujarati@gmail.com';

  return {
    user,
    userProfile,
    isLoading,
    role,
    isAdmin,
  };
}
