import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import firebaseConfig from '../../firebase-applet-config.json';

try {
  if (!admin.apps.length) {
    console.log('Initializing Firebase Admin with Project ID:', firebaseConfig.projectId);
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
    console.log('Firebase Admin initialized successfully.');
  }
} catch (error) {
  console.error('Firebase Admin initialization failed:', error);
}

const app = admin.apps[0]!;
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const storage = getStorage(app);
