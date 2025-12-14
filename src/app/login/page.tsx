
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
import { useState, FormEvent, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebase, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const formatErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email address. Redirecting to sign up...';
      case 'auth/user-disabled': return 'This account has been disabled.';
      case 'auth/user-not-found': return 'No account found with this email. Redirecting to sign up...';
      case 'auth/invalid-credential': return 'Incorrect email or password.';
      case 'auth/wrong-password': return 'Incorrect password.';
      default: return 'An error occurred. Please try again.';
    }
};

export default function LoginPage() {
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const redirectUrl = `/profile`;

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login Successful' });
      // The useEffect will handle the redirect
    } catch (error: any) {
       const errorMessage = formatErrorMessage(error.code);
       const shouldRedirect = error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email';

       toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: errorMessage,
      });

      if (shouldRedirect) {
        setTimeout(() => {
            router.push(`/signup?email=${encodeURIComponent(email)}`);
        }, 1500);
      }
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
          <Link href={`/`} className="mb-4 flex justify-center">
            <Image
              src="/logo.png"
              alt="JD News Logo"
              width={120}
              height={27}
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
            <form onSubmit={handleEmailAuth} className="space-y-4">
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
                <Button type="submit" className="w-full" disabled={isLoading || !email || !password}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href={`/signup`} className="underline hover:text-primary">
                    Sign up
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
