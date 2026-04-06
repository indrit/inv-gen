import { db } from '../firebase-admin';

export class EmailService {
  private static getCollection(name: string) {
    if (!db) throw new Error('Firestore Admin not initialized');
    return db.collection(name);
  }

  static async getCampaigns() {
    try {
      const coll = this.getCollection('email_campaigns');
      const snapshot = await coll.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      console.error('EmailService.getCampaigns error:', error);
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }
  }

  static async createCampaign(data: any) {
    const coll = this.getCollection('email_campaigns');
    const docRef = await coll.add({
      ...data,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  }

  static async getSubscribers() {
    const coll = this.getCollection('email_subscribers');
    const snapshot = await coll.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createSubscriber(data: any) {
    const coll = this.getCollection('email_subscribers');
    const docRef = await coll.add({
      ...data,
      status: 'active',
      subscribedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  }
}
