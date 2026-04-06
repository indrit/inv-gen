'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, Mail } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
    <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,11.63 21.95,11.27 21.88,11.1H21.35Z"/>
  </svg>
);

const emailFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;

interface GuestLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoogleLogin: () => Promise<void>;
  onEmailSignIn: (data: EmailFormValues) => Promise<void>;
  onEmailSignUp: (data: EmailFormValues) => Promise<void>;
  description?: string;
}

export function GuestLimitDialog({
  open,
  onOpenChange,
  onGoogleLogin,
  onEmailSignIn,
  onEmailSignUp,
  description = "You've used all your free anonymous downloads. To unlock more features like saving your logo and document history, please log in."
}: GuestLimitDialogProps) {
  const [loginView, setLoginView] = useState<'social' | 'email'>('social');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setLoginView('social');
        setIsSignUp(false);
      }, 200);
    }
  };

  const handleSignSubmit = (data: EmailFormValues) => {
    if (isSignUp) {
        if (!data.name) {
            emailForm.setError('name', { message: 'Name is required for signup' });
            return;
        }
        onEmailSignUp(data);
    } else {
        onEmailSignIn(data);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-[420px]">
        {loginView === 'social' ? (
          <>
            <AlertDialogHeader className="space-y-3">
              <AlertDialogTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                <div className="bg-primary/10 p-2.5 rounded-xl">
                  <LogIn className="h-6 w-6 text-primary" />
                </div>
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 leading-relaxed">
                {description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-3.5 py-6">
              <Button onClick={onGoogleLogin} variant="outline" className="h-12 text-base font-semibold border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2">
                <GoogleIcon /> Continue with Google
              </Button>
              <Button onClick={() => setLoginView('email')} variant="outline" className="h-12 text-base font-semibold border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" /> Continue with Email
              </Button>
            </div>
            <AlertDialogFooter className="sm:justify-center border-t pt-4">
              <AlertDialogCancel className="border-none text-gray-500 hover:text-gray-900 font-medium">Maybe later</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <AlertDialogTitle className="text-2xl font-bold tracking-tight">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </AlertDialogTitle>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-primary hover:text-primary/80 font-bold"
                >
                    {isSignUp ? 'Log In Instead' : 'Create Account'}
                </Button>
              </div>
              <AlertDialogDescription className="text-gray-600">
                {isSignUp ? 'Join thousands of professional business owners today.' : 'Welcome back! Please enter your details.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...emailForm}>
              <form className="space-y-4 py-2" onSubmit={emailForm.handleSubmit(handleSignSubmit)}>
                {isSignUp && (
                  <FormField
                    control={emailForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-semibold">Full Name</FormLabel>
                        <Input placeholder="Indrit Zaganjori" className="h-11 border-gray-200" {...field} />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">Email Address</FormLabel>
                      <Input placeholder="you@example.com" className="h-11 border-gray-200" {...field} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={emailForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-semibold">Password</FormLabel>
                      <Input type="password" placeholder="••••••••" className="h-11 border-gray-200" {...field} />
                    </FormItem>
                  )}
                />
                <div className="pt-4 flex flex-col gap-3">
                    <Button 
                        type="submit" 
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20"
                    >
                        {isSignUp ? 'Create Account' : 'Sign In'}
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="w-full h-10 text-gray-500 font-medium" 
                        onClick={() => { setLoginView('social'); setIsSignUp(false); }}
                    >
                        Go Back
                    </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
