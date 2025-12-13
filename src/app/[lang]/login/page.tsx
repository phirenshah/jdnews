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
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail
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
      case 'auth/popup-closed-by-user': return 'Sign in was cancelled.';
      default: return 'An error occurred. Please try again.';
    }
};

export default function LoginPage() {
  const params = useParams();
  const lang = params.lang as string;
  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect') || `/${lang}/profile`;

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);
  
  const handleEmailCheck = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);

    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
            // User exists, prompt for password
            setStep('password');
        } else {
            // User does not exist, redirect to signup
            router.push(`/${lang}/signup?email=${encodeURIComponent(email)}`);
        }
    } catch (error: any) {
        // A common error is auth/invalid-email, which we want to show to the user.
        // Other errors can be treated as if the user doesn't exist, for a smoother flow.
        if (error.code === 'auth/invalid-email') {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: formatErrorMessage(error.code),
            });
        } else {
            // For other errors, assume user doesn't exist to allow signup.
            router.push(`/${lang}/signup?email=${encodeURIComponent(email)}`);
        }
    } finally {
        setIsLoading(false);
    }
  };


  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login Successful' });
    } catch (error: any) {
       toast({
          variant: 'destructive',
          title: 'Login Failed',
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
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to continue to JD News
          </CardDescription>
        </CardHeader>
        <CardContent>
            {step === 'email' ? (
                <form onSubmit={handleEmailCheck} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Continue
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} disabled />
                    </div>
                     <div className="relative space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus/>
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
                      Sign In
                    </Button>
                     <Button variant="link" size="sm" onClick={() => setStep('email')} className="p-0 h-auto">
                        Use a different email
                    </Button>
                </form>
            )}
            <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href={`/${lang}/signup`} className="underline hover:text-primary">
                    Sign up
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
