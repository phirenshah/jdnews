
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

  const userDocRef = useMemoFirebase(() => {
    if (user?.uid && firestore) {
      return doc(firestore, 'users', user.uid);
    }
    return null;
  }, [user, firestore]);
  
  const roleDocRef = useMemoFirebase(() => {
    if(user?.uid && firestore) {
        return doc(firestore, 'roles', user.uid);
    }
    return null;
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);
  const { data: roleDoc, isLoading: isRoleLoading } = useDoc(roleDocRef);

  const role: UserRole = roleDoc ? (roleDoc.role as UserRole) : (user ? 'member' : null);
  
  const isAdmin = role === 'director' || user?.email === 'jdnewsgujarati@gmail.com';

  return {
    user,
    userProfile,
    isLoading: isAuthLoading || isProfileLoading || isRoleLoading,
    role,
    isAdmin,
  };
}
