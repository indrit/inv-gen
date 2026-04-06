import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/firebase/utils';
import { Firestore } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { getClientIp } from '@/lib/ip';

export async function migrateGuestData(firestore: Firestore, user: User) {
  try {
    const ip = await getClientIp();
    console.log('Migration: Client IP is', ip);
    console.log('Migration: User UID is', user.uid);
    
    // Migrate Invoices
    const guestInvoicesQuery = query(collection(firestore, 'guestInvoices'), where('ipAddress', '==', ip));
    let guestInvoicesSnapshot;
    try {
      guestInvoicesSnapshot = await getDocs(guestInvoicesQuery);
      console.log(`Migration: Found ${guestInvoicesSnapshot.size} guest invoices`);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'guestInvoices');
      return;
    }
    
    for (const guestDoc of guestInvoicesSnapshot.docs) {
      const data = guestDoc.data();
      console.log('Migration: Migrating guest invoice', guestDoc.id);
      const { ipAddress, createdAt, ...invoiceData } = data;
      
      const invoicePath = `users/${user.uid}/invoices`;
      try {
        console.log('Migration: Adding doc to', invoicePath);
        await addDoc(collection(firestore, 'users', user.uid, 'invoices'), {
          ...invoiceData,
          userId: user.uid,
          status: 'Draft',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log('Migration: Successfully added invoice');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, invoicePath);
      }
      
      const guestInvoicePath = `guestInvoices/${guestDoc.id}`;
      try {
        console.log('Migration: Deleting guest doc', guestInvoicePath);
        await deleteDoc(doc(firestore, 'guestInvoices', guestDoc.id));
        console.log('Migration: Successfully deleted guest invoice');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, guestInvoicePath);
      }
    }
    
    // Migrate Estimates
    const guestEstimatesQuery = query(collection(firestore, 'guestEstimates'), where('ipAddress', '==', ip));
    let guestEstimatesSnapshot;
    try {
      guestEstimatesSnapshot = await getDocs(guestEstimatesQuery);
      console.log(`Migration: Found ${guestEstimatesSnapshot.size} guest estimates`);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'guestEstimates');
      return;
    }
    
    for (const guestDoc of guestEstimatesSnapshot.docs) {
      const data = guestDoc.data();
      console.log('Migration: Migrating guest estimate', guestDoc.id);
      const { ipAddress, createdAt, ...estimateData } = data;
      
      const estimatePath = `users/${user.uid}/estimates`;
      try {
        console.log('Migration: Adding doc to', estimatePath);
        await addDoc(collection(firestore, 'users', user.uid, 'estimates'), {
          ...estimateData,
          userId: user.uid,
          status: 'Draft',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log('Migration: Successfully added estimate');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, estimatePath);
      }
      
      const guestEstimatePath = `guestEstimates/${guestDoc.id}`;
      try {
        console.log('Migration: Deleting guest doc', guestEstimatePath);
        await deleteDoc(doc(firestore, 'guestEstimates', guestDoc.id));
        console.log('Migration: Successfully deleted guest estimate');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, guestEstimatePath);
      }
    }
    
    if (guestInvoicesSnapshot && guestEstimatesSnapshot && (guestInvoicesSnapshot.size > 0 || guestEstimatesSnapshot.size > 0)) {
      console.log(`Migrated ${guestInvoicesSnapshot.size} invoices and ${guestEstimatesSnapshot.size} estimates for user ${user.uid}`);
    }
  } catch (error) {
    console.error('Migration error:', error);
  }
}
