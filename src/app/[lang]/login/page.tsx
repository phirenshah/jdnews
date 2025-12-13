'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useState, useEffect, FormEvent } from 'react';
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithEmailAndPassword,
  getRedirectResult,
} from 'firebase/auth';
import { useFirebase, useUser } from '@/firebase';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { UserProfile } from '@/lib/definitions';


const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function LoginPage() {
  const params = useParams();
  const lang = params.lang as string;
  const { auth, firestore } = useFirebase();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const redirectUrl = searchParams.get('redirect') || `/${lang}/profile`;
  
  useEffect(() => {
    // This effect handles the user already being logged in and redirecting them.
    if (isAuthLoading) {
      return; // Wait until auth state is determined
    }
    if (user) {
      router.replace(redirectUrl);
    } else {
      // Only set loading to false if auth is done and there's no user.
      // This allows the redirect result check to complete first.
      setIsLoading(false);
    }
  }, [user, isAuthLoading, router, redirectUrl]);

  useEffect(() => {
    // This effect specifically handles the result of a Google sign-in redirect.
    const processRedirectResult = async () => {
      if (auth && firestore && !user) { // Only run if not already logged in
        try {
          const result = await getRedirectResult(auth);
          if (result) {
            // User signed in via redirect.
            setIsLoading(true); // Show loader while we process the result
            const firebaseUser = result.user;
            const userRef = doc(firestore, 'users', firebaseUser.uid);
            
            const userProfile: Partial<UserProfile> = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                firstName: firebaseUser.displayName?.split(' ')[0] || '',
                lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                role: 'member',
            };
            
            setDocumentNonBlocking(userRef, userProfile, { merge: true });
            
            toast({ title: 'Login Successful', description: 'Welcome back!' });
            // The onAuthStateChanged listener will now have the user, and the first useEffect will handle the redirect.
          }
        } catch (error: any) {
          console.error("Error processing redirect result:", error);
          toast({
            variant: 'destructive',
            title: 'Google Sign-In Failed',
            description: error.message,
          });
          setIsLoading(false); // Stop loading on failure
        }
      }
    };
    
    processRedirectResult();
  }, [auth, firestore, toast, user]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    await signInWithRedirect(auth, provider);
  };

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth || !email || !password) return;
    setIsLoading(true);

    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Login Successful' });
        // The onAuthStateChanged listener will update the user state,
        // and the main useEffect will handle the redirect.
    } catch (error: any) {
        setIsLoading(false); // Stop loading on failure
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'Incorrect email or password. Please try again or sign up.',
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: error.message,
            });
        }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <Link href={`/${lang}`} className="mb-4 flex justify-center">
            <Image
              src="/logo.png"
              alt="JD News Logo"
              width={120}
              height={0}
              style={{ height: 'auto' }}
            />
          </Link>
          <CardTitle className="text-2xl font-headline">
            Welcome to JD News
          </CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <GoogleIcon />
              Sign in with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
            </form>
            <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href={`/${lang}/signup?redirect=${encodeURIComponent(redirectUrl)}`} className="underline hover:text-primary">
                    Sign up
                </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
