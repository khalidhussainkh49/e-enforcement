import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { LocationHistory } from '../types/user';

export const saveLocation = async (userId: string, location: { lat: number; lng: number }) => {
  await addDoc(collection(db, 'locations'), {
    userId,
    location,
    timestamp: Timestamp.now()
  });
};

export const getLocationHistory = async (
  userId: string, 
  limit: number = 100
): Promise<LocationHistory[]> => {
  const q = query(
    collection(db, 'locations'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limit)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    timestamp: doc.data().timestamp.toDate(),
    location: doc.data().location
  }));
};