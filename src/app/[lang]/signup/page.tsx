
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
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useFirebase, useUser } from '@/firebase';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const formatErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email address format.';
      case 'auth/user-disabled': return 'This account has been disabled.';
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/invalid-credential': return 'Incorrect email or password.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/email-already-in-use': return 'An account with this email already exists.';
      case 'auth/weak-password': return 'Password should be at least 6 characters.';
      default: return 'An error occurred. Please try again.';
    }
};

export default function SignupPage() {
  const params = useParams();
  const lang = params.lang as string;
  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = `/${lang}/profile`;
  const emailFromQuery = searchParams.get('email');

  useEffect(() => {
    if (emailFromQuery) {
        setEmail(emailFromQuery);
    }
  }, [emailFromQuery]);


  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);


  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUserName = `${firstName} ${lastName}`.trim();
      if(newUserName) {
          await updateProfile(userCredential.user, { displayName: newUserName });
      }
      
      // User profile document is created by the FirebaseProvider now.
      // onAuthStateChanged in the provider will see the new user and create the doc.
      toast({ title: 'Account Created Successfully' });
      // onAuthStateChanged will handle redirect.
    } catch (error: any) {
       toast({
          variant: 'destructive',
          title: 'Sign-up Failed',
          description: formatErrorMessage(error.code),
      });
    } finally {
        setIsLoading(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
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
          <CardDescription>
            Join JD News today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
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
                 <div className="relative space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-7 text-muted-foreground"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
            </form>
            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href={`/${lang}/login`} className="underline hover:text-primary">
                    Sign in
                </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
