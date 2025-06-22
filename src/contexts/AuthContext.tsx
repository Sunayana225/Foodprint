import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { type User } from 'firebase/auth';
import { authService, type UserProfile } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoized auth functions to prevent unnecessary re-renders
  const signUp = useCallback(async (email: string, password: string, displayName: string): Promise<User> => {
    const user = await authService.signUp(email, password, displayName);
    return user;
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<User> => {
    const user = await authService.signIn(email, password);
    return user;
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<User> => {
    const user = await authService.signInWithGoogle();
    return user;
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await authService.signOut();
    setUserProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<void> => {
    await authService.resetPassword(email);
  }, []);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<void> => {
    await authService.updateUserPassword(currentPassword, newPassword);
  }, []);

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (currentUser) {
      await authService.updateUserProfile(currentUser.uid, updates);
      // Refresh user profile
      const updatedProfile = await authService.getUserProfile(currentUser.uid);
      setUserProfile(updatedProfile);
    }
  };

  // Load user profile and ensure extended profile exists
  const loadUserProfile = useCallback(async (user: User | null) => {
    if (user) {
      try {
        // Get basic profile from Firebase Auth
        const profile = await authService.getUserProfile(user.uid);
        setUserProfile(profile);

        // Also ensure extended profile exists in local storage
        const { localProfileService } = await import('../services/localProfileService');
        await localProfileService.createOrUpdateProfile(user.uid, {
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || undefined
        });

        console.log('✅ User profile loaded and extended profile updated');
      } catch (error) {
        console.error('❌ Error loading profile:', error);
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      setCurrentUser(user);
      await loadUserProfile(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextType>(() => ({
    currentUser,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile
  }), [currentUser, userProfile, loading, signUp, signIn, signInWithGoogle, signOut, resetPassword, updatePassword, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
