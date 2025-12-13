
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
import { useAuth } from '@/firebase/auth/use-user';
import Image from 'next/image';
import { useState, useEffect, FormEvent } from 'react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function SignupPage() {
  const params = useParams();
  const lang = params.lang as string;
  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const redirectUrl = searchParams.get('redirect') || `/${lang}/profile`;
  const emailFromParams = searchParams.get('email');

  useEffect(() => {
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [emailFromParams]);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore || !email || !password || !firstName) {
        toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill out all required fields.' });
        return;
    };

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        // Update profile display name
        await updateProfile(newUser, { displayName: `${firstName} ${lastName}`.trim() });

        // Create user document in Firestore
        const userDocRef = doc(firestore, 'users', newUser.uid);
        // The role is now managed in the /roles collection by an admin
        // and defaults to 'member' in security rules if not present.
        // We set the default role on the user object for client-side convenience.
        const role = 'member'; 
        setDocumentNonBlocking(userDocRef, {
            id: newUser.uid,
            email: newUser.email,
            firstName: firstName,
            lastName: lastName,
            role: role,
        }, { merge: true });

        toast({ title: 'Account Created!', description: 'Welcome to JD News.' });
        router.push(redirectUrl);
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
             toast({
                variant: 'destructive',
                title: 'Email already in use',
                description: 'This email is already associated with an account. Please log in.',
            });
            router.push(`/${lang}/login?email=${encodeURIComponent(email)}`);
        } else {
            toast({
                variant: 'destructive',
                title: 'Sign-up Failed',
                description: error.message,
            });
        }
    }
  };


  if (isUserLoading) {
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
            Create an Account
          </CardTitle>
          <CardDescription>Join JD News today.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className='grid grid-cols-2 gap-4'>
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" type="text" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" type="text" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
        </form>
         <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href={`/${lang}/login`} className="underline hover:text-primary">
                Log in
            </Link>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
