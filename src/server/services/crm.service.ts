import { db } from '../firebase-admin';

export class CRMService {
  private static collection = db.collection('crm_contacts');
  private static leadsCollection = db.collection('crm_leads');

  static async getContacts() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createContact(data: any) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  }

  static async getLeads() {
    const snapshot = await this.leadsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createLead(data: any) {
    const docRef = await this.leadsCollection.add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  }
}
