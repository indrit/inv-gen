import { db } from '../firebase-admin';

export class CMSService {
  private static collection = db.collection('cms_content');

  static async getContentBySlug(slug: string) {
    const snapshot = await this.collection.where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async getAllContent() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async createContent(data: any) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  }
}
