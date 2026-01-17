import { firebaseAuth } from '@/src/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

type UserData = {
  id: string;
  email: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
    
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadStoredData = async () => {
    try {
      const token = await AsyncStorage.getItem('@app:token');
      if (!token) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      setLoading(false);
    }
  };

  const signIn = async (accessToken: string, userData: UserData) => {
    try {
      await AsyncStorage.setItem('@app:token', accessToken);
      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseAuth.signOut();
      await AsyncStorage.removeItem('@app:token');
      await AsyncStorage.removeItem('@app:user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return { 
    user, 
    loading, 
    isAuthenticated: !!user,
    signIn,
    signOut,
  };
}
