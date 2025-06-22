import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  type User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  // Note: Extended profile data would require database setup
  // For now, we'll use basic Firebase Auth user data
}

class AuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    // Initialize Google provider with proper configuration
    this.googleProvider = new GoogleAuthProvider();

    // Configure Google provider following Firebase quickstart patterns
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Add required scopes
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');

    console.log('✅ AuthService initialized (auth-only mode)');
  }

  // Sign up with email and password
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName });

      console.log('✅ User created successfully:', user.email);
      return user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ User signed in successfully:', user.email);
      return user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with Google - Following Firebase quickstart patterns
  async signInWithGoogle(): Promise<User> {
    try {
      console.log('🔥 Attempting Google sign-in...');

      // Validate auth is available
      if (!auth) {
        throw new Error('Firebase auth not initialized');
      }

      // Validate Google provider is configured
      if (!this.googleProvider) {
        throw new Error('Google provider not configured');
      }

      console.log('🔥 Auth and provider validated, starting popup...');
      const result = await signInWithPopup(auth, this.googleProvider);

      if (!result || !result.user) {
        throw new Error('No user returned from Google sign-in');
      }

      const user = result.user;
      console.log('✅ Google sign-in successful:', user.email);

      return user;
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);

      // Provide specific guidance for common errors
      if (error.code === 'auth/invalid-argument') {
        console.error('💡 Invalid argument error - this usually means:');
        console.error('   1. Firebase project configuration is incorrect');
        console.error('   2. Google sign-in is not enabled in Firebase Console');
        console.error('   3. OAuth client ID is not configured properly');
        console.error('   4. Domain is not authorized in Firebase Console');
      }

      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update password
  async updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No authenticated user');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Get user profile from Firebase Auth (basic info only)
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const user = auth.currentUser;
      if (user && user.uid === uid) {
        return {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || undefined
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      return null;
    }
  }

  // Update user profile (Firebase Auth only)
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || user.uid !== uid) {
        throw new Error('User not authenticated or UID mismatch');
      }

      // Only update what Firebase Auth supports
      const authUpdates: any = {};
      if (updates.displayName !== undefined) {
        authUpdates.displayName = updates.displayName;
      }
      if (updates.photoURL !== undefined) {
        authUpdates.photoURL = updates.photoURL;
      }

      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(user, authUpdates);
        console.log('✅ User profile updated successfully');
      }
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Convert Firebase error codes to user-friendly messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by your browser. Please allow popups and try again.';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled. Please contact support.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials.';
      case 'auth/auth-domain-config-required':
        return 'Authentication configuration error. Please contact support.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for Google sign-in.';
      case 'auth/invalid-argument':
        return 'Invalid authentication configuration. Please check Firebase setup.';
      case 'auth/configuration-not-found':
        return 'Authentication configuration not found. Please check Firebase project setup.';
      case 'auth/invalid-api-key':
        return 'Invalid API key. Please check Firebase configuration.';
      case 'auth/app-not-authorized':
        return 'App not authorized. Please check Firebase project settings.';
      default:
        return `Authentication error: ${errorCode}. Please try again.`;
    }
  }
}

export const authService = new AuthService();
