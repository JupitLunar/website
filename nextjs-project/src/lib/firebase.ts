import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let storage;

try {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase not configured, image functionality will be limited');
}

export class ImageManager {
  // Upload image to Firebase Storage
  static async uploadImage(file: File, path: string): Promise<string> {
    if (!storage) {
      throw new Error('Firebase not configured');
    }
    
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  // Get image URL from Firebase Storage
  static async getImageURL(path: string): Promise<string> {
    if (!storage) {
      throw new Error('Firebase not configured');
    }
    
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  }

  // Delete image from Firebase Storage
  static async deleteImage(path: string): Promise<void> {
    if (!storage) {
      throw new Error('Firebase not configured');
    }
    
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }

  // Generate image path for content
  static generateImagePath(hub: string, slug: string, filename: string): string {
    return `images/${hub}/${slug}/${filename}`;
  }

  // Generate image path for hub
  static generateHubImagePath(hub: string, filename: string): string {
    return `images/hubs/${hub}/${filename}`;
  }

  // Validate image file
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    
    if (file.size > maxSize) {
      return { valid: false, error: 'Image size must be less than 5MB' };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, WebP, and AVIF images are allowed' };
    }
    
    return { valid: true };
  }

  // Optimize image filename
  static optimizeFilename(originalName: string): string {
    return originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export default ImageManager;
