import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  signOutUser: () => Promise<void>;
  authError: string | null;
  isUnauthorizedDomain?: boolean;
  currentDomain?: string;
  clearError: () => void;
}

const GUEST_STORAGE_KEY = 'moneydb_guest_active';

const GUEST_USER: UserProfile = {
  uid: 'guest_offline_user',
  displayName: 'ผู้ใช้งานทั่วไป (โหมดทดลอง/ออฟไลน์)',
  email: 'guest@moneydb.local',
  photoURL: null,
  isAnonymous: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState<boolean>(false);
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';

  useEffect(() => {
    // Check if previously entered as guest
    const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
    if (savedGuest === 'true') {
      setUser(GUEST_USER);
      setIsGuest(true);
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
        setIsGuest(false);
        localStorage.removeItem(GUEST_STORAGE_KEY);
        setLoading(false);

        // Sync user profile to Firestore `/users/{uid}`
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await setDoc(
            userDocRef,
            {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'ผู้ใช้งาน',
              photoURL: currentUser.photoURL || '',
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Failed to sync user profile:', err);
        }
      } else {
        if (localStorage.getItem(GUEST_STORAGE_KEY) !== 'true') {
          setUser(null);
          setIsGuest(false);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const continueAsGuest = () => {
    localStorage.setItem(GUEST_STORAGE_KEY, 'true');
    setUser(GUEST_USER);
    setIsGuest(true);
    setAuthError(null);
    setIsUnauthorizedDomain(false);
  };

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      setIsUnauthorizedDomain(false);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      if (error?.code === 'auth/unauthorized-domain') {
        setIsUnauthorizedDomain(true);
        setAuthError(
          `โดเมน ${window.location.hostname} ยังไม่ได้รับอนุญาตใน Firebase Authentication (auth/unauthorized-domain)`
        );
      } else if (error?.code === 'auth/popup-closed-by-user') {
        setAuthError('หน้าต่างเข้าสู่ระบบถูกปิดก่อนทำรายการสำเร็จ');
      } else if (error?.code === 'auth/cancelled-popup-request') {
        // Handled silently
      } else {
        setAuthError(error?.message || 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่อีกครั้ง');
      }
    }
  };

  const signOutUser = async () => {
    try {
      setAuthError(null);
      setIsUnauthorizedDomain(false);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      setIsGuest(false);
      setUser(null);
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign Out Error:', error);
      setAuthError('เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };

  const clearError = () => {
    setAuthError(null);
    setIsUnauthorizedDomain(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        continueAsGuest,
        signInWithGoogle,
        signOutUser,
        authError,
        isUnauthorizedDomain,
        currentDomain,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
