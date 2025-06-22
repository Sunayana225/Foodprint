// Utility to seed default challenges and sample data for the FoodPrint app

import { localChallengeService } from '../services/localChallengeService';
import { localProfileService } from '../services/localProfileService';

export const seedDefaultChallenges = () => {
  console.log('🌱 Seeding default challenges...');
  
  const defaultChallenges = [
    {
      title: "Plant-Based Week Challenge",
      description: "Go completely plant-based for 7 days and discover delicious vegan alternatives. Track your meals and see the environmental impact!",
      type: 'plant_based' as const,
      target: 7,
      unit: 'days',
      duration: 7,
      difficulty: 'medium' as const,
      points: 150,
      isActive: true,
      createdBy: 'system',
      instructions: [
        'Choose plant-based options for all meals',
        'Explore new vegetables, grains, and legumes',
        'Track each meal in the app',
        'Share your favorite discoveries',
        'Complete all 7 days for maximum impact'
      ]
    },
    {
      title: "Water Conservation Hero",
      description: "Reduce your water footprint by choosing water-efficient foods and tracking your consumption for 10 days.",
      type: 'water_saving' as const,
      target: 10,
      unit: 'days',
      duration: 10,
      difficulty: 'easy' as const,
      points: 100,
      isActive: true,
      createdBy: 'system',
      instructions: [
        'Choose foods with lower water footprints',
        'Avoid water-intensive crops when possible',
        'Track your daily water savings',
        'Learn about water-efficient cooking methods',
        'Complete the full 10-day challenge'
      ]
    },
    {
      title: "Carbon Footprint Reducer",
      description: "Minimize your carbon footprint by choosing local, seasonal foods and reducing meat consumption for 14 days.",
      type: 'carbon_reduction' as const,
      target: 14,
      unit: 'days',
      duration: 14,
      difficulty: 'hard' as const,
      points: 200,
      isActive: true,
      createdBy: 'system',
      instructions: [
        'Choose locally sourced ingredients',
        'Opt for seasonal produce',
        'Reduce or eliminate meat consumption',
        'Track your carbon savings daily',
        'Complete the full 2-week challenge'
      ]
    },
    {
      title: "Zero Waste Kitchen",
      description: "Minimize food waste by meal planning, using leftovers creatively, and composting for 7 days.",
      type: 'zero_waste' as const,
      target: 7,
      unit: 'days',
      duration: 7,
      difficulty: 'medium' as const,
      points: 120,
      isActive: true,
      createdBy: 'system',
      instructions: [
        'Plan your meals in advance',
        'Use all parts of vegetables and fruits',
        'Transform leftovers into new meals',
        'Compost organic waste',
        'Track your waste reduction daily'
      ]
    },
    {
      title: "Local Food Explorer",
      description: "Support local farmers and reduce transportation emissions by eating only locally sourced foods for 5 days.",
      type: 'local_food' as const,
      target: 5,
      unit: 'days',
      duration: 5,
      difficulty: 'easy' as const,
      points: 80,
      isActive: true,
      createdBy: 'system',
      instructions: [
        'Shop at local farmers markets',
        'Choose foods grown within 100 miles',
        'Discover seasonal local produce',
        'Support local food producers',
        'Track your local food choices'
      ]
    },
    {
      title: "Sustainable Seafood Week",
      description: "Choose only sustainable, responsibly sourced seafood options for 7 days to protect ocean ecosystems.",
      type: 'carbon_reduction' as const,
      target: 7,
      unit: 'days',
      duration: 7,
      difficulty: 'medium' as const,
      points: 130,
      isActive: true,
      createdBy: 'system',
      instructions: [
        'Research sustainable seafood options',
        'Check seafood sustainability guides',
        'Choose certified sustainable products',
        'Avoid overfished species',
        'Track your sustainable choices'
      ]
    }
  ];

  let createdCount = 0;
  
  defaultChallenges.forEach(challengeData => {
    try {
      const existingChallenges = localChallengeService.getActiveChallenges();
      const exists = existingChallenges.some(c => c.title === challengeData.title);
      
      if (!exists) {
        localChallengeService.createChallenge(challengeData);
        createdCount++;
        console.log(`✅ Created challenge: ${challengeData.title}`);
      } else {
        console.log(`⚠️ Challenge already exists: ${challengeData.title}`);
      }
    } catch (error) {
      console.error(`❌ Error creating challenge ${challengeData.title}:`, error);
    }
  });

  console.log(`🎉 Seeding complete! Created ${createdCount} new challenges.`);
  return createdCount;
};

export const seedSampleUsers = () => {
  console.log('👥 Seeding sample users for leaderboard...');

  const sampleUsers = [
    {
      uid: 'demo_user_1',
      email: 'alex.green@example.com',
      displayName: 'Alex Green',
      photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      stats: {
        totalPoints: 2450,
        totalMeals: 89,
        totalCO2Saved: 45.2,
        totalWaterSaved: 12500,
        challengesCompleted: 8,
        level: 25,
        streakDays: 12,
        achievements: ['first_meal', 'week_warrior', 'plant_power', 'water_saver']
      }
    },
    {
      uid: 'demo_user_2',
      email: 'maya.earth@example.com',
      displayName: 'Maya Earth',
      photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      stats: {
        totalPoints: 2100,
        totalMeals: 76,
        totalCO2Saved: 38.7,
        totalWaterSaved: 10200,
        challengesCompleted: 6,
        level: 21,
        streakDays: 8,
        achievements: ['first_meal', 'week_warrior', 'plant_power']
      }
    },
    {
      uid: 'demo_user_3',
      email: 'sam.sustainable@example.com',
      displayName: 'Sam Sustainable',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      stats: {
        totalPoints: 1850,
        totalMeals: 65,
        totalCO2Saved: 32.1,
        totalWaterSaved: 8900,
        challengesCompleted: 5,
        level: 19,
        streakDays: 15,
        achievements: ['first_meal', 'week_warrior']
      }
    },
    {
      uid: 'demo_user_4',
      email: 'eco.warrior@example.com',
      displayName: 'Eco Warrior',
      photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      stats: {
        totalPoints: 1650,
        totalMeals: 58,
        totalCO2Saved: 28.5,
        totalWaterSaved: 7800,
        challengesCompleted: 4,
        level: 17,
        streakDays: 6,
        achievements: ['first_meal']
      }
    },
    {
      uid: 'demo_user_5',
      email: 'green.thumb@example.com',
      displayName: 'Green Thumb',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      stats: {
        totalPoints: 1420,
        totalMeals: 52,
        totalCO2Saved: 24.8,
        totalWaterSaved: 6700,
        challengesCompleted: 3,
        level: 15,
        streakDays: 9,
        achievements: ['first_meal']
      }
    }
  ];

  let createdCount = 0;

  sampleUsers.forEach(userData => {
    try {
      const existingProfile = localProfileService.getUserProfile(userData.uid);

      if (!existingProfile) {
        localProfileService.createOrUpdateProfile(userData.uid, {
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL
        });

        // Update stats
        const profile = localProfileService.getUserProfile(userData.uid);
        if (profile) {
          profile.stats = userData.stats;
          localProfileService.updateProfile(userData.uid, profile);
        }

        createdCount++;
        console.log(`✅ Created sample user: ${userData.displayName}`);
      } else {
        console.log(`⚠️ Sample user already exists: ${userData.displayName}`);
      }
    } catch (error) {
      console.error(`❌ Error creating sample user ${userData.displayName}:`, error);
    }
  });

  console.log(`🎉 Sample users seeding complete! Created ${createdCount} new users.`);
  return createdCount;
};

export const clearAllData = () => {
  console.log('🧹 Clearing all local storage data...');
  
  // Clear all FoodPrint related data
  const keys = Object.keys(localStorage);
  const foodprintKeys = keys.filter(key => 
    key.startsWith('foodprint_') || 
    key.startsWith('meals_') || 
    key.startsWith('challenges_') ||
    key.startsWith('profiles_')
  );
  
  foodprintKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed: ${key}`);
  });
  
  console.log(`✅ Cleared ${foodprintKeys.length} items from local storage.`);
  return foodprintKeys.length;
};

export const getStorageStats = () => {
  const keys = Object.keys(localStorage);
  const foodprintKeys = keys.filter(key => 
    key.startsWith('foodprint_') || 
    key.startsWith('meals_') || 
    key.startsWith('challenges_') ||
    key.startsWith('profiles_')
  );
  
  const stats = {
    totalKeys: foodprintKeys.length,
    challenges: keys.filter(k => k.startsWith('challenges_')).length,
    meals: keys.filter(k => k.startsWith('meals_')).length,
    profiles: keys.filter(k => k.startsWith('profiles_')).length,
    other: keys.filter(k => k.startsWith('foodprint_')).length
  };
  
  console.log('📊 Storage Stats:', stats);
  return stats;
};
