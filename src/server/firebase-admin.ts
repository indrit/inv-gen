import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Simple initialization that matches the original project structure
const app: App = getApps().length > 0 
  ? getApps()[0] 
  : initializeApp({
      credential: cert(firebaseConfig as any),
      storageBucket: `${(firebaseConfig as any).project_id}.firebasestorage.app`
    });

export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const storage = getStorage(app);
