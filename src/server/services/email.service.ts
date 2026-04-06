import { db } from '../firebase-admin';

export class EmailService {
  private static campaignsCollection = db.collection('email_campaigns');
  private static subscribersCollection = db.collection('email_subscribers');

  static async getCampaigns() {
    const snapshot = await this.campaignsCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createCampaign(data: any) {
    const docRef = await this.campaignsCollection.add({
      ...data,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  }

  static async getSubscribers() {
    const snapshot = await this.subscribersCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createSubscriber(data: any) {
    const docRef = await this.subscribersCollection.add({
      ...data,
      status: 'active',
      subscribedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  }
}
