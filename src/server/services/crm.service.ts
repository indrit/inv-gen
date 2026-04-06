import { db } from '../firebase-admin';

export class CRMService {
  private static getCollection(name: string) {
    if (!db) throw new Error('Firestore Admin not initialized');
    return db.collection(name);
  }

  static async getContacts() {
    const coll = this.getCollection('crm_contacts');
    const snapshot = await coll.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createContact(data: any) {
    const coll = this.getCollection('crm_contacts');
    const docRef = await coll.add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  }

  static async getLeads() {
    const coll = this.getCollection('crm_leads');
    const snapshot = await coll.get();
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  }

  static async createLead(data: any) {
    const coll = this.getCollection('crm_leads');
    const docRef = await coll.add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  }
}
