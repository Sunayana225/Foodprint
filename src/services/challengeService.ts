import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db, isFirestoreAvailable, getFirestoreError } from '../config/firebase';

// Simple offline data for when Firebase is unavailable
const OFFLINE_CHALLENGES: Challenge[] = [
  {
    id: 'offline-1',
    title: 'Reduce Meat Consumption',
    description: 'Try to have at least 3 plant-based meals this week',
    type: 'weekly',
    category: 'carbon',
    difficulty: 'Easy',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    targetValue: 3,
    targetUnit: 'meals',
    points: 50,
    participants: [],
    createdBy: 'system',
    createdAt: new Date(),
    isActive: true,
    rules: ['Log 3 plant-based meals', 'Track carbon footprint reduction'],
    instructions: ['Choose plant-based proteins', 'Log each meal in the app'],
    tips: ['Try legumes and grains', 'Explore vegetarian recipes'],
    rewards: { points: 50, badge: 'Plant Pioneer' }
  },
  {
    id: 'offline-2',
    title: 'Local Food Challenge',
    description: 'Source 50% of your meals from local producers',
    type: 'weekly',
    category: 'carbon',
    difficulty: 'Medium',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    targetValue: 7,
    targetUnit: 'days',
    points: 75,
    participants: [],
    createdBy: 'system',
    createdAt: new Date(),
    isActive: true,
    rules: ['Find local farmers market', 'Log local food sources'],
    instructions: ['Research local farms', 'Visit farmers market', 'Track local purchases'],
    tips: ['Check community gardens', 'Visit local farms'],
    rewards: { points: 75, badge: 'Local Hero' }
  },
  {
    id: 'offline-3',
    title: 'Zero Food Waste',
    description: 'Complete a week without throwing away any food',
    type: 'weekly',
    category: 'general',
    difficulty: 'Hard',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    targetValue: 7,
    targetUnit: 'days',
    points: 100,
    participants: [],
    createdBy: 'system',
    createdAt: new Date(),
    isActive: true,
    rules: ['Plan meals carefully', 'Use all leftovers', 'Compost scraps'],
    instructions: ['Plan weekly meals', 'Store food properly', 'Use leftovers creatively'],
    tips: ['Meal prep on weekends', 'Store food properly', 'Get creative with leftovers'],
    rewards: { points: 100, badge: 'Zero Waste Champion' }
  }
];

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'daily' | 'custom';
  category: 'carbon' | 'water' | 'meals' | 'streak' | 'general';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  startDate: Date;
  endDate: Date;
  targetValue: number;
  targetUnit: string;
  points: number;
  participants: string[]; // user IDs
  createdBy: string; // user ID
  createdAt: Date;
  isActive: boolean;
  rules: string[];
  instructions?: string[]; // Step-by-step instructions for completing the challenge
  tips?: string[]; // Helpful tips for success
  rewards: {
    points: number;
    badge?: string;
    title?: string;
  };
}

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  userId: string;
  joinedAt: Date;
  progress: number;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: Date;
  rank?: number;
  dailyProgress?: { [date: string]: boolean }; // Track daily completion
  currentStreak?: number;
  longestStreak?: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  totalPoints: number;
  completedChallenges: number;
  currentStreak: number;
  level: number;
  badges: string[];
  rank: number;
}

class ChallengeService {
  // Create a new challenge
  async createChallenge(challenge: Omit<Challenge, 'id' | 'createdAt' | 'participants'>): Promise<string> {
    try {
      console.log('🔥 Starting challenge creation process in ONLINE mode...');
      console.log('📋 Challenge data received:', challenge);

      // Check if Firebase is available with better error reporting
      if (!isFirestoreAvailable()) {
        console.error('❌ Firebase/Firestore not available for challenge creation');
        console.log('🔍 Debug info:', {
          dbExists: !!db,
          dbType: typeof db,
          isAvailable: isFirestoreAvailable()
        });
        throw new Error('Firebase database not available. Please check your internet connection and try again.');
      }

      console.log('✅ Firebase database is available, proceeding with creation...');

      // Firebase network should be available by default
      console.log('🌐 Firebase network ready for challenge creation...');

      const challengeRef = doc(collection(db, 'challenges'));
      console.log('📝 Generated challenge ID:', challengeRef.id);

      const challengeData: Challenge = {
        ...challenge,
        id: challengeRef.id,
        participants: [],
        createdAt: new Date(),
      };

      console.log('💾 Preparing to save challenge data to Firestore...');
      console.log('🔍 Challenge data to save:', {
        ...challengeData,
        startDate: challengeData.startDate.toISOString(),
        endDate: challengeData.endDate.toISOString(),
      });

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Challenge creation timed out after 30 seconds')), 30000);
      });

      // Prepare the document data
      const docData = {
        ...challengeData,
        startDate: Timestamp.fromDate(challengeData.startDate),
        endDate: Timestamp.fromDate(challengeData.endDate),
        createdAt: serverTimestamp(),
      };

      console.log('📤 Sending data to Firestore...');

      // Race between the actual operation and timeout
      await Promise.race([
        setDoc(challengeRef, docData),
        timeoutPromise
      ]);

      console.log('✅ Challenge created successfully with ID:', challengeRef.id);

      // Clear cache since we added a new challenge
      this.clearCache();

      return challengeRef.id;

    } catch (error) {
      console.error('❌ Detailed error in createChallenge:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
        code: (error as any)?.code,
        details: (error as any)?.details,
      });

      // Re-throw with more specific error message
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          throw new Error('Permission denied. Please check your authentication and Firestore rules.');
        } else if (error.message.includes('unavailable')) {
          throw new Error('Firebase service is temporarily unavailable. Please try again.');
        } else if (error.message.includes('timeout')) {
          throw new Error('Request timed out. Please check your internet connection.');
        } else {
          throw new Error(`Challenge creation failed: ${error.message}`);
        }
      } else {
        throw new Error('An unexpected error occurred during challenge creation');
      }
    }
  }

  // Cache for challenges to reduce Firebase queries
  private challengesCache: { data: Challenge[], timestamp: number } | null = null;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // Get a specific challenge by ID
  async getChallengeById(challengeId: string): Promise<Challenge | null> {
    try {
      if (isFirestoreAvailable()) {
        const challengeRef = doc(db, 'challenges', challengeId);
        const challengeSnap = await getDoc(challengeRef);

        if (challengeSnap.exists()) {
          const data = challengeSnap.data();
          return {
            id: challengeSnap.id,
            ...data,
            // Convert Firebase Timestamps to Date objects
            startDate: data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate),
            endDate: data.endDate?.toDate ? data.endDate.toDate() : new Date(data.endDate),
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          } as Challenge;
        }
      }

      // Fallback to offline challenges
      return OFFLINE_CHALLENGES.find(c => c.id === challengeId) || null;
    } catch (error) {
      console.error('Error getting challenge by ID:', error);
      return null;
    }
  }

  // Get all active challenges with simplified approach
  async getActiveChallenges(): Promise<Challenge[]> {
    console.log('🌐 Loading active challenges...');

    // Check cache first (5 minute cache for better performance)
    if (this.challengesCache &&
        Date.now() - this.challengesCache.timestamp < this.cacheTimeout) {
      console.log('📋 Using cached challenges:', this.challengesCache.data.length);
      return this.challengesCache.data;
    }

    // Try Firebase first if available
    if (isFirestoreAvailable()) {
      try {
        console.log('🔥 Attempting Firebase connection...');

        const challengesRef = collection(db, 'challenges');
        const q = query(
          challengesRef,
          where('isActive', '==', true),
          orderBy('createdAt', 'desc'),
          limit(50)
        );

        console.log('📡 Fetching challenges from Firebase...');

        // Set a reasonable timeout for the query
        const queryPromise = getDocs(q);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Query timeout')), 15000)
        );

        const snapshot = await Promise.race([queryPromise, timeoutPromise]);

        const challenges = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firebase Timestamps to Date objects
            startDate: data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate),
            endDate: data.endDate?.toDate ? data.endDate.toDate() : new Date(data.endDate),
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          } as Challenge;
        });

        console.log('✅ Successfully loaded challenges from Firebase:', challenges.length);

        // Cache the Firebase data
        this.challengesCache = {
          data: challenges,
          timestamp: Date.now()
        };

        return challenges;

      } catch (error) {
        console.warn('⚠️ Firebase connection failed, using offline data:', error);
      }
    } else {
      console.log('🔄 Firestore not available');
      console.log('💡 Running in offline-only mode');
    }

    // FALLBACK: Use offline data
    console.log('📱 Loading offline challenges...');

    // Cache the offline data
    this.challengesCache = {
      data: OFFLINE_CHALLENGES,
      timestamp: Date.now()
    };

    console.log('📊 Loaded offline challenges:', OFFLINE_CHALLENGES.length);
    return OFFLINE_CHALLENGES;
  }

  // Clear cache when challenges are modified
  private clearCache() {
    this.challengesCache = null;
  }

  // Join a challenge with simplified approach
  async joinChallenge(challengeId: string, userId: string): Promise<void> {
    console.log('🎯 Starting challenge join process for:', challengeId);

    // Check if Firestore is available
    if (!isFirestoreAvailable()) {
      console.warn('🔄 Firestore not available, storing join locally');
      this.joinChallengeOffline(challengeId, userId);
      return;
    }

    try {
      // Add user to challenge participants
      const challengeRef = doc(db, 'challenges', challengeId);
      console.log('📝 Adding user to challenge participants...');
      await updateDoc(challengeRef, {
        participants: arrayUnion(userId)
      });

      // Create participation record
      const participationRef = doc(collection(db, 'challengeParticipations'));
      const participation: ChallengeParticipation = {
        id: participationRef.id,
        challengeId,
        userId,
        joinedAt: new Date(),
        progress: 0,
        currentValue: 0,
        isCompleted: false,
        currentStreak: 0,
        longestStreak: 0,
        dailyProgress: {}
      };

      console.log('📝 Creating participation record...');
      await setDoc(participationRef, {
        ...participation,
        joinedAt: serverTimestamp(),
      });

      console.log('✅ Successfully joined challenge');
    } catch (error) {
      console.warn('🔄 Firebase unavailable, storing join locally:', error);
      this.joinChallengeOffline(challengeId, userId);
    }
  }

  // Simple offline join functionality
  private joinChallengeOffline(challengeId: string, userId: string): void {
    try {
      const offlineJoins = JSON.parse(localStorage.getItem('offline_challenge_joins') || '[]');
      const existingJoin = offlineJoins.find((j: any) => j.challengeId === challengeId && j.userId === userId);

      if (!existingJoin) {
        offlineJoins.push({
          challengeId,
          userId,
          joinedAt: new Date().toISOString(),
          progress: 0,
          currentValue: 0,
          isCompleted: false
        });
        localStorage.setItem('offline_challenge_joins', JSON.stringify(offlineJoins));
        console.log('✅ Challenge join stored offline');
      }
    } catch (error) {
      console.error('❌ Error storing offline join:', error);
    }
  }

  // Leave a challenge with simplified approach
  async leaveChallenge(challengeId: string, userId: string): Promise<void> {
    console.log('🎯 Starting challenge leave process for:', challengeId);

    // Check if Firestore is available
    if (!isFirestoreAvailable()) {
      console.warn('🔄 Firestore not available, removing join locally');
      this.leaveChallengeOffline(challengeId, userId);
      return;
    }

    try {
      // Remove user from challenge participants
      const challengeRef = doc(db, 'challenges', challengeId);
      console.log('📝 Removing user from challenge participants...');
      await updateDoc(challengeRef, {
        participants: arrayRemove(userId)
      });

      // Remove participation record
      const participationsRef = collection(db, 'challengeParticipations');
      const q = query(
        participationsRef,
        where('challengeId', '==', challengeId),
        where('userId', '==', userId)
      );

      console.log('📝 Removing participation record...');
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      console.log('✅ Successfully left challenge');
    } catch (error) {
      console.warn('🔄 Firebase unavailable, removing join locally:', error);
      this.leaveChallengeOffline(challengeId, userId);
    }
  }

  // Simple offline leave functionality
  private leaveChallengeOffline(challengeId: string, userId: string): void {
    try {
      const offlineJoins = JSON.parse(localStorage.getItem('offline_challenge_joins') || '[]');
      const filteredJoins = offlineJoins.filter((j: any) => !(j.challengeId === challengeId && j.userId === userId));
      localStorage.setItem('offline_challenge_joins', JSON.stringify(filteredJoins));
      console.log('✅ Challenge leave stored offline');
    } catch (error) {
      console.error('❌ Error storing offline leave:', error);
    }
  }

  // Update challenge progress
  async updateProgress(challengeId: string, userId: string, newValue: number): Promise<void> {
    try {
      const participationsRef = collection(db, 'challengeParticipations');
      const q = query(
        participationsRef,
        where('challengeId', '==', challengeId),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const participationDoc = snapshot.docs[0];
        const challenge = await this.getChallengeById(challengeId);

        if (challenge) {
          const progress = Math.min((newValue / challenge.targetValue) * 100, 100);
          const isCompleted = progress >= 100;

          await updateDoc(participationDoc.ref, {
            currentValue: newValue,
            progress,
            isCompleted,
            ...(isCompleted && { completedAt: serverTimestamp() })
          });
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      throw new Error('Failed to update progress');
    }
  }

  // Update daily progress for a challenge with simplified approach
  async updateDailyProgress(challengeId: string, userId: string, date: string, completed: boolean): Promise<void> {
    console.log('🎯 Updating daily progress for:', challengeId, date, completed);

    // Check if Firestore is available
    if (!isFirestoreAvailable()) {
      console.warn('🔄 Firestore not available, updating daily progress offline');
      this.updateDailyProgressOffline(challengeId, userId, date, completed);
      return;
    }

    try {
      const participationsRef = collection(db, 'challengeParticipations');
      const q = query(
        participationsRef,
        where('challengeId', '==', challengeId),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const participationDoc = snapshot.docs[0];
        const participationData = participationDoc.data();

        // Update daily progress
        const dailyProgress = participationData.dailyProgress || {};
        dailyProgress[date] = completed;

        // Calculate streaks
        const { currentStreak, longestStreak } = this.calculateStreaks(dailyProgress);

        // Count completed days
        const completedDays = Object.values(dailyProgress).filter(Boolean).length;

        // Get challenge to calculate progress percentage
        const challenge = await this.getChallengeById(challengeId);
        if (challenge) {
          const progress = Math.min((completedDays / challenge.targetValue) * 100, 100);
          const isCompleted = progress >= 100;

          await updateDoc(participationDoc.ref, {
            dailyProgress,
            currentStreak,
            longestStreak,
            currentValue: completedDays,
            progress,
            isCompleted,
            ...(isCompleted && { completedAt: serverTimestamp() })
          });

          console.log('✅ Successfully updated daily progress');
        }
      } else {
        console.warn('⚠️ No participation record found');
      }
    } catch (error) {
      console.warn('🔄 Firebase unavailable, updating daily progress offline:', error);
      this.updateDailyProgressOffline(challengeId, userId, date, completed);
    }
  }

  // Update daily progress in offline mode
  private updateDailyProgressOffline(challengeId: string, userId: string, date: string, completed: boolean): void {
    try {
      const offlineJoins = JSON.parse(localStorage.getItem('offline_challenge_joins') || '[]');
      const participation = offlineJoins.find(
        (p: any) => p.challengeId === challengeId && p.userId === userId
      );

      if (participation) {
        // Update daily progress
        participation.dailyProgress = participation.dailyProgress || {};
        participation.dailyProgress[date] = completed;

        // Calculate streaks
        const { currentStreak, longestStreak } = this.calculateStreaks(participation.dailyProgress);

        // Count completed days
        const completedDays = Object.values(participation.dailyProgress).filter(Boolean).length;

        // Get challenge to calculate progress percentage
        const challenge = OFFLINE_CHALLENGES.find((c: any) => c.id === challengeId);
        if (challenge) {
          const progress = Math.min((completedDays / challenge.targetValue) * 100, 100);
          const isCompleted = progress >= 100;

          // Update participation
          participation.currentStreak = currentStreak;
          participation.longestStreak = longestStreak;
          participation.currentValue = completedDays;
          participation.progress = progress;
          participation.isCompleted = isCompleted;

          // Save offline data
          localStorage.setItem('offline_challenge_joins', JSON.stringify(offlineJoins));
          console.log('✅ Successfully updated daily progress offline');
        }
      } else {
        console.warn('⚠️ No offline participation record found');
      }
    } catch (error) {
      console.error('❌ Error updating daily progress offline:', error);
    }
  }

  // Calculate streaks from daily progress
  private calculateStreaks(dailyProgress: { [date: string]: boolean }): { currentStreak: number; longestStreak: number } {
    const dates = Object.keys(dailyProgress).sort();
    let currentStreak = 0;
    let longestStreak = 0;

    console.log('🔥 Service calculating streaks from:', dailyProgress);
    console.log('📅 Service sorted dates:', dates);

    if (dates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Calculate longest streak by going through all dates
    let tempStreak = 0;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      if (dailyProgress[date]) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate current streak by going backwards from today
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];

    // Start from today and go backwards to find consecutive completed days
    let checkDate = new Date(today);
    currentStreak = 0;

    // Check if today is completed first
    if (dailyProgress[todayKey]) {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);

      // Continue backwards for consecutive days
      while (checkDate >= new Date(dates[0])) {
        const dateKey = checkDate.toISOString().split('T')[0];
        if (dailyProgress[dateKey]) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      // If today is not completed, check if yesterday was the end of a streak
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayKey = checkDate.toISOString().split('T')[0];

      if (dailyProgress[yesterdayKey]) {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);

        // Continue backwards for consecutive days
        while (checkDate >= new Date(dates[0])) {
          const dateKey = checkDate.toISOString().split('T')[0];
          if (dailyProgress[dateKey]) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    console.log('📈 Service calculated streaks:', {
      currentStreak,
      longestStreak,
      todayKey,
      todayCompleted: dailyProgress[todayKey]
    });

    return { currentStreak, longestStreak };
  }



  // Get user's participation in a specific challenge
  async getUserChallengeParticipation(challengeId: string, userId: string): Promise<ChallengeParticipation | null> {
    try {
      if (isFirestoreAvailable()) {
        const participationsRef = collection(db, 'challengeParticipations');
        const q = query(
          participationsRef,
          where('challengeId', '==', challengeId),
          where('userId', '==', userId)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          return {
            id: snapshot.docs[0].id,
            ...data,
            joinedAt: data.joinedAt?.toDate ? data.joinedAt.toDate() : new Date(data.joinedAt),
          } as ChallengeParticipation;
        }
      }

      // No offline fallback for participations
      console.log('🔄 No participation found');
      return null;
    } catch (error) {
      console.error('Error getting user challenge participation:', error);
      return null;
    }
  }

  // Get user's challenge participations
  async getUserChallenges(userId: string): Promise<ChallengeParticipation[]> {
    console.log('🔄 Getting user challenges for user:', userId);
    // This method would typically query Firebase for user participations
    // For now, return empty array as fallback
    return [];
  }

  // Real-time challenge listener
  subscribeToChallenge(challengeId: string, callback: (challenge: Challenge | null) => void): () => void {
    if (!isFirestoreAvailable()) {
      // For offline mode, use static challenges
      const challenge = OFFLINE_CHALLENGES.find((c: Challenge) => c.id === challengeId) || null;
      callback(challenge);
      return () => {}; // Return empty unsubscribe function
    }

    const challengeRef = doc(db, 'challenges', challengeId);
    return onSnapshot(challengeRef, (doc: DocumentSnapshot) => {
      if (doc.exists()) {
        const data = doc.data();
        const challenge: Challenge = {
          ...data,
          id: doc.id,
          startDate: data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate),
          endDate: data.endDate?.toDate ? data.endDate.toDate() : new Date(data.endDate),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        } as Challenge;
        callback(challenge);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error in challenge subscription:', error);
      // Fallback to offline challenges on error
      const challenge = OFFLINE_CHALLENGES.find((c: Challenge) => c.id === challengeId) || null;
      callback(challenge);
    });
  }

  // Real-time user participation listener
  subscribeToUserParticipation(challengeId: string, userId: string, callback: (participation: ChallengeParticipation | null) => void): () => void {
    if (!isFirestoreAvailable()) {
      // For offline mode, no participation data available
      callback(null);
      return () => {}; // Return empty unsubscribe function
    }

    const participationsRef = collection(db, 'challengeParticipations');
    const q = query(
      participationsRef,
      where('challengeId', '==', challengeId),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot: QuerySnapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        const participation: ChallengeParticipation = {
          id: doc.id,
          ...data,
          joinedAt: data.joinedAt?.toDate ? data.joinedAt.toDate() : new Date(data.joinedAt),
        } as ChallengeParticipation;
        callback(participation);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error in participation subscription:', error);
      // No fallback participation data
      callback(null);
    });
  }

  // Real-time challenges list listener
  subscribeToActiveChallenges(callback: (challenges: Challenge[]) => void): () => void {
    if (!isFirestoreAvailable()) {
      // For offline mode, use static challenges
      callback(OFFLINE_CHALLENGES);
      return () => {}; // Return empty unsubscribe function
    }

    const challengesRef = collection(db, 'challenges');
    const q = query(
      challengesRef,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot: QuerySnapshot) => {
      const challenges: Challenge[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate),
          endDate: data.endDate?.toDate ? data.endDate.toDate() : new Date(data.endDate),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        } as Challenge;
      });
      callback(challenges);
    }, (error) => {
      console.error('Error in challenges subscription:', error);
      // Fallback to offline challenges on error
      callback(OFFLINE_CHALLENGES);
    });
  }

  // Get leaderboard
  async getLeaderboard(limit_count: number = 50): Promise<LeaderboardEntry[]> {
    try {
      // This would typically be a more complex query involving user stats
      // For now, we'll create a simplified version
      const usersRef = collection(db, 'users');
      const q = query(usersRef, limit(limit_count));

      const snapshot = await getDocs(q);
      const leaderboard: LeaderboardEntry[] = [];

      for (let i = 0; i < snapshot.docs.length; i++) {
        const userDoc = snapshot.docs[i];
        const userData = userDoc.data();

        // Calculate total points from completed challenges
        const userChallenges = await this.getUserChallenges(userDoc.id);
        const completedChallenges = userChallenges.filter(c => c.isCompleted);

        const entry: LeaderboardEntry = {
          userId: userDoc.id,
          displayName: userData.displayName || 'Anonymous',
          photoURL: userData.photoURL,
          totalPoints: completedChallenges.length * 100, // Simplified scoring
          completedChallenges: completedChallenges.length,
          currentStreak: userData.stats?.streakDays || 0,
          level: Math.floor((userData.stats?.totalMeals || 0) / 20) + 1,
          badges: [], // TODO: Implement badge system
          rank: i + 1,
        };

        leaderboard.push(entry);
      }

      // Sort by total points
      return leaderboard.sort((a, b) => b.totalPoints - a.totalPoints)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }
  }
}

export const challengeService = new ChallengeService();
