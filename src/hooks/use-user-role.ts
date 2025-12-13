
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
  isAdmin: boolean;
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
  
  const roleDocRef = useMemo(() => {
    if(user?.uid) {
        return doc(firestore, 'roles', user.uid);
    }
    return null;
  }, [user?.uid, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);
  const { data: roleDoc, isLoading: isRoleLoading } = useDoc(roleDocRef);

  // If a role document exists, use its role. Otherwise, default to 'member'.
  const role: UserRole = roleDoc ? (roleDoc.role as UserRole) : 'member';
  
  const isAdmin = role === 'director' || user?.email === 'jdnewsgujarati@gmail.com';

  return {
    user,
    userProfile,
    isLoading: isAuthLoading || isProfileLoading || isRoleLoading,
    role,
    isAdmin,
  };
}
