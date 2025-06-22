// Analytics service for tracking user engagement and progress

import { localMealService } from './localMealService';
import { localChallengeService } from './localChallengeService';
import { localProfileService } from './localProfileService';

export interface AnalyticsData {
  dailyStats: DailyStats[];
  weeklyTrends: WeeklyTrends;
  monthlyProgress: MonthlyProgress;
  achievements: Achievement[];
  insights: Insight[];
}

export interface DailyStats {
  date: string;
  mealsLogged: number;
  co2Saved: number;
  waterSaved: number;
  caloriesConsumed: number;
  ecoScore: number;
  challengesCompleted: number;
}

export interface WeeklyTrends {
  co2Trend: number; // percentage change
  waterTrend: number;
  mealsTrend: number;
  streakTrend: number;
  bestDay: string;
  worstDay: string;
}

export interface MonthlyProgress {
  totalMeals: number;
  totalCO2Saved: number;
  totalWaterSaved: number;
  averageEcoScore: number;
  challengesCompleted: number;
  badgesEarned: number;
  goalProgress: {
    mealsGoal: number;
    co2Goal: number;
    waterGoal: number;
    achievedMeals: number;
    achievedCO2: number;
    achievedWater: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'meals' | 'eco' | 'streak' | 'challenges';
}

export interface Insight {
  id: string;
  type: 'tip' | 'achievement' | 'warning' | 'goal';
  title: string;
  message: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}

class AnalyticsService {
  
  // Get comprehensive analytics for a user
  getUserAnalytics(userId: string, days: number = 30): AnalyticsData {
    try {
      const meals = localMealService.getUserMeals(userId);
      const profile = localProfileService.getUserProfile(userId);
      const participations = localChallengeService.getUserParticipations(userId);
      
      const dailyStats = this.generateDailyStats(meals, days);
      const weeklyTrends = this.calculateWeeklyTrends(dailyStats);
      const monthlyProgress = this.calculateMonthlyProgress(meals, participations, profile);
      const achievements = this.getRecentAchievements(profile);
      const insights = this.generateInsights(dailyStats, weeklyTrends, monthlyProgress, profile);
      
      return {
        dailyStats,
        weeklyTrends,
        monthlyProgress,
        achievements,
        insights
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      return this.getEmptyAnalytics();
    }
  }

  // Generate daily statistics
  private generateDailyStats(meals: any[], days: number): DailyStats[] {
    const stats: DailyStats[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMeals = meals.filter(meal => 
        meal.createdAt.toISOString().split('T')[0] === dateStr
      );
      
      const co2Saved = dayMeals.reduce((sum, meal) => sum + meal.carbonFootprint, 0);
      const waterSaved = dayMeals.reduce((sum, meal) => sum + meal.waterUsage, 0);
      const calories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const avgEcoScore = dayMeals.length > 0 ? 
        dayMeals.reduce((sum, meal) => sum + meal.ecoScore, 0) / dayMeals.length : 0;
      
      stats.push({
        date: dateStr,
        mealsLogged: dayMeals.length,
        co2Saved: Math.round(co2Saved * 10) / 10,
        waterSaved: Math.round(waterSaved),
        caloriesConsumed: Math.round(calories),
        ecoScore: Math.round(avgEcoScore),
        challengesCompleted: 0 // Would need challenge completion data
      });
    }
    
    return stats;
  }

  // Calculate weekly trends
  private calculateWeeklyTrends(dailyStats: DailyStats[]): WeeklyTrends {
    if (dailyStats.length < 14) {
      return {
        co2Trend: 0,
        waterTrend: 0,
        mealsTrend: 0,
        streakTrend: 0,
        bestDay: '',
        worstDay: ''
      };
    }
    
    const lastWeek = dailyStats.slice(-7);
    const previousWeek = dailyStats.slice(-14, -7);
    
    const lastWeekAvg = {
      co2: lastWeek.reduce((sum, day) => sum + day.co2Saved, 0) / 7,
      water: lastWeek.reduce((sum, day) => sum + day.waterSaved, 0) / 7,
      meals: lastWeek.reduce((sum, day) => sum + day.mealsLogged, 0) / 7
    };
    
    const previousWeekAvg = {
      co2: previousWeek.reduce((sum, day) => sum + day.co2Saved, 0) / 7,
      water: previousWeek.reduce((sum, day) => sum + day.waterSaved, 0) / 7,
      meals: previousWeek.reduce((sum, day) => sum + day.mealsLogged, 0) / 7
    };
    
    const co2Trend = previousWeekAvg.co2 > 0 ? 
      ((lastWeekAvg.co2 - previousWeekAvg.co2) / previousWeekAvg.co2) * 100 : 0;
    const waterTrend = previousWeekAvg.water > 0 ? 
      ((lastWeekAvg.water - previousWeekAvg.water) / previousWeekAvg.water) * 100 : 0;
    const mealsTrend = previousWeekAvg.meals > 0 ? 
      ((lastWeekAvg.meals - previousWeekAvg.meals) / previousWeekAvg.meals) * 100 : 0;
    
    // Find best and worst days
    const bestDay = lastWeek.reduce((best, day) => 
      day.ecoScore > best.ecoScore ? day : best
    );
    const worstDay = lastWeek.reduce((worst, day) => 
      day.ecoScore < worst.ecoScore ? day : worst
    );
    
    return {
      co2Trend: Math.round(co2Trend * 10) / 10,
      waterTrend: Math.round(waterTrend * 10) / 10,
      mealsTrend: Math.round(mealsTrend * 10) / 10,
      streakTrend: 0, // Would need streak calculation
      bestDay: bestDay.date,
      worstDay: worstDay.date
    };
  }

  // Calculate monthly progress
  private calculateMonthlyProgress(meals: any[], participations: any[], profile: any): MonthlyProgress {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyMeals = meals.filter(meal => 
      meal.createdAt >= startOfMonth
    );
    
    const totalCO2Saved = monthlyMeals.reduce((sum, meal) => sum + meal.carbonFootprint, 0);
    const totalWaterSaved = monthlyMeals.reduce((sum, meal) => sum + meal.waterUsage, 0);
    const avgEcoScore = monthlyMeals.length > 0 ? 
      monthlyMeals.reduce((sum, meal) => sum + meal.ecoScore, 0) / monthlyMeals.length : 0;
    
    const challengesCompleted = participations.filter(p => p.isCompleted).length;
    const badgesEarned = profile?.badges?.length || 0;
    
    // Default goals (could be customizable)
    const goals = profile?.goals || {
      monthlyMealsTarget: 60,
      monthlyCO2Target: 50,
      monthlyWaterTarget: 30000
    };
    
    return {
      totalMeals: monthlyMeals.length,
      totalCO2Saved: Math.round(totalCO2Saved * 10) / 10,
      totalWaterSaved: Math.round(totalWaterSaved),
      averageEcoScore: Math.round(avgEcoScore),
      challengesCompleted,
      badgesEarned,
      goalProgress: {
        mealsGoal: goals.monthlyMealsTarget || 60,
        co2Goal: goals.monthlyCO2Target || 50,
        waterGoal: goals.monthlyWaterTarget || 30000,
        achievedMeals: monthlyMeals.length,
        achievedCO2: Math.round(totalCO2Saved * 10) / 10,
        achievedWater: Math.round(totalWaterSaved)
      }
    };
  }

  // Get recent achievements
  private getRecentAchievements(profile: any): Achievement[] {
    if (!profile?.badges) return [];
    
    return profile.badges.slice(-5).map((badge: any) => ({
      id: badge.id,
      title: badge.name,
      description: badge.description,
      icon: badge.icon,
      unlockedAt: new Date(badge.earnedAt),
      category: this.categorizeBadge(badge.name)
    }));
  }

  // Generate personalized insights
  private generateInsights(
    dailyStats: DailyStats[], 
    weeklyTrends: WeeklyTrends, 
    monthlyProgress: MonthlyProgress,
    profile: any
  ): Insight[] {
    const insights: Insight[] = [];
    
    // Trend insights
    if (weeklyTrends.co2Trend > 10) {
      insights.push({
        id: 'co2-improvement',
        type: 'achievement',
        title: 'Great Progress!',
        message: `Your CO₂ savings increased by ${weeklyTrends.co2Trend.toFixed(1)}% this week!`,
        actionable: false,
        priority: 'medium'
      });
    } else if (weeklyTrends.co2Trend < -10) {
      insights.push({
        id: 'co2-decline',
        type: 'warning',
        title: 'Room for Improvement',
        message: `Your CO₂ savings decreased by ${Math.abs(weeklyTrends.co2Trend).toFixed(1)}% this week. Try choosing more eco-friendly options!`,
        actionable: true,
        priority: 'high'
      });
    }
    
    // Goal progress insights
    const mealGoalProgress = (monthlyProgress.goalProgress.achievedMeals / monthlyProgress.goalProgress.mealsGoal) * 100;
    if (mealGoalProgress >= 80) {
      insights.push({
        id: 'meal-goal-close',
        type: 'goal',
        title: 'Almost There!',
        message: `You're ${mealGoalProgress.toFixed(0)}% towards your monthly meal tracking goal!`,
        actionable: false,
        priority: 'medium'
      });
    }
    
    // Streak insights
    const recentDays = dailyStats.slice(-7);
    const activeDays = recentDays.filter(day => day.mealsLogged > 0).length;
    if (activeDays >= 5) {
      insights.push({
        id: 'consistency-good',
        type: 'achievement',
        title: 'Consistent Tracking!',
        message: `You've logged meals on ${activeDays} out of the last 7 days. Keep it up!`,
        actionable: false,
        priority: 'low'
      });
    }
    
    // Personalized tips
    const avgEcoScore = dailyStats.slice(-7).reduce((sum, day) => sum + day.ecoScore, 0) / 7;
    if (avgEcoScore < 70) {
      insights.push({
        id: 'eco-score-tip',
        type: 'tip',
        title: 'Boost Your Eco Score',
        message: 'Try adding more plant-based meals to improve your environmental impact!',
        actionable: true,
        priority: 'medium'
      });
    }
    
    return insights.slice(0, 5); // Limit to 5 insights
  }

  // Helper methods
  private categorizeBadge(badgeName: string): 'meals' | 'eco' | 'streak' | 'challenges' {
    const name = badgeName.toLowerCase();
    if (name.includes('meal') || name.includes('food')) return 'meals';
    if (name.includes('eco') || name.includes('green') || name.includes('carbon')) return 'eco';
    if (name.includes('streak') || name.includes('consistent')) return 'streak';
    if (name.includes('challenge') || name.includes('champion')) return 'challenges';
    return 'meals';
  }

  private getEmptyAnalytics(): AnalyticsData {
    return {
      dailyStats: [],
      weeklyTrends: {
        co2Trend: 0,
        waterTrend: 0,
        mealsTrend: 0,
        streakTrend: 0,
        bestDay: '',
        worstDay: ''
      },
      monthlyProgress: {
        totalMeals: 0,
        totalCO2Saved: 0,
        totalWaterSaved: 0,
        averageEcoScore: 0,
        challengesCompleted: 0,
        badgesEarned: 0,
        goalProgress: {
          mealsGoal: 60,
          co2Goal: 50,
          waterGoal: 30000,
          achievedMeals: 0,
          achievedCO2: 0,
          achievedWater: 0
        }
      },
      achievements: [],
      insights: []
    };
  }
}

export const analyticsService = new AnalyticsService();
