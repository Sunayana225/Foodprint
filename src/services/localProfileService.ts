// Local storage-based user profile system (no Firestore required)

export interface ExtendedUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    dietaryRestrictions: string[];
    sustainabilityGoals: string[];
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    units: 'metric' | 'imperial';
  };
  stats: {
    totalMeals: number;
    totalCO2Saved: number;
    totalWaterSaved: number;
    streakDays: number;
    challengesCompleted: number;
    totalPoints: number;
    level: number;
    achievements: string[];
  };
  goals: {
    dailyCO2Target: number;
    weeklyMealsTarget: number;
    monthlyPointsTarget: number;
  };
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'meals' | 'challenges' | 'streaks' | 'environmental' | 'social';
}

class LocalProfileService {
  private profilesKey = 'foodprint_profiles';
  private badgesKey = 'foodprint_badges';

  // Get user profile
  getUserProfile(userId: string): ExtendedUserProfile | null {
    try {
      const profiles = this.getAllProfiles();
      const profile = profiles.find(p => p.uid === userId);
      return profile || null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Create or update user profile
  createOrUpdateProfile(userId: string, basicInfo: { email: string; displayName: string; photoURL?: string }): ExtendedUserProfile {
    try {
      const profiles = this.getAllProfiles();
      const existingIndex = profiles.findIndex(p => p.uid === userId);
      
      if (existingIndex >= 0) {
        // Update existing profile
        profiles[existingIndex] = {
          ...profiles[existingIndex],
          ...basicInfo,
          lastLoginAt: new Date()
        };
        localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
        console.log('✅ User profile updated');
        return profiles[existingIndex];
      } else {
        // Create new profile
        const newProfile: ExtendedUserProfile = {
          uid: userId,
          email: basicInfo.email,
          displayName: basicInfo.displayName,
          photoURL: basicInfo.photoURL,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            dietaryRestrictions: [],
            sustainabilityGoals: ['reduce_carbon', 'save_water'],
            notifications: true,
            theme: 'light',
            units: 'metric'
          },
          stats: {
            totalMeals: 0,
            totalCO2Saved: 0,
            totalWaterSaved: 0,
            streakDays: 0,
            challengesCompleted: 0,
            totalPoints: 0,
            level: 1,
            achievements: []
          },
          goals: {
            dailyCO2Target: 5.0,
            weeklyMealsTarget: 21,
            monthlyPointsTarget: 500
          },
          badges: []
        };

        profiles.push(newProfile);
        localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
        
        // Award welcome badge
        this.awardBadge(userId, 'welcome');
        
        console.log('✅ New user profile created');
        return newProfile;
      }
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      throw new Error('Failed to create/update profile');
    }
  }

  // Update user preferences
  async updatePreferences(userId: string, preferences: Partial<ExtendedUserProfile['preferences']>): Promise<void> {
    try {
      const profiles = this.getAllProfiles();
      const profileIndex = profiles.findIndex(p => p.uid === userId);
      
      if (profileIndex === -1) {
        throw new Error('Profile not found');
      }

      profiles[profileIndex].preferences = {
        ...profiles[profileIndex].preferences,
        ...preferences
      };

      localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
      console.log('✅ User preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  // Update user goals
  async updateGoals(userId: string, goals: Partial<ExtendedUserProfile['goals']>): Promise<void> {
    try {
      const profiles = this.getAllProfiles();
      const profileIndex = profiles.findIndex(p => p.uid === userId);
      
      if (profileIndex === -1) {
        throw new Error('Profile not found');
      }

      profiles[profileIndex].goals = {
        ...profiles[profileIndex].goals,
        ...goals
      };

      localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
      console.log('✅ User goals updated');
    } catch (error) {
      console.error('Error updating goals:', error);
      throw error;
    }
  }

  // Update entire user profile
  updateProfile(userId: string, profileUpdate: Partial<ExtendedUserProfile>): ExtendedUserProfile | null {
    try {
      const profiles = this.getAllProfiles();
      const profileIndex = profiles.findIndex(p => p.uid === userId);

      if (profileIndex === -1) {
        throw new Error('Profile not found');
      }

      // Update the profile with new data
      profiles[profileIndex] = {
        ...profiles[profileIndex],
        ...profileUpdate,
        uid: userId, // Ensure UID doesn't change
        lastLoginAt: new Date() // Update last login time
      };

      localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
      console.log('✅ User profile updated');
      return profiles[profileIndex];
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }

  // Update user stats (called when meals are added, challenges completed, etc.)
  async updateStats(userId: string, statsUpdate: Partial<ExtendedUserProfile['stats']>): Promise<void> {
    try {
      const profiles = this.getAllProfiles();
      const profileIndex = profiles.findIndex(p => p.uid === userId);
      
      if (profileIndex === -1) {
        throw new Error('Profile not found');
      }

      const currentStats = profiles[profileIndex].stats;
      profiles[profileIndex].stats = {
        ...currentStats,
        ...statsUpdate
      };

      // Update level based on total points
      const newLevel = Math.floor(profiles[profileIndex].stats.totalPoints / 100) + 1;
      if (newLevel > profiles[profileIndex].stats.level) {
        profiles[profileIndex].stats.level = newLevel;
        this.awardBadge(userId, 'level_up');
      }

      localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
      
      // Check for badge achievements
      this.checkBadgeAchievements(userId);
      
      console.log('✅ User stats updated');
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  }

  // Award a badge to user
  awardBadge(userId: string, badgeType: string): void {
    try {
      const profiles = this.getAllProfiles();
      const profileIndex = profiles.findIndex(p => p.uid === userId);
      
      if (profileIndex === -1) return;

      const badgeDefinitions: { [key: string]: Omit<Badge, 'id' | 'earnedAt'> } = {
        welcome: {
          name: 'Welcome to FoodPrint',
          description: 'Joined the FoodPrint community',
          icon: '🎉',
          category: 'social'
        },
        first_meal: {
          name: 'First Meal Tracked',
          description: 'Tracked your first meal',
          icon: '🍽️',
          category: 'meals'
        },
        eco_warrior: {
          name: 'Eco Warrior',
          description: 'Completed 5 challenges',
          icon: '🌱',
          category: 'challenges'
        },
        streak_master: {
          name: 'Streak Master',
          description: 'Maintained a 7-day streak',
          icon: '🔥',
          category: 'streaks'
        },
        carbon_saver: {
          name: 'Carbon Saver',
          description: 'Saved 50kg of CO₂',
          icon: '🌍',
          category: 'environmental'
        },
        level_up: {
          name: 'Level Up',
          description: 'Reached a new level',
          icon: '⭐',
          category: 'social'
        }
      };

      const badgeDefinition = badgeDefinitions[badgeType];
      if (!badgeDefinition) return;

      // Check if badge already exists
      const existingBadge = profiles[profileIndex].badges.find(b => b.name === badgeDefinition.name);
      if (existingBadge) return;

      const newBadge: Badge = {
        ...badgeDefinition,
        id: this.generateId(),
        earnedAt: new Date()
      };

      profiles[profileIndex].badges.push(newBadge);
      profiles[profileIndex].stats.achievements.push(badgeDefinition.name);
      
      localStorage.setItem(this.profilesKey, JSON.stringify(profiles));
      console.log('🏆 Badge awarded:', badgeDefinition.name);
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  }

  // Check for badge achievements based on current stats
  private checkBadgeAchievements(userId: string): void {
    const profile = this.getUserProfile(userId);
    if (!profile) return;

    const stats = profile.stats;

    // Check various achievement conditions
    if (stats.totalMeals >= 1 && !profile.badges.find(b => b.name === 'First Meal Tracked')) {
      this.awardBadge(userId, 'first_meal');
    }

    if (stats.challengesCompleted >= 5 && !profile.badges.find(b => b.name === 'Eco Warrior')) {
      this.awardBadge(userId, 'eco_warrior');
    }

    if (stats.streakDays >= 7 && !profile.badges.find(b => b.name === 'Streak Master')) {
      this.awardBadge(userId, 'streak_master');
    }

    if (stats.totalCO2Saved >= 50 && !profile.badges.find(b => b.name === 'Carbon Saver')) {
      this.awardBadge(userId, 'carbon_saver');
    }
  }

  // Get all profiles (for leaderboard)
  getAllProfiles(): ExtendedUserProfile[] {
    try {
      const profiles = localStorage.getItem(this.profilesKey);
      if (!profiles) return [];
      
      return JSON.parse(profiles).map((profile: any) => ({
        ...profile,
        createdAt: new Date(profile.createdAt),
        lastLoginAt: new Date(profile.lastLoginAt),
        badges: profile.badges?.map((badge: any) => ({
          ...badge,
          earnedAt: new Date(badge.earnedAt)
        })) || []
      }));
    } catch (error) {
      console.error('Error loading profiles:', error);
      return [];
    }
  }

  // Get leaderboard data
  getLeaderboard(limit: number = 10): Array<{
    rank: number;
    user: Pick<ExtendedUserProfile, 'uid' | 'displayName' | 'photoURL'>;
    stats: ExtendedUserProfile['stats'];
  }> {
    try {
      const profiles = this.getAllProfiles()
        .sort((a, b) => b.stats.totalPoints - a.stats.totalPoints)
        .slice(0, limit);

      return profiles.map((profile, index) => ({
        rank: index + 1,
        user: {
          uid: profile.uid,
          displayName: profile.displayName,
          photoURL: profile.photoURL
        },
        stats: profile.stats
      }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all data (for testing)
  clearAllData(): void {
    localStorage.removeItem(this.profilesKey);
    localStorage.removeItem(this.badgesKey);
    console.log('🗑️ All profile data cleared');
  }
}

export const localProfileService = new LocalProfileService();
