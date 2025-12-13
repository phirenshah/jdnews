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
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useFirebase, useUser } from '@/firebase';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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

const formatErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email address format.';
      case 'auth/user-disabled': return 'This account has been disabled.';
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/invalid-credential': return 'Incorrect email or password.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/email-already-in-use': return 'An account with this email already exists.';
      case 'auth/weak-password': return 'Password should be at least 6 characters.';
      case 'auth/popup-closed-by-user': return 'Sign in was cancelled.';
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

  const redirectUrl = searchParams.get('redirect') || `/${lang}/profile`;

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);

 const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      // The onAuthStateChanged listener in FirebaseProvider will handle user creation.
      await signInWithPopup(auth, provider);
      toast({ title: 'Account Created', description: 'Welcome to JD News!' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-Up Failed',
        description: formatErrorMessage(error.code),
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUserName = `${firstName} ${lastName}`.trim();
      await updateProfile(userCredential.user, { displayName: newUserName });
      
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
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Continue with Google
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
