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
  
  // Quick check to see if database is talking to us
  const dbTest = admin.firestore();
  dbTest.listCollections().then(() => {
    console.log('Firestore connection verified! We are talking to the database.');
  }).catch((err) => {
    console.error('Firestore connection FAILED. Please check your credentials:', err.message);
  });
} catch (error) {
  console.error('Firebase Admin initialization failed:', error);
}

const app = admin.apps[0]!;
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const storage = getStorage(app);
