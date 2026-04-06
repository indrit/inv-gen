import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import firebaseConfig from '../../firebase-applet-config.json';

try {
  if (!admin.apps.length) {
    if (firebaseConfig && firebaseConfig.projectId) {
      console.log('Initializing Firebase Admin with Project ID:', firebaseConfig.projectId);
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
      console.log('Firebase Admin initialized successfully.');
    } else {
      console.warn('Firebase Admin configuration missing. Some admin features will be unavailable.');
    }
  }
} catch (error: any) {
  console.error('Firebase Admin initialization failed:', error.message);
}

// Safer access to apps
const getAdminApp = () => {
    if (admin.apps.length > 0) return admin.apps[0];
    return null;
}

const app = getAdminApp();

export const db = app ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)') : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;

/**
 * Helper to check if Firebase Admin is properly initialized.
 * Used to avoid 500 errors on server-side rendering.
 */
export const isFirebaseAdminReady = () => {
    return !!app && !!db;
}
