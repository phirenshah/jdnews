
'use client';

import { useAuth } from '@/firebase/auth/use-user';
import { useDoc, useFirebase } from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';
import { useMemo } from 'react';

type UserRole = 'member' | 'reporter' | 'editor' | 'director' | null;

interface UseUserRoleResult {
  user: DocumentData | null;
  userProfile: DocumentData | null;
  isLoading: boolean;
  role: UserRole;
}

export function useUserRole(): UseUserRoleResult {
  const { user, isUserLoading: isAuthLoading } = useAuth();
  const { firestore } = useFirebase();

  const userDocRef = useMemo(() => {
    if (user?.uid) {
      return doc(firestore, 'users', user.uid);
    }
    return null;
  }, [user?.uid, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const role = userProfile?.role as UserRole;

  return {
    user,
    userProfile,
    isLoading: isAuthLoading || isProfileLoading,
    role,
  };
}

