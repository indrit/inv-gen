'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '@/firebase/utils';
import { getClientIp } from '@/lib/ip';
import { type Client } from '@/lib/clients';
import * as gtag from '@/lib/gtag';
import { type Estimate } from '@/lib/estimates';
import { estimateSchema, type EstimateFormValues } from '@/lib/schemas/estimate';
import { type EmailFormValues } from '@/lib/schemas/shared';
import { useUserProfile } from '@/firebase/firestore/use-user-profile';
import { createCheckoutSession } from '@/lib/stripe';

export function useEstimateEditor(clientId: string | null) {
  const { profile } = useUserProfile();
  const isPremium = profile?.isPremium === true;
  const [prompt, setPrompt] = useState<'login' | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const clientsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'clients');
  }, [user, firestore]);
  const { data: clients } = useCollection<Client>(clientsQuery);

  const formatClientAsString = (client: Client) => {
     const parts = [
      client.name,
      client.billingAddressLine1,
      client.billingAddressLine2,
      [client.billingCity, client.billingStateProvince, client.billingPostalCode].filter(Boolean).join(', '),
      client.billingCountry
    ];
    return parts.filter(Boolean).join('\n');
  }

  const form = useForm<EstimateFormValues>({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      documentTitle: 'ESTIMATE',
      from: 'Your Company Name\n123 Business Rd\nCity, State 12345',
      to: 'Recipient Name\nCompany Address\nCity, State, Zip',
      shipTo: '',
      estimateNumber: '',
      taxLabel: 'Tax',
      date: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      lineItems: [{ description: '', quantity: 1, rate: 0 }],
      taxRate: 8,
      discount: 0,
      shipping: 0,
      amountPaid: 0,
      notes: 'This estimate is valid for 30 days.',
      terms: '',
      currency: 'USD',
      status: 'Draft',
      logo: '',
      images: [],
    },
  });

  useEffect(() => {
    if (clientId && user && firestore) {
      const fetchClient = async () => {
        const clientRef = doc(firestore, 'users', user.uid, 'clients', clientId);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
          const clientData = clientSnap.data() as Client;
          form.setValue('to', formatClientAsString(clientData));
          form.setValue('clientId', clientId);
        }
      }
      fetchClient();
    }
  }, [clientId, user, firestore, form]);

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lineItems' });

  const watchedLineItems = form.watch('lineItems');
  const watchedTaxRate = form.watch('taxRate');
  const watchedDiscount = form.watch('discount');
  const watchedShipping = form.watch('shipping');
  const watchedAmountPaid = form.watch('amountPaid');
  const watchedCurrency = form.watch('currency') || 'USD';

  const subtotal = watchedLineItems.reduce( (acc, item) => acc + (item.quantity || 0) * (item.rate || 0), 0 );
  const tax = subtotal * ((watchedTaxRate || 0) / 100);
  const total = subtotal + tax - (watchedDiscount || 0) + (watchedShipping || 0);
  const balanceDue = total - (watchedAmountPaid || 0);

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'CAD', symbol: 'CA$' },
    { code: 'AUD', symbol: 'A$' },
    { code: 'JPY', symbol: '¥' },
    { code: 'CNY', symbol: '¥' },
    { code: 'INR', symbol: '₹' },
  ];
  
  const currentCurrency = currencies.find(c => c.code === watchedCurrency) || currencies[0];

  const generatePDF = async () => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById('estimate-pdf-content-hidden');
    if (!element) {
      toast({ title: "Error", description: "Could not find estimate content to generate PDF.", variant: "destructive" });
      return;
    }
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0,
        filename: `estimate-${form.getValues().estimateNumber || 'draft'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast({ title: "Error", description: "Failed to generate PDF. Please try again.", variant: "destructive" });
    }
  };

  const handleSaveGuest = async () => {
    if (user || !firestore) return;
    const values = form.getValues();
    const ip = await getClientIp();
    const guestEstimateData = {
      ipAddress: ip,
      ...values,
      issueDate: values.date ? values.date.toISOString() : new Date().toISOString(),
      expiryDate: values.expiryDate ? values.expiryDate.toISOString() : new Date().toISOString(),
      totalAmount: total,
      subtotal: subtotal,
      taxAmount: tax,
      senderCompanyName: values.from.split('\n')[0],
      senderAddressLine1: values.from.split('\n')[1] || '',
      senderCity: values.from.split('\n')[2]?.split(',')[0] || '',
      createdAt: serverTimestamp(),
    };
    try {
      const guestEstimatesCollection = collection(firestore, 'guestEstimates');
      await addDoc(guestEstimatesCollection, guestEstimateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'guestEstimates');
    }
  };

  const handleDownload = () => {
    form.trigger().then(isValid => {
      if (!isValid) {
        toast({ title: "Incomplete Form", description: "Please fill out all required fields before downloading.", variant: "destructive" });
        return;
      }
      if (!user) {
        const anonDownloads = parseInt(localStorage.getItem('anonDownloads') || '0', 10);
        if (anonDownloads >= 3) { setPrompt('login'); return; }
        localStorage.setItem('anonDownloads', (anonDownloads + 1).toString());
        handleSaveGuest();
      }
      gtag.event({ action: 'download_estimate', category: 'engagement', label: user ? 'Registered' : 'Guest' });
      gtag.conversion('AW-17986047423/estimate_download');
      toast({ title: 'Download Started', description: 'Your PDF is being generated.' });
      generatePDF();
    });
  };

  const handleSave = async () => {
    if (!user || !firestore) {
      toast({ title: "Login Required", description: "You must be logged in to save an estimate.", variant: "destructive" });
      return;
    }
    const isValid = await form.trigger();
    if (!isValid) {
      toast({ title: "Incomplete Form", description: "Please fill out all required fields before saving.", variant: "destructive" });
      return;
    }
    const values = form.getValues();
    const { date, expiryDate, ...otherValues } = values;
    const estimateData: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.uid,
      ...otherValues,
      status: values.status as any,
      issueDate: date.toISOString(),
      expiryDate: expiryDate.toISOString(),
      totalAmount: total,
      subtotal: subtotal,
      taxAmount: tax,
      senderCompanyName: values.from.split('\n')[0],
      senderAddressLine1: values.from.split('\n')[1] || '',
      senderCity: values.from.split('\n')[2]?.split(',')[0] || '',
    };
    try {
      const estimatesCollection = collection(firestore, 'users', user.uid, 'estimates');
      await addDoc(estimatesCollection, {
        ...estimateData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      gtag.event({ action: 'save_estimate', category: 'engagement', label: 'Registered' });
      toast({ title: "Estimate Saved", description: "Your estimate has been saved to your dashboard." });
    } catch (error) {
      console.error("Error saving estimate: ", error);
      toast({ title: "Save Failed", description: "Could not save your estimate.", variant: "destructive" });
    }
  };

  const handleSubscribe = async () => {
    if (!user || !user.email) {
      setPrompt('login');
      return;
    }
    try {
      await createCheckoutSession(user.uid, user.email);
    } catch (error) {
      console.error('Upgrade failed:', error);
      toast({ title: "Upgrade Failed", description: "Could not initiate checkout. Please try again.", variant: "destructive" });
    }
  }

  const handleLogoClick = () => { if (!user) { setPrompt('login'); } else { logoInputRef.current?.click(); } };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Logo must be less than 5MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogo(base64);
        form.setValue('logo' as any, base64); // Logic for logo storage varies slightly between editors in original code
        toast({ title: 'Logo Selected', description: 'Your logo will appear on the estimate.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Image must be less than 5MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const currentImages = form.getValues('images') || [];
        form.setValue('images', [...currentImages, base64]);
        toast({ title: 'Image Added', description: 'The image has been added to your estimate.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      gtag.event({ action: 'login_google', category: 'auth', label: 'Success' });
      setPrompt(null);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error("Error during Google sign-in:", error);
        toast({ title: "Sign-in Failed", description: error.message || "Could not sign in with Google.", variant: "destructive" });
      }
    }
  };

  const handleEmailSignIn = async (data: EmailFormValues) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      gtag.event({ action: 'login_email', category: 'auth', label: 'Success' });
      setPrompt(null);
      toast({ title: "Signed In Successfully!" });
    } catch (error: any) {
      console.error("Error during email sign-in:", error);
      toast({ title: "Sign-in Failed", description: error.message || "Could not sign in.", variant: "destructive" });
    }
  };

  const handleEmailSignUp = async (data: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (data.name) {
        await updateProfile(userCredential.user, { displayName: data.name });
      }
      setPrompt(null);
      gtag.event({ action: 'sign_up_email', category: 'auth', label: 'Success' });
      gtag.conversion('AW-17986047423/sign_up');
      toast({ title: "Account Created Successfully!" });
    } catch (error: any) {
      console.error("Error during email sign-up:", error);
      toast({ title: "Sign-up Failed", description: error.message || "Could not create account.", variant: "destructive" });
    }
  };

  return {
    form,
    fields,
    append,
    remove,
    watchedLineItems,
    logo,
    prompt,
    setPrompt,
    isPreviewOpen,
    setIsPreviewOpen,
    showDiscount,
    setShowDiscount,
    showShipping,
    setShowShipping,
    logoInputRef,
    isMounted,
    subtotal,
    tax,
    total,
    balanceDue,
    currencies,
    currentCurrency,
    handleDownload,
    handleSave,
    handleSubscribe,
    handleLogoClick,
    handleLogoChange,
    handleImageUpload,
    removeImage,
    handleGoogleLogin,
    handleEmailSignIn,
    handleEmailSignUp,
    user,
    isPremium,
    clients,
    formatClientAsString,
  };
}
