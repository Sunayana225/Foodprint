// Local storage-based meal tracking service (no Firestore required)

export interface Meal {
  id: string;
  userId: string;
  name: string;
  ingredients: string[];
  carbonFootprint: number; // kg CO2
  waterUsage: number; // liters
  calories: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  createdAt: Date;
  ecoScore: number; // 0-100
}

export interface MealStats {
  totalMeals: number;
  totalCO2: number;
  totalWater: number;
  averageEcoScore: number;
  todayMeals: number;
  todayCO2: number;
  weeklyTrend: {
    co2Change: number;
    waterChange: number;
    scoreChange: number;
  };
}

class LocalMealService {
  private storageKey = 'foodprint_meals';
  private statsKey = 'foodprint_meal_stats';

  // Get all meals for a user
  getUserMeals(userId: string): Meal[] {
    try {
      const meals = localStorage.getItem(this.storageKey);
      if (!meals) return [];
      
      const allMeals: Meal[] = JSON.parse(meals);
      return allMeals
        .filter(meal => meal.userId === userId)
        .map(meal => ({
          ...meal,
          createdAt: new Date(meal.createdAt)
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error loading meals from localStorage:', error);
      return [];
    }
  }

  // Add a new meal
  async addMeal(userId: string, mealData: Omit<Meal, 'id' | 'userId' | 'createdAt'>): Promise<Meal> {
    try {
      const meals = this.getAllMeals();

      const newMeal: Meal = {
        ...mealData,
        id: this.generateId(),
        userId,
        createdAt: new Date()
      };

      meals.push(newMeal);
      localStorage.setItem(this.storageKey, JSON.stringify(meals));

      // Update stats
      this.updateStats(userId);

      // Update profile stats
      await this.updateProfileStats(userId);

      console.log('✅ Meal added to localStorage:', newMeal.name);
      return newMeal;
    } catch (error) {
      console.error('Error adding meal to localStorage:', error);
      throw new Error('Failed to save meal');
    }
  }

  // Get meal statistics for a user
  getUserStats(userId: string): MealStats {
    try {
      const meals = this.getUserMeals(userId);
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // Calculate today's meals
      const todayMeals = meals.filter(meal => meal.createdAt >= todayStart);
      
      // Calculate weekly comparison (last 7 days vs previous 7 days)
      const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const previous7Days = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      
      const recentMeals = meals.filter(meal => meal.createdAt >= last7Days);
      const previousMeals = meals.filter(meal => 
        meal.createdAt >= previous7Days && meal.createdAt < last7Days
      );

      const recentAvgCO2 = recentMeals.length > 0 
        ? recentMeals.reduce((sum, meal) => sum + meal.carbonFootprint, 0) / recentMeals.length
        : 0;
      const previousAvgCO2 = previousMeals.length > 0
        ? previousMeals.reduce((sum, meal) => sum + meal.carbonFootprint, 0) / previousMeals.length
        : 0;

      const recentAvgWater = recentMeals.length > 0
        ? recentMeals.reduce((sum, meal) => sum + meal.waterUsage, 0) / recentMeals.length
        : 0;
      const previousAvgWater = previousMeals.length > 0
        ? previousMeals.reduce((sum, meal) => sum + meal.waterUsage, 0) / previousMeals.length
        : 0;

      const recentAvgScore = recentMeals.length > 0
        ? recentMeals.reduce((sum, meal) => sum + meal.ecoScore, 0) / recentMeals.length
        : 0;
      const previousAvgScore = previousMeals.length > 0
        ? previousMeals.reduce((sum, meal) => sum + meal.ecoScore, 0) / previousMeals.length
        : 0;

      return {
        totalMeals: meals.length,
        totalCO2: meals.reduce((sum, meal) => sum + meal.carbonFootprint, 0),
        totalWater: meals.reduce((sum, meal) => sum + meal.waterUsage, 0),
        averageEcoScore: meals.length > 0 
          ? meals.reduce((sum, meal) => sum + meal.ecoScore, 0) / meals.length 
          : 0,
        todayMeals: todayMeals.length,
        todayCO2: todayMeals.reduce((sum, meal) => sum + meal.carbonFootprint, 0),
        weeklyTrend: {
          co2Change: previousAvgCO2 > 0 ? ((recentAvgCO2 - previousAvgCO2) / previousAvgCO2) * 100 : 0,
          waterChange: previousAvgWater > 0 ? ((recentAvgWater - previousAvgWater) / previousAvgWater) * 100 : 0,
          scoreChange: previousAvgScore > 0 ? ((recentAvgScore - previousAvgScore) / previousAvgScore) * 100 : 0,
        }
      };
    } catch (error) {
      console.error('Error calculating meal stats:', error);
      return {
        totalMeals: 0,
        totalCO2: 0,
        totalWater: 0,
        averageEcoScore: 0,
        todayMeals: 0,
        todayCO2: 0,
        weeklyTrend: { co2Change: 0, waterChange: 0, scoreChange: 0 }
      };
    }
  }

  // Delete a meal
  async deleteMeal(userId: string, mealId: string): Promise<void> {
    try {
      const meals = this.getAllMeals();
      const filteredMeals = meals.filter(meal => 
        !(meal.id === mealId && meal.userId === userId)
      );
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredMeals));
      this.updateStats(userId);
      
      console.log('✅ Meal deleted from localStorage');
    } catch (error) {
      console.error('Error deleting meal from localStorage:', error);
      throw new Error('Failed to delete meal');
    }
  }

  // Calculate carbon footprint for ingredients
  calculateCarbonFootprint(ingredients: string[]): number {
    // Simplified carbon footprint calculation
    const carbonFactors: { [key: string]: number } = {
      'beef': 27.0,
      'lamb': 24.5,
      'cheese': 13.5,
      'pork': 12.1,
      'chicken': 6.9,
      'fish': 6.1,
      'eggs': 4.8,
      'rice': 2.7,
      'milk': 3.2,
      'bread': 0.9,
      'vegetables': 0.4,
      'fruits': 0.3,
      'beans': 0.4,
      'nuts': 0.3,
      'pasta': 1.1,
      'potato': 0.3
    };

    let totalCO2 = 0;
    ingredients.forEach(ingredient => {
      const lowerIngredient = ingredient.toLowerCase();
      for (const [key, factor] of Object.entries(carbonFactors)) {
        if (lowerIngredient.includes(key)) {
          totalCO2 += factor;
          break;
        }
      }
      // Default factor for unknown ingredients
      if (!Object.keys(carbonFactors).some(key => lowerIngredient.includes(key))) {
        totalCO2 += 2.0; // Average factor
      }
    });

    return Math.round(totalCO2 * 100) / 100; // Round to 2 decimal places
  }

  // Calculate water usage for ingredients
  calculateWaterUsage(ingredients: string[]): number {
    // Simplified water usage calculation (liters)
    const waterFactors: { [key: string]: number } = {
      'beef': 15400,
      'lamb': 10400,
      'pork': 6000,
      'chicken': 4300,
      'cheese': 3200,
      'fish': 3000,
      'eggs': 3300,
      'rice': 2500,
      'milk': 1000,
      'bread': 1600,
      'vegetables': 300,
      'fruits': 900,
      'beans': 1800,
      'nuts': 9000,
      'pasta': 1800,
      'potato': 300
    };

    let totalWater = 0;
    ingredients.forEach(ingredient => {
      const lowerIngredient = ingredient.toLowerCase();
      for (const [key, factor] of Object.entries(waterFactors)) {
        if (lowerIngredient.includes(key)) {
          totalWater += factor;
          break;
        }
      }
      // Default factor for unknown ingredients
      if (!Object.keys(waterFactors).some(key => lowerIngredient.includes(key))) {
        totalWater += 1500; // Average factor
      }
    });

    return Math.round(totalWater);
  }

  // Calculate eco score based on carbon footprint and water usage
  calculateEcoScore(carbonFootprint: number, waterUsage: number): number {
    // Lower carbon and water = higher score
    const carbonScore = Math.max(0, 100 - (carbonFootprint * 5));
    const waterScore = Math.max(0, 100 - (waterUsage / 100));
    
    return Math.round((carbonScore + waterScore) / 2);
  }

  // Private helper methods
  private getAllMeals(): Meal[] {
    try {
      const meals = localStorage.getItem(this.storageKey);
      return meals ? JSON.parse(meals) : [];
    } catch (error) {
      console.error('Error loading all meals:', error);
      return [];
    }
  }

  private updateStats(userId: string): void {
    try {
      const stats = this.getUserStats(userId);
      localStorage.setItem(`${this.statsKey}_${userId}`, JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Update profile stats when meals are added
  private async updateProfileStats(userId: string): Promise<void> {
    try {
      const { localProfileService } = await import('./localProfileService');
      const userMeals = this.getUserMeals(userId);
      const stats = this.getUserStats(userId);

      // Calculate CO2 and water saved (compared to average meal impact)
      const averageMealCO2 = 5.0; // kg CO2 per meal (average)
      const averageMealWater = 2000; // liters per meal (average)

      const totalCO2 = userMeals.reduce((sum, meal) => sum + meal.carbonFootprint, 0);
      const totalWater = userMeals.reduce((sum, meal) => sum + meal.waterUsage, 0);

      const co2Saved = Math.max(0, (userMeals.length * averageMealCO2) - totalCO2);
      const waterSaved = Math.max(0, (userMeals.length * averageMealWater) - totalWater);

      // Calculate points based on eco-friendliness
      const points = userMeals.reduce((sum, meal) => sum + meal.ecoScore, 0);

      await localProfileService.updateStats(userId, {
        totalMeals: userMeals.length,
        totalCO2Saved: co2Saved,
        totalWaterSaved: waterSaved,
        totalPoints: points,
        streakDays: this.calculateCurrentStreak(userId)
      });
    } catch (error) {
      console.error('Error updating profile stats:', error);
    }
  }

  // Calculate current meal tracking streak
  private calculateCurrentStreak(userId: string): number {
    const meals = this.getUserMeals(userId);
    if (meals.length === 0) return 0;

    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Check each day going backwards
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const dateStr = currentDate.toISOString().split('T')[0];
      const mealsOnDate = meals.filter(meal =>
        meal.createdAt.toISOString().split('T')[0] === dateStr
      );

      if (mealsOnDate.length > 0) {
        streak++;
      } else if (streak > 0) {
        break; // Streak broken
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  // Clear all data (for testing)
  clearAllData(): void {
    localStorage.removeItem(this.storageKey);
    console.log('🗑️ All meal data cleared from localStorage');
  }
}

export const localMealService = new LocalMealService();
