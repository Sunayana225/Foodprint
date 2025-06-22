import { challengeService } from '../services/challengeService';

export const sampleChallenges = [
  {
    title: 'Plant-Based Power Week',
    description: 'Try to eat at least one plant-based meal every day for a week. Reduce your carbon footprint while exploring delicious vegetarian and vegan options.',
    type: 'weekly' as const,
    category: 'meals' as const,
    difficulty: 'Easy' as const,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    targetValue: 7,
    targetUnit: 'plant-based meals',
    points: 150,
    createdBy: 'system',
    isActive: true,
    rules: [
      'Eat at least one plant-based meal per day',
      'Track your meals in the app',
      'Share your favorite plant-based recipe (optional)'
    ],
    instructions: [
      'Plan your plant-based meals in advance using the FoodPrint recipe generator',
      'Log each plant-based meal in the app with a photo',
      'Try different cuisines - Mediterranean, Asian, Mexican all have great plant-based options',
      'Track your daily progress in the challenge dashboard',
      'Share your favorite recipes with the community for bonus points'
    ],
    tips: [
      'Start with "Meatless Monday" to ease into the challenge',
      'Stock up on legumes, nuts, and seeds for protein',
      'Explore plant-based versions of your favorite dishes',
      'Join the community forum for recipe inspiration and support'
    ],
    rewards: {
      points: 150,
      badge: 'Plant Pioneer',
      title: 'Veggie Warrior'
    }
  },
  {
    title: 'Zero Waste Weekend',
    description: 'Challenge yourself to produce zero food waste over the weekend. Plan your meals, use leftovers creatively, and compost scraps.',
    type: 'weekly' as const,
    category: 'general' as const,
    difficulty: 'Medium' as const,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    targetValue: 2,
    targetUnit: 'zero-waste days',
    points: 200,
    createdBy: 'system',
    isActive: true,
    rules: [
      'Produce zero food waste for 2 consecutive days',
      'Document your waste reduction strategies',
      'Compost any unavoidable organic waste'
    ],
    rewards: {
      points: 200,
      badge: 'Waste Warrior',
      title: 'Zero Hero'
    }
  },
  {
    title: 'Local Food Champion',
    description: 'Support local farmers and reduce transportation emissions by eating only locally sourced foods for a week.',
    type: 'weekly' as const,
    category: 'carbon' as const,
    difficulty: 'Hard' as const,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    targetValue: 21,
    targetUnit: 'local meals',
    points: 300,
    createdBy: 'system',
    isActive: true,
    rules: [
      'All meals must use locally sourced ingredients (within 100 miles)',
      'Visit local farmers markets or farm stores',
      'Document the local sources of your food'
    ],
    rewards: {
      points: 300,
      badge: 'Local Legend',
      title: 'Community Champion'
    }
  },
  {
    title: 'Water Conservation Master',
    description: 'Reduce your food-related water footprint by choosing water-efficient foods and cooking methods for 30 days.',
    type: 'monthly' as const,
    category: 'water' as const,
    difficulty: 'Medium' as const,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    targetValue: 5000,
    targetUnit: 'liters saved',
    points: 500,
    createdBy: 'system',
    isActive: true,
    rules: [
      'Choose foods with lower water footprints',
      'Use water-efficient cooking methods',
      'Track your water savings in the app',
      'Maintain this for 30 consecutive days'
    ],
    rewards: {
      points: 500,
      badge: 'Water Guardian',
      title: 'Hydro Hero'
    }
  },
  {
    title: 'Meatless Monday Marathon',
    description: 'Join thousands of people worldwide in going meatless every Monday for a month. Small changes, big impact!',
    type: 'monthly' as const,
    category: 'carbon' as const,
    difficulty: 'Easy' as const,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    targetValue: 4,
    targetUnit: 'meatless Mondays',
    points: 250,
    createdBy: 'system',
    isActive: true,
    rules: [
      'No meat consumption on Mondays',
      'Try new plant-based recipes',
      'Share your Monday meals on social media (optional)',
      'Complete all 4 Mondays in the month'
    ],
    rewards: {
      points: 250,
      badge: 'Monday Master',
      title: 'Meatless Maven'
    }
  },
  {
    title: 'Seasonal Eating Specialist',
    description: 'Eat only seasonal, in-season produce for two weeks. Discover the flavors of each season while reducing environmental impact.',
    type: 'weekly' as const,
    category: 'carbon' as const,
    difficulty: 'Medium' as const,
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    targetValue: 14,
    targetUnit: 'seasonal days',
    points: 350,
    createdBy: 'system',
    isActive: true,
    rules: [
      'Only eat fruits and vegetables that are in season',
      'Research what\'s seasonal in your area',
      'Try at least 3 new seasonal recipes',
      'Maintain this for 14 consecutive days'
    ],
    rewards: {
      points: 350,
      badge: 'Seasonal Sage',
      title: 'Nature\'s Calendar Keeper'
    }
  },
  {
    title: 'Daily Eco Streak',
    description: 'Make one eco-friendly food choice every day for 30 days. Build sustainable habits that last!',
    type: 'monthly' as const,
    category: 'streak' as const,
    difficulty: 'Easy' as const,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    targetValue: 30,
    targetUnit: 'eco-friendly days',
    points: 400,
    createdBy: 'system',
    isActive: true,
    rules: [
      'Make at least one eco-friendly food choice daily',
      'Log your choice in the app',
      'Choices can include: plant-based meals, local food, reduced packaging, etc.',
      'Maintain streak for 30 consecutive days'
    ],
    rewards: {
      points: 400,
      badge: 'Streak Master',
      title: 'Consistency Champion'
    }
  }
];

export const seedChallenges = async () => {
  try {
    console.log('🌱 Seeding challenges...');

    for (const challenge of sampleChallenges) {
      try {
        const challengeId = await challengeService.createChallenge(challenge);
        console.log(`✅ Created challenge: ${challenge.title} (ID: ${challengeId})`);
      } catch (error) {
        console.error(`❌ Failed to create challenge: ${challenge.title}`, error);
      }
    }

    console.log('🎉 Challenge seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
  }
};

// Function to create a single challenge for testing
export const createTestChallenge = async () => {
  const testChallenge = sampleChallenges[0]; // Plant-Based Power Week
  try {
    const challengeId = await challengeService.createChallenge(testChallenge);
    console.log(`✅ Test challenge created: ${testChallenge.title} (ID: ${challengeId})`);
    return challengeId;
  } catch (error) {
    console.error('❌ Failed to create test challenge:', error);
    throw error;
  }
};
