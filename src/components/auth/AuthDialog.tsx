'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const GoogleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2"> <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,11.63 21.95,11.27 21.88,11.1H21.35Z"/> </svg> );

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function AuthDialog() {
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSocialLogin = async (provider: 'google') => {
    const authProvider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, authProvider);
      setOpen(false);
      toast({ title: 'Signed In Successfully!' });
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error(`Error during ${provider} sign-in:`, error);
        toast({
          title: 'Sign-in Failed',
          description: error.message || `Could not sign in with ${provider}.`,
          variant: 'destructive',
        });
      }
    }
  };

  const handleEmailSignIn = async (data: FormValues) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setOpen(false);
      toast({ title: 'Signed In Successfully!' });
    } catch (error: any) {
      console.error('Error during email sign-in:', error);
      toast({ title: 'Sign-in Failed', description: error.message || 'Could not sign in.', variant: 'destructive' });
    }
  };

  const handleEmailSignUp = async (data: FormValues) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      setOpen(false);
      toast({ title: 'Account Created Successfully!', description: 'Welcome! You are now signed in.' });
    } catch (error: any) {
      console.error('Error during email sign-up:', error);
      toast({ title: 'Sign-up Failed', description: error.message || 'Could not create account.', variant: 'destructive' });
    }
  };

  const renderEmailForm = (isSignUp: boolean) => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(isSignUp ? handleEmailSignUp : handleEmailSignIn)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </Button>
      </form>
    </Form>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
            <LogIn className="mr-2 h-4 w-4" /> Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Welcome</DialogTitle>
          <DialogDescription className="text-center">
            Sign in or create an account to save your work.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" onClick={() => handleSocialLogin('google')}><GoogleIcon /> Google</Button>
            </div>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <Tabs defaultValue="signin" className="w-full" onValueChange={() => form.reset()}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="pt-4">
                {renderEmailForm(false)}
              </TabsContent>
              <TabsContent value="signup" className="pt-4">
                {renderEmailForm(true)}
              </TabsContent>
            </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
