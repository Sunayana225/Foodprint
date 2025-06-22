// Local storage-based leaderboard system (no Firestore required)

import { localProfileService, type ExtendedUserProfile } from './localProfileService';

export interface LeaderboardEntry {
  rank: number;
  user: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
  stats: {
    totalPoints: number;
    totalMeals: number;
    totalCO2Saved: number;
    totalWaterSaved: number;
    challengesCompleted: number;
    level: number;
    streakDays: number;
  };
  badges: number;
}

export interface LeaderboardFilters {
  timeframe: 'all_time' | 'this_month' | 'this_week';
  category: 'points' | 'meals' | 'co2_saved' | 'water_saved' | 'challenges';
  limit: number;
}

class LocalLeaderboardService {
  
  // Get main leaderboard (by total points)
  getLeaderboard(filters: Partial<LeaderboardFilters> = {}): LeaderboardEntry[] {
    try {
      const {
        timeframe = 'all_time',
        category = 'points',
        limit = 10
      } = filters;

      const profiles = localProfileService.getAllProfiles();
      
      // Filter by timeframe if needed
      let filteredProfiles = profiles;
      if (timeframe !== 'all_time') {
        const cutoffDate = this.getCutoffDate(timeframe);
        filteredProfiles = profiles.filter(profile => 
          profile.lastLoginAt >= cutoffDate
        );
      }

      // Sort by selected category
      const sortedProfiles = this.sortByCategory(filteredProfiles, category);

      // Convert to leaderboard entries
      return sortedProfiles.slice(0, limit).map((profile, index) => ({
        rank: index + 1,
        user: {
          uid: profile.uid,
          displayName: profile.displayName,
          photoURL: profile.photoURL
        },
        stats: {
          totalPoints: profile.stats.totalPoints,
          totalMeals: profile.stats.totalMeals,
          totalCO2Saved: profile.stats.totalCO2Saved,
          totalWaterSaved: profile.stats.totalWaterSaved,
          challengesCompleted: profile.stats.challengesCompleted,
          level: profile.stats.level,
          streakDays: profile.stats.streakDays
        },
        badges: profile.badges.length
      }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // Get user's rank in leaderboard
  getUserRank(userId: string, category: LeaderboardFilters['category'] = 'points'): number {
    try {
      const profiles = localProfileService.getAllProfiles();
      const sortedProfiles = this.sortByCategory(profiles, category);
      
      const userIndex = sortedProfiles.findIndex(profile => profile.uid === userId);
      return userIndex >= 0 ? userIndex + 1 : -1;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return -1;
    }
  }

  // Get top performers in different categories
  getTopPerformers(): {
    topPoints: LeaderboardEntry | null;
    topMeals: LeaderboardEntry | null;
    topCO2Saver: LeaderboardEntry | null;
    topWaterSaver: LeaderboardEntry | null;
    topStreak: LeaderboardEntry | null;
  } {
    try {
      const profiles = localProfileService.getAllProfiles();
      
      if (profiles.length === 0) {
        return {
          topPoints: null,
          topMeals: null,
          topCO2Saver: null,
          topWaterSaver: null,
          topStreak: null
        };
      }

      const createEntry = (profile: ExtendedUserProfile, rank: number = 1): LeaderboardEntry => ({
        rank,
        user: {
          uid: profile.uid,
          displayName: profile.displayName,
          photoURL: profile.photoURL
        },
        stats: {
          totalPoints: profile.stats.totalPoints,
          totalMeals: profile.stats.totalMeals,
          totalCO2Saved: profile.stats.totalCO2Saved,
          totalWaterSaved: profile.stats.totalWaterSaved,
          challengesCompleted: profile.stats.challengesCompleted,
          level: profile.stats.level,
          streakDays: profile.stats.streakDays
        },
        badges: profile.badges.length
      });

      return {
        topPoints: createEntry(this.sortByCategory(profiles, 'points')[0]),
        topMeals: createEntry(this.sortByCategory(profiles, 'meals')[0]),
        topCO2Saver: createEntry(this.sortByCategory(profiles, 'co2_saved')[0]),
        topWaterSaver: createEntry(this.sortByCategory(profiles, 'water_saved')[0]),
        topStreak: createEntry(profiles.sort((a, b) => b.stats.streakDays - a.stats.streakDays)[0])
      };
    } catch (error) {
      console.error('Error getting top performers:', error);
      return {
        topPoints: null,
        topMeals: null,
        topCO2Saver: null,
        topWaterSaver: null,
        topStreak: null
      };
    }
  }

  // Get leaderboard statistics
  getLeaderboardStats(): {
    totalUsers: number;
    totalMeals: number;
    totalCO2Saved: number;
    totalWaterSaved: number;
    totalChallengesCompleted: number;
    averageLevel: number;
  } {
    try {
      const profiles = localProfileService.getAllProfiles();
      
      if (profiles.length === 0) {
        return {
          totalUsers: 0,
          totalMeals: 0,
          totalCO2Saved: 0,
          totalWaterSaved: 0,
          totalChallengesCompleted: 0,
          averageLevel: 0
        };
      }

      const totals = profiles.reduce((acc, profile) => ({
        totalMeals: acc.totalMeals + profile.stats.totalMeals,
        totalCO2Saved: acc.totalCO2Saved + profile.stats.totalCO2Saved,
        totalWaterSaved: acc.totalWaterSaved + profile.stats.totalWaterSaved,
        totalChallengesCompleted: acc.totalChallengesCompleted + profile.stats.challengesCompleted,
        totalLevels: acc.totalLevels + profile.stats.level
      }), {
        totalMeals: 0,
        totalCO2Saved: 0,
        totalWaterSaved: 0,
        totalChallengesCompleted: 0,
        totalLevels: 0
      });

      return {
        totalUsers: profiles.length,
        totalMeals: totals.totalMeals,
        totalCO2Saved: totals.totalCO2Saved,
        totalWaterSaved: totals.totalWaterSaved,
        totalChallengesCompleted: totals.totalChallengesCompleted,
        averageLevel: Math.round(totals.totalLevels / profiles.length * 10) / 10
      };
    } catch (error) {
      console.error('Error getting leaderboard stats:', error);
      return {
        totalUsers: 0,
        totalMeals: 0,
        totalCO2Saved: 0,
        totalWaterSaved: 0,
        totalChallengesCompleted: 0,
        averageLevel: 0
      };
    }
  }

  // Private helper methods
  private sortByCategory(profiles: ExtendedUserProfile[], category: LeaderboardFilters['category']): ExtendedUserProfile[] {
    switch (category) {
      case 'points':
        return profiles.sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);
      case 'meals':
        return profiles.sort((a, b) => b.stats.totalMeals - a.stats.totalMeals);
      case 'co2_saved':
        return profiles.sort((a, b) => b.stats.totalCO2Saved - a.stats.totalCO2Saved);
      case 'water_saved':
        return profiles.sort((a, b) => b.stats.totalWaterSaved - a.stats.totalWaterSaved);
      case 'challenges':
        return profiles.sort((a, b) => b.stats.challengesCompleted - a.stats.challengesCompleted);
      default:
        return profiles.sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);
    }
  }

  private getCutoffDate(timeframe: 'this_month' | 'this_week'): Date {
    const now = new Date();
    
    if (timeframe === 'this_week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return startOfWeek;
    } else if (timeframe === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return startOfMonth;
    }
    
    return new Date(0); // Beginning of time for 'all_time'
  }
}

export const localLeaderboardService = new LocalLeaderboardService();
