// Local storage-based challenge system (no Firestore required)

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'carbon_reduction' | 'water_saving' | 'plant_based' | 'zero_waste' | 'local_food';
  category?: 'carbon' | 'water' | 'meals' | 'streak' | 'general';
  target: number;
  targetValue?: number; // Alternative name for target
  targetUnit?: string; // Alternative name for unit
  unit: string;
  duration: number; // days
  endDate?: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  participants: string[];
  instructions: string[];
  tips?: string[];
  rules?: string[];
  rewards?: {
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
  currentStreak: number;
  longestStreak: number;
  dailyProgress: { [date: string]: boolean };
}

class LocalChallengeService {
  private challengesKey = 'foodprint_challenges';
  private participationsKey = 'foodprint_participations';

  constructor() {
    this.initializeDefaultChallenges();
  }

  // Initialize with some default challenges
  private initializeDefaultChallenges(): void {
    const existingChallenges = this.getAllChallenges();
    if (existingChallenges.length === 0) {
      const defaultChallenges: Omit<Challenge, 'id' | 'createdAt' | 'participants'>[] = [
        {
          title: "Plant-Based Week",
          description: "Eat only plant-based meals for 7 days",
          type: "plant_based",
          target: 7,
          unit: "plant-based meals",
          duration: 7,
          difficulty: "medium",
          points: 150,
          isActive: true,
          createdBy: "system",
          instructions: [
            "Choose plant-based options for all meals",
            "Avoid meat, fish, and dairy products",
            "Focus on vegetables, fruits, grains, and legumes",
            "Track each plant-based meal in the app"
          ]
        },
        {
          title: "Carbon Footprint Reducer",
          description: "Reduce your daily carbon footprint to under 3kg CO₂",
          type: "carbon_reduction",
          target: 3,
          unit: "kg CO₂ per day",
          duration: 14,
          difficulty: "hard",
          points: 200,
          isActive: true,
          createdBy: "system",
          instructions: [
            "Track all your meals daily",
            "Choose low-carbon foods",
            "Aim for under 3kg CO₂ per day",
            "Maintain this for 14 consecutive days"
          ]
        },
        {
          title: "Water Warrior",
          description: "Save 500L of water through food choices this week",
          type: "water_saving",
          target: 500,
          unit: "liters saved",
          duration: 7,
          difficulty: "easy",
          points: 100,
          isActive: true,
          createdBy: "system",
          instructions: [
            "Choose water-efficient foods",
            "Reduce meat consumption",
            "Opt for local and seasonal produce",
            "Track your water savings daily"
          ]
        },
        {
          title: "Local Food Champion",
          description: "Eat locally sourced foods for 10 days",
          type: "local_food",
          target: 10,
          unit: "local meals",
          duration: 14,
          difficulty: "medium",
          points: 120,
          isActive: true,
          createdBy: "system",
          instructions: [
            "Choose foods grown within 100 miles",
            "Visit local farmers markets",
            "Support local restaurants",
            "Track local food consumption"
          ]
        },
        {
          title: "Zero Waste Meals",
          description: "Create 5 zero-waste meals using all ingredients",
          type: "zero_waste",
          target: 5,
          unit: "zero-waste meals",
          duration: 10,
          difficulty: "hard",
          points: 180,
          isActive: true,
          createdBy: "system",
          instructions: [
            "Use all parts of ingredients",
            "Minimize food packaging",
            "Compost organic waste",
            "Plan meals to avoid leftovers"
          ]
        }
      ];

      defaultChallenges.forEach(challenge => {
        this.createChallenge(challenge);
      });
    }
  }

  // Get all active challenges
  getActiveChallenges(): Challenge[] {
    return this.getAllChallenges()
      .filter(challenge => challenge.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get all challenges
  getAllChallenges(): Challenge[] {
    try {
      const challenges = localStorage.getItem(this.challengesKey);
      if (!challenges) return [];
      
      return JSON.parse(challenges).map((challenge: any) => ({
        ...challenge,
        createdAt: new Date(challenge.createdAt)
      }));
    } catch (error) {
      console.error('Error loading challenges:', error);
      return [];
    }
  }

  // Create a new challenge
  createChallenge(challengeData: Omit<Challenge, 'id' | 'createdAt' | 'participants'>): Challenge {
    try {
      const challenges = this.getAllChallenges();
      
      const newChallenge: Challenge = {
        ...challengeData,
        id: this.generateId(),
        createdAt: new Date(),
        participants: []
      };

      challenges.push(newChallenge);
      localStorage.setItem(this.challengesKey, JSON.stringify(challenges));
      
      console.log('✅ Challenge created:', newChallenge.title);
      return newChallenge;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw new Error('Failed to create challenge');
    }
  }

  // Join a challenge
  async joinChallenge(challengeId: string, userId: string): Promise<ChallengeParticipation> {
    try {
      // Check if already participating
      const existingParticipation = this.getUserChallengeParticipation(challengeId, userId);
      if (existingParticipation) {
        throw new Error('Already participating in this challenge');
      }

      // Add user to challenge participants
      const challenges = this.getAllChallenges();
      const challengeIndex = challenges.findIndex(c => c.id === challengeId);
      if (challengeIndex === -1) {
        throw new Error('Challenge not found');
      }

      challenges[challengeIndex].participants.push(userId);
      localStorage.setItem(this.challengesKey, JSON.stringify(challenges));

      // Create participation record
      const participation: ChallengeParticipation = {
        id: this.generateId(),
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

      const participations = this.getAllParticipations();
      participations.push(participation);
      localStorage.setItem(this.participationsKey, JSON.stringify(participations));

      console.log('✅ Joined challenge:', challenges[challengeIndex].title);
      return participation;
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  }

  // Get user's participation in a specific challenge
  getUserChallengeParticipation(challengeId: string, userId: string): ChallengeParticipation | null {
    try {
      const participations = this.getAllParticipations();
      const participation = participations.find(
        p => p.challengeId === challengeId && p.userId === userId
      );
      return participation || null;
    } catch (error) {
      console.error('Error getting user participation:', error);
      return null;
    }
  }

  // Get all user's participations
  getUserParticipations(userId: string): ChallengeParticipation[] {
    try {
      return this.getAllParticipations()
        .filter(p => p.userId === userId)
        .sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime());
    } catch (error) {
      console.error('Error getting user participations:', error);
      return [];
    }
  }

  // Update challenge progress
  updateChallengeProgress(participationId: string, newValue: number): void {
    try {
      const participations = this.getAllParticipations();
      const participationIndex = participations.findIndex(p => p.id === participationId);
      
      if (participationIndex === -1) {
        throw new Error('Participation not found');
      }

      const participation = participations[participationIndex];
      const challenge = this.getAllChallenges().find(c => c.id === participation.challengeId);
      
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Update progress
      participation.currentValue = newValue;
      participation.progress = Math.min((newValue / challenge.target) * 100, 100);
      participation.isCompleted = participation.progress >= 100;

      // Update daily progress
      const today = new Date().toISOString().split('T')[0];
      participation.dailyProgress[today] = true;

      // Update streaks
      this.updateStreaks(participation);

      participations[participationIndex] = participation;
      localStorage.setItem(this.participationsKey, JSON.stringify(participations));

      console.log('✅ Challenge progress updated:', participation.progress + '%');
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  }

  // Get challenge by ID
  getChallengeById(challengeId: string): Challenge | null {
    try {
      const challenges = this.getAllChallenges();
      return challenges.find(c => c.id === challengeId) || null;
    } catch (error) {
      console.error('Error getting challenge by ID:', error);
      return null;
    }
  }

  // Private helper methods
  private getAllParticipations(): ChallengeParticipation[] {
    try {
      const participations = localStorage.getItem(this.participationsKey);
      if (!participations) return [];
      
      return JSON.parse(participations).map((p: any) => ({
        ...p,
        joinedAt: new Date(p.joinedAt)
      }));
    } catch (error) {
      console.error('Error loading participations:', error);
      return [];
    }
  }

  private updateStreaks(participation: ChallengeParticipation): void {
    const dates = Object.keys(participation.dailyProgress).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < dates.length; i++) {
      if (participation.dailyProgress[dates[i]]) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
        if (i === dates.length - 1) {
          currentStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    participation.currentStreak = currentStreak;
    participation.longestStreak = longestStreak;
  }

  // Update daily progress for a user's challenge participation
  updateDailyProgress(challengeId: string, userId: string, dateKey: string, completed: boolean): void {
    try {
      const participations = this.getAllParticipations();
      const participationIndex = participations.findIndex(
        p => p.challengeId === challengeId && p.userId === userId
      );

      if (participationIndex === -1) {
        throw new Error('Participation not found');
      }

      // Update the daily progress
      if (!participations[participationIndex].dailyProgress) {
        participations[participationIndex].dailyProgress = {};
      }
      participations[participationIndex].dailyProgress[dateKey] = completed;

      // Save back to localStorage
      localStorage.setItem(this.participationsKey, JSON.stringify(participations));

      console.log('✅ Daily progress updated:', {
        challengeId,
        userId,
        dateKey,
        completed
      });
    } catch (error) {
      console.error('Error updating daily progress:', error);
      throw error;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all data (for testing)
  clearAllData(): void {
    localStorage.removeItem(this.challengesKey);
    localStorage.removeItem(this.participationsKey);
    console.log('🗑️ All challenge data cleared');
  }
}

export const localChallengeService = new LocalChallengeService();
