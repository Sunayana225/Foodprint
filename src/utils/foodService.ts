// axios import removed - using fetch API instead
import type { FoodItem, Recipe, HealthAnalysis } from '../types/food'

// Enhanced food database with health information
const enhancedFoodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'Beef (100g)',
    category: 'Meat',
    co2: 60.0,
    water: 15000,
    land: 164,
    calories: 250,
    protein: 26,
    fat: 15,
    carbs: 0,
    healthRisk: 'high',
    healthWarnings: [
      'High in saturated fat',
      'Linked to increased risk of heart disease',
      'High environmental impact',
      'May increase cancer risk when processed'
    ],
    alternatives: ['Chicken breast', 'Turkey', 'Tofu', 'Lentils', 'Mushrooms']
  },
  {
    id: '2',
    name: 'Chicken (100g)',
    category: 'Meat',
    co2: 6.9,
    water: 4325,
    land: 7.5,
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbs: 0,
    healthRisk: 'medium',
    healthWarnings: [
      'Risk of salmonella if undercooked',
      'May contain antibiotics'
    ],
    alternatives: ['Turkey', 'Fish', 'Tofu', 'Tempeh']
  },
  {
    id: '3',
    name: 'Salmon (100g)',
    category: 'Fish',
    co2: 11.9,
    water: 3000,
    land: 3.2,
    calories: 208,
    protein: 25,
    fat: 12,
    carbs: 0,
    healthRisk: 'low',
    healthWarnings: [
      'May contain mercury',
      'Farm-raised may have contaminants'
    ],
    alternatives: ['Sardines', 'Mackerel', 'Plant-based omega-3 sources']
  },
  {
    id: '4',
    name: 'Tofu (100g)',
    category: 'Plant Protein',
    co2: 3.2,
    water: 2500,
    land: 2.2,
    calories: 144,
    protein: 17,
    fat: 9,
    carbs: 3,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Tempeh', 'Seitan', 'Legumes']
  },
  {
    id: '5',
    name: 'Lentils (100g)',
    category: 'Legumes',
    co2: 0.9,
    water: 5000,
    land: 3.4,
    calories: 353,
    protein: 25,
    fat: 1,
    carbs: 60,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Chickpeas', 'Black beans', 'Quinoa']
  },
  {
    id: '6',
    name: 'White Rice (100g)',
    category: 'Grains',
    co2: 4.0,
    water: 2500,
    land: 2.8,
    calories: 365,
    protein: 7,
    fat: 1,
    carbs: 80,
    healthRisk: 'medium',
    healthWarnings: [
      'High glycemic index',
      'Low in fiber',
      'May spike blood sugar'
    ],
    alternatives: ['Brown rice', 'Quinoa', 'Cauliflower rice', 'Barley']
  },
  {
    id: '7',
    name: 'Quinoa (100g)',
    category: 'Grains',
    co2: 5.9,
    water: 5000,
    land: 4.1,
    calories: 368,
    protein: 14,
    fat: 6,
    carbs: 64,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Brown rice', 'Millet', 'Buckwheat']
  },
  {
    id: '8',
    name: 'Avocado (1 medium)',
    category: 'Fruit',
    co2: 1.3,
    water: 320,
    land: 1.3,
    calories: 234,
    protein: 3,
    fat: 21,
    carbs: 12,
    healthRisk: 'low',
    healthWarnings: [
      'High in calories',
      'High water usage for production'
    ],
    alternatives: ['Olive oil', 'Nuts', 'Seeds']
  },
  {
    id: '9',
    name: 'Spinach (100g)',
    category: 'Vegetables',
    co2: 0.4,
    water: 370,
    land: 0.2,
    calories: 23,
    protein: 3,
    fat: 0,
    carbs: 4,
    healthRisk: 'low',
    healthWarnings: [
      'High in oxalates',
      'May interfere with calcium absorption'
    ],
    alternatives: ['Kale', 'Swiss chard', 'Arugula']
  },
  {
    id: '10',
    name: 'Tomatoes (100g)',
    category: 'Vegetables',
    co2: 2.1,
    water: 214,
    land: 0.4,
    calories: 18,
    protein: 1,
    fat: 0,
    carbs: 4,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Bell peppers', 'Cucumbers', 'Zucchini']
  },
  // Indian Foods
  {
    id: '11',
    name: 'Idli (2 pieces)',
    category: 'Indian Breakfast',
    co2: 1.2,
    water: 800,
    land: 1.5,
    calories: 120,
    protein: 4,
    fat: 0.5,
    carbs: 24,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Dosa', 'Upma', 'Poha']
  },
  {
    id: '12',
    name: 'Dosa (1 medium)',
    category: 'Indian Breakfast',
    co2: 1.8,
    water: 1200,
    land: 2.0,
    calories: 168,
    protein: 4,
    fat: 3,
    carbs: 32,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Idli', 'Uttapam', 'Roti']
  },
  {
    id: '13',
    name: 'Dal (100g)',
    category: 'Indian Curry',
    co2: 0.9,
    water: 4055,
    land: 3.4,
    calories: 116,
    protein: 9,
    fat: 0.4,
    carbs: 20,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Sambar', 'Rajma', 'Chole']
  },
  {
    id: '14',
    name: 'Roti/Chapati (1 piece)',
    category: 'Indian Bread',
    co2: 0.7,
    water: 365,
    land: 0.8,
    calories: 104,
    protein: 3,
    fat: 0.4,
    carbs: 22,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Brown bread', 'Multigrain roti', 'Quinoa']
  },
  {
    id: '15',
    name: 'Basmati Rice (100g cooked)',
    category: 'Indian Grains',
    co2: 2.7,
    water: 2497,
    land: 2.9,
    calories: 121,
    protein: 3,
    fat: 0.3,
    carbs: 25,
    healthRisk: 'medium',
    healthWarnings: ['High glycemic index', 'May spike blood sugar'],
    alternatives: ['Brown rice', 'Quinoa', 'Millets']
  },
  {
    id: '16',
    name: 'Paneer (100g)',
    category: 'Indian Dairy',
    co2: 8.5,
    water: 2500,
    land: 6.2,
    calories: 265,
    protein: 18,
    fat: 20,
    carbs: 1.2,
    healthRisk: 'medium',
    healthWarnings: ['High in saturated fat', 'High calorie content'],
    alternatives: ['Tofu', 'Cottage cheese', 'Greek yogurt']
  },
  {
    id: '17',
    name: 'Samosa (1 piece)',
    category: 'Indian Snacks',
    co2: 2.5,
    water: 800,
    land: 1.8,
    calories: 262,
    protein: 5,
    fat: 17,
    carbs: 24,
    healthRisk: 'high',
    healthWarnings: ['Deep fried', 'High in trans fats', 'High calorie content'],
    alternatives: ['Baked samosa', 'Dhokla', 'Idli']
  },
  {
    id: '18',
    name: 'Curd/Yogurt (100g)',
    category: 'Indian Dairy',
    co2: 2.2,
    water: 700,
    land: 1.5,
    calories: 60,
    protein: 3.5,
    fat: 3.3,
    carbs: 4.7,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Greek yogurt', 'Coconut yogurt', 'Almond yogurt']
  },
  {
    id: '19',
    name: 'Rajma (100g)',
    category: 'Indian Curry',
    co2: 1.1,
    water: 4200,
    land: 3.6,
    calories: 140,
    protein: 8.7,
    fat: 0.5,
    carbs: 23,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Dal', 'Chole', 'Black beans']
  },
  {
    id: '20',
    name: 'Poha (100g)',
    category: 'Indian Breakfast',
    co2: 1.5,
    water: 1200,
    land: 1.8,
    calories: 158,
    protein: 2,
    fat: 0.2,
    carbs: 34,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Upma', 'Oats', 'Quinoa flakes']
  },
  // More Indian Vegetables
  {
    id: '21',
    name: 'Brinjal/Eggplant (100g)',
    category: 'Indian Vegetables',
    co2: 0.3,
    water: 237,
    land: 0.2,
    calories: 25,
    protein: 1,
    fat: 0.2,
    carbs: 6,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Zucchini', 'Bell peppers', 'Okra']
  },
  {
    id: '22',
    name: 'Okra/Bhindi (100g)',
    category: 'Indian Vegetables',
    co2: 0.4,
    water: 180,
    land: 0.3,
    calories: 33,
    protein: 1.9,
    fat: 0.2,
    carbs: 7,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Green beans', 'Asparagus', 'Broccoli']
  },
  {
    id: '23',
    name: 'Cauliflower/Gobi (100g)',
    category: 'Indian Vegetables',
    co2: 0.4,
    water: 285,
    land: 0.3,
    calories: 25,
    protein: 1.9,
    fat: 0.3,
    carbs: 5,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Broccoli', 'Cabbage', 'Brussels sprouts']
  },
  {
    id: '24',
    name: 'Potato/Aloo (100g)',
    category: 'Indian Vegetables',
    co2: 0.3,
    water: 287,
    land: 0.3,
    calories: 77,
    protein: 2,
    fat: 0.1,
    carbs: 17,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Sweet potato', 'Turnip', 'Radish']
  },
  {
    id: '25',
    name: 'Onion/Pyaz (100g)',
    category: 'Indian Vegetables',
    co2: 0.3,
    water: 280,
    land: 0.2,
    calories: 40,
    protein: 1.1,
    fat: 0.1,
    carbs: 9,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Shallots', 'Leeks', 'Garlic']
  },
  // More Indian Spices & Herbs
  {
    id: '26',
    name: 'Ginger/Adrak (100g)',
    category: 'Indian Spices',
    co2: 0.2,
    water: 150,
    land: 0.1,
    calories: 80,
    protein: 1.8,
    fat: 0.8,
    carbs: 18,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Turmeric', 'Garlic', 'Galangal']
  },
  {
    id: '27',
    name: 'Garlic/Lehsun (100g)',
    category: 'Indian Spices',
    co2: 0.4,
    water: 370,
    land: 0.2,
    calories: 149,
    protein: 6.4,
    fat: 0.5,
    carbs: 33,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Ginger', 'Onion powder', 'Asafoetida']
  },
  // More Indian Grains & Legumes
  {
    id: '28',
    name: 'Chickpeas/Chana (100g)',
    category: 'Indian Legumes',
    co2: 0.4,
    water: 4177,
    land: 3.4,
    calories: 164,
    protein: 8.9,
    fat: 2.6,
    carbs: 27,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Lentils', 'Black beans', 'Kidney beans']
  },
  {
    id: '29',
    name: 'Green Peas/Matar (100g)',
    category: 'Indian Vegetables',
    co2: 0.4,
    water: 370,
    land: 0.4,
    calories: 81,
    protein: 5.4,
    fat: 0.4,
    carbs: 14,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Green beans', 'Edamame', 'Lima beans']
  },
  {
    id: '30',
    name: 'Spinach/Palak (100g)',
    category: 'Indian Vegetables',
    co2: 0.4,
    water: 370,
    land: 0.2,
    calories: 23,
    protein: 2.9,
    fat: 0.4,
    carbs: 3.6,
    healthRisk: 'low',
    healthWarnings: ['High in oxalates'],
    alternatives: ['Kale', 'Swiss chard', 'Lettuce']
  },
  // International Foods
  {
    id: '31',
    name: 'Pasta (100g cooked)',
    category: 'International Grains',
    co2: 1.1,
    water: 1849,
    land: 1.2,
    calories: 131,
    protein: 5,
    fat: 1.1,
    carbs: 25,
    healthRisk: 'medium',
    healthWarnings: ['High glycemic index', 'Refined carbohydrates'],
    alternatives: ['Whole wheat pasta', 'Zucchini noodles', 'Quinoa pasta']
  },
  {
    id: '32',
    name: 'Bread (1 slice)',
    category: 'International Grains',
    co2: 0.5,
    water: 40,
    land: 0.3,
    calories: 79,
    protein: 2.7,
    fat: 1.2,
    carbs: 14,
    healthRisk: 'medium',
    healthWarnings: ['Refined flour', 'May contain preservatives'],
    alternatives: ['Whole grain bread', 'Sourdough', 'Roti']
  },
  {
    id: '33',
    name: 'Cheese (100g)',
    category: 'International Dairy',
    co2: 13.5,
    water: 3178,
    land: 8.9,
    calories: 402,
    protein: 25,
    fat: 33,
    carbs: 1.3,
    healthRisk: 'high',
    healthWarnings: ['High in saturated fat', 'High sodium', 'High calories'],
    alternatives: ['Nutritional yeast', 'Cashew cheese', 'Tofu']
  },
  {
    id: '34',
    name: 'Eggs (1 large)',
    category: 'International Protein',
    co2: 4.2,
    water: 196,
    land: 3.5,
    calories: 70,
    protein: 6,
    fat: 5,
    carbs: 0.6,
    healthRisk: 'low',
    healthWarnings: ['High cholesterol'],
    alternatives: ['Tofu scramble', 'Chickpea flour', 'Flax eggs']
  },
  {
    id: '35',
    name: 'Milk (1 cup)',
    category: 'International Dairy',
    co2: 3.2,
    water: 1000,
    land: 9,
    calories: 149,
    protein: 8,
    fat: 8,
    carbs: 12,
    healthRisk: 'medium',
    healthWarnings: ['Lactose intolerance', 'Hormones'],
    alternatives: ['Almond milk', 'Oat milk', 'Soy milk']
  },
  {
    id: '36',
    name: 'Almonds (100g)',
    category: 'Nuts & Seeds',
    co2: 8.8,
    water: 16194,
    land: 4.6,
    calories: 579,
    protein: 21,
    fat: 50,
    carbs: 22,
    healthRisk: 'low',
    healthWarnings: ['High water usage', 'High calories'],
    alternatives: ['Walnuts', 'Sunflower seeds', 'Pumpkin seeds']
  },
  {
    id: '37',
    name: 'Bananas (1 medium)',
    category: 'Fruits',
    co2: 0.5,
    water: 160,
    land: 1.9,
    calories: 105,
    protein: 1.3,
    fat: 0.4,
    carbs: 27,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Apples', 'Oranges', 'Berries']
  },
  {
    id: '38',
    name: 'Apples (1 medium)',
    category: 'Fruits',
    co2: 0.4,
    water: 125,
    land: 0.6,
    calories: 95,
    protein: 0.5,
    fat: 0.3,
    carbs: 25,
    healthRisk: 'low',
    healthWarnings: ['Pesticide residue if not organic'],
    alternatives: ['Pears', 'Oranges', 'Berries']
  },
  {
    id: '39',
    name: 'Broccoli (100g)',
    category: 'Vegetables',
    co2: 0.4,
    water: 285,
    land: 0.3,
    calories: 34,
    protein: 2.8,
    fat: 0.4,
    carbs: 7,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Cauliflower', 'Brussels sprouts', 'Kale']
  },
  {
    id: '40',
    name: 'Sweet Potato (100g)',
    category: 'Vegetables',
    co2: 0.3,
    water: 381,
    land: 0.5,
    calories: 86,
    protein: 1.6,
    fat: 0.1,
    carbs: 20,
    healthRisk: 'low',
    healthWarnings: [],
    alternatives: ['Regular potato', 'Butternut squash', 'Carrots']
  }
]

// Food API service
class FoodService {
  // Using completely FREE APIs
  private openFoodFactsURL = 'https://world.openfoodfacts.net/api/v2'
  private openFoodFactsAuth = 'Basic ' + btoa('off:off') // Standard auth for Open Food Facts

  // Note: We primarily use our comprehensive local database
  // External APIs provide additional product scanning capabilities

  // Legacy Edamam config (commented out - using free alternatives)
  // private baseURL = 'https://api.edamam.com/api/food-database/v2'
  // private appId = 'demo' // Replace with actual API key
  // private appKey = 'demo' // Replace with actual API key

  // Enhanced search with filters and sorting
  async searchFoods(query: string, filters?: {
    category?: string;
    maxCO2?: number;
    maxCalories?: number;
    healthRisk?: 'low' | 'medium' | 'high';
    sortBy?: 'relevance' | 'co2' | 'calories' | 'protein';
  }): Promise<FoodItem[]> {
    try {
      // Search local database first (comprehensive and fast)
      let localResults = enhancedFoodDatabase.filter(food =>
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        food.category.toLowerCase().includes(query.toLowerCase())
      )

      // Apply filters
      if (filters) {
        localResults = this.applyFilters(localResults, filters)
      }

      // If we have good local results, return them
      if (localResults.length >= 5) {
        return this.sortResults(localResults, filters?.sortBy || 'relevance').slice(0, 10)
      }

      // If limited local results, enhance with Open Food Facts
      let combinedResults = [...localResults]

      try {
        const externalResults = await this.searchOpenFoodFacts(query)
        combinedResults = [...combinedResults, ...externalResults]
      } catch (error) {
        console.log('External search unavailable, using local results only')
      }

      // Apply filters to combined results
      if (filters) {
        combinedResults = this.applyFilters(combinedResults, filters)
      }

      if (combinedResults.length > 0) {
        return this.sortResults(combinedResults, filters?.sortBy || 'relevance').slice(0, 10)
      }

      // If no exact matches, try partial matches in local database
      let partialResults = enhancedFoodDatabase.filter(food =>
        query.toLowerCase().split(' ').some(word =>
          food.name.toLowerCase().includes(word) ||
          food.category.toLowerCase().includes(word)
        )
      )

      if (filters) {
        partialResults = this.applyFilters(partialResults, filters)
      }

      return partialResults.length > 0 ?
        this.sortResults(partialResults, filters?.sortBy || 'relevance').slice(0, 8) :
        this.sortResults(enhancedFoodDatabase.slice(0, 6), filters?.sortBy || 'relevance')
    } catch (error) {
      console.error('Error searching foods:', error)
      return enhancedFoodDatabase.slice(0, 6)
    }
  }

  // Apply filters to food results
  private applyFilters(foods: FoodItem[], filters: {
    category?: string;
    maxCO2?: number;
    maxCalories?: number;
    healthRisk?: 'low' | 'medium' | 'high';
  }): FoodItem[] {
    return foods.filter(food => {
      if (filters.category && food.category !== filters.category) return false
      if (filters.maxCO2 && food.co2 > filters.maxCO2) return false
      if (filters.maxCalories && food.calories && food.calories > filters.maxCalories) return false
      if (filters.healthRisk && food.healthRisk !== filters.healthRisk) return false
      return true
    })
  }

  // Sort food results
  private sortResults(foods: FoodItem[], sortBy: string): FoodItem[] {
    switch (sortBy) {
      case 'co2':
        return foods.sort((a, b) => a.co2 - b.co2)
      case 'calories':
        return foods.sort((a, b) => (a.calories || 0) - (b.calories || 0))
      case 'protein':
        return foods.sort((a, b) => (b.protein || 0) - (a.protein || 0))
      case 'relevance':
      default:
        return foods // Keep original order for relevance
    }
  }

  // Get foods by category
  getFoodsByCategory(category: string): FoodItem[] {
    return enhancedFoodDatabase.filter(food =>
      food.category.toLowerCase().includes(category.toLowerCase())
    )
  }

  // Get nutrition summary for multiple foods
  getNutritionSummary(foods: FoodItem[]): {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalCO2: number;
    totalWater: number;
    averageHealthRisk: string;
  } {
    const totals = foods.reduce((acc, food) => ({
      calories: acc.calories + (food.calories || 0),
      protein: acc.protein + (food.protein || 0),
      carbs: acc.carbs + (food.carbs || 0),
      fat: acc.fat + (food.fat || 0),
      co2: acc.co2 + food.co2,
      water: acc.water + food.water
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, co2: 0, water: 0 })

    // Calculate average health risk
    const riskScores = foods.map(food => {
      switch (food.healthRisk) {
        case 'low': return 1
        case 'medium': return 2
        case 'high': return 3
        default: return 1
      }
    })
    const avgRiskScore = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length
    const averageHealthRisk = avgRiskScore <= 1.5 ? 'low' : avgRiskScore <= 2.5 ? 'medium' : 'high'

    return {
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein * 10) / 10,
      totalCarbs: Math.round(totals.carbs * 10) / 10,
      totalFat: Math.round(totals.fat * 10) / 10,
      totalCO2: Math.round(totals.co2 * 10) / 10,
      totalWater: Math.round(totals.water),
      averageHealthRisk
    }
  }

  // Search Open Food Facts (completely free, no API key needed)
  async searchOpenFoodFacts(query: string): Promise<FoodItem[]> {
    try {
      const response = await fetch(`${this.openFoodFactsURL}/search?search_terms=${encodeURIComponent(query)}&page_size=5`, {
        method: 'GET',
        headers: {
          'Authorization': this.openFoodFactsAuth,
          'User-Agent': 'FoodPrint-App/1.0'
        }
      })

      const data = await response.json()

      if (data.products && data.products.length > 0) {
        return data.products.map((product: any) => this.convertOpenFoodFactsProduct(product))
      }

      return []
    } catch (error) {
      console.log('Open Food Facts search not available, using local database')
      return []
    }
  }

  // Barcode scanning using Open Food Facts (free) - Updated to v2 API
  async scanBarcode(barcode: string): Promise<FoodItem | null> {
    try {
      const response = await fetch(`${this.openFoodFactsURL}/product/${barcode}`, {
        method: 'GET',
        headers: {
          'Authorization': this.openFoodFactsAuth,
          'User-Agent': 'FoodPrint-App/1.0'
        }
      })

      const data = await response.json()

      if (data.status === 'success' && data.product) {
        // Convert Open Food Facts data to our format
        return this.convertOpenFoodFactsProduct(data.product)
      }
      return null
    } catch (error) {
      console.log('Barcode scanning not available:', error)
      return null
    }
  }

  private convertOpenFoodFactsProduct(product: any): FoodItem {
    // Convert Open Food Facts product to our FoodItem format
    // Add estimated environmental data since OFF doesn't have it
    const categories = product.categories || product.categories_tags?.join(',') || ''
    const productName = product.product_name || product.product_name_en || 'Unknown Product'

    // Get nutrition data (handle both v1 and v2 API formats)
    const nutriments = product.nutriments || {}

    return {
      id: `off_${product.code || Date.now()}`,
      name: productName,
      category: this.extractMainCategory(categories),
      calories: Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0),
      protein: Math.round((nutriments.proteins_100g || nutriments.proteins || 0) * 10) / 10,
      carbs: Math.round((nutriments.carbohydrates_100g || nutriments.carbohydrates || 0) * 10) / 10,
      fat: Math.round((nutriments.fat_100g || nutriments.fat || 0) * 10) / 10,
      // Note: fiber and sugar not included in FoodItem interface
      // fiber: Math.round((nutriments.fiber_100g || nutriments.fiber || 0) * 10) / 10,
      // sugar: Math.round((nutriments.sugars_100g || nutriments.sugars || 0) * 10) / 10,
      // sodium: Math.round((nutriments.sodium_100g || nutriments.sodium || 0) * 10) / 10,
      co2: this.estimateCO2FromCategory(categories),
      water: this.estimateWaterFromCategory(categories),
      land: this.estimateLandFromCategory(categories),
      healthRisk: this.assessHealthRisk(nutriments, product.ingredients_text || ''),
      image: product.image_url || product.image_front_url || '',
      alternatives: []
    }
  }

  private extractMainCategory(categories: string): string {
    if (!categories) return 'Other'

    const categoryList = categories.toLowerCase().split(',').map(c => c.trim())

    // Map to our standard categories
    if (categoryList.some(c => c.includes('fruit'))) return 'Fruits'
    if (categoryList.some(c => c.includes('vegetable'))) return 'Vegetables'
    if (categoryList.some(c => c.includes('meat') || c.includes('poultry'))) return 'Meat'
    if (categoryList.some(c => c.includes('fish') || c.includes('seafood'))) return 'Seafood'
    if (categoryList.some(c => c.includes('dairy') || c.includes('milk') || c.includes('cheese'))) return 'Dairy'
    if (categoryList.some(c => c.includes('grain') || c.includes('cereal') || c.includes('bread'))) return 'Grains'
    if (categoryList.some(c => c.includes('legume') || c.includes('bean') || c.includes('lentil'))) return 'Legumes'
    if (categoryList.some(c => c.includes('nut') || c.includes('seed'))) return 'Nuts & Seeds'
    if (categoryList.some(c => c.includes('beverage') || c.includes('drink'))) return 'Beverages'

    return 'Other'
  }

  private assessHealthRisk(nutriments: any, ingredients: string): 'low' | 'medium' | 'high' {
    let riskScore = 0

    // High sodium
    if ((nutriments.sodium_100g || 0) > 600) riskScore += 2
    else if ((nutriments.sodium_100g || 0) > 300) riskScore += 1

    // High sugar
    if ((nutriments.sugars_100g || 0) > 15) riskScore += 2
    else if ((nutriments.sugars_100g || 0) > 10) riskScore += 1

    // High saturated fat
    if ((nutriments['saturated-fat_100g'] || 0) > 5) riskScore += 1

    // Processed ingredients
    if (ingredients.toLowerCase().includes('preservative') ||
        ingredients.toLowerCase().includes('artificial') ||
        ingredients.toLowerCase().includes('e1') ||
        ingredients.toLowerCase().includes('e2') ||
        ingredients.toLowerCase().includes('e3')) {
      riskScore += 1
    }

    if (riskScore >= 4) return 'high'
    if (riskScore >= 2) return 'medium'
    return 'low'
  }

  private estimateCO2FromCategory(categories: string): number {
    const categoryLower = categories.toLowerCase()
    if (categoryLower.includes('meat') || categoryLower.includes('beef')) return 15
    if (categoryLower.includes('dairy') || categoryLower.includes('cheese')) return 8
    if (categoryLower.includes('fish')) return 6
    if (categoryLower.includes('vegetable') || categoryLower.includes('fruit')) return 2
    return 4 // Default estimate
  }

  private estimateWaterFromCategory(categories: string): number {
    const categoryLower = categories.toLowerCase()
    if (categoryLower.includes('meat') || categoryLower.includes('beef')) return 8000
    if (categoryLower.includes('dairy')) return 3000
    if (categoryLower.includes('fruit')) return 1500
    if (categoryLower.includes('vegetable')) return 1000
    return 2000 // Default estimate
  }

  private estimateLandFromCategory(categories: string): number {
    const categoryLower = categories.toLowerCase()
    if (categoryLower.includes('meat') || categoryLower.includes('beef')) return 20
    if (categoryLower.includes('dairy')) return 8
    if (categoryLower.includes('fish')) return 3
    if (categoryLower.includes('vegetable') || categoryLower.includes('fruit')) return 1
    return 3 // Default estimate
  }

  // Get food details by ID
  getFoodById(id: string): FoodItem | null {
    return enhancedFoodDatabase.find(food => food.id === id) || null
  }

  // Get all foods
  getAllFoods(): FoodItem[] {
    return enhancedFoodDatabase
  }

  // Analyze health risks
  analyzeHealthRisk(food: FoodItem): HealthAnalysis {
    const recommendations = []
    const riskLevel = food.healthRisk || 'low'

    if (riskLevel === 'high') {
      recommendations.push('Consider limiting consumption')
      recommendations.push('Try healthier alternatives')
    } else if (riskLevel === 'medium') {
      recommendations.push('Consume in moderation')
    }

    if (food.co2 > 10) {
      recommendations.push('High carbon footprint - consider eco-friendly alternatives')
    }

    if (food.water > 5000) {
      recommendations.push('High water usage - consider water-efficient alternatives')
    }

    // Only show alternatives for medium and high risk foods
    const alternatives = (riskLevel === 'low') ? [] : (food.alternatives || [])

    return {
      riskLevel,
      warnings: food.healthWarnings || [],
      alternatives,
      recommendations
    }
  }

  // Generate recipe suggestions with variety
  async generateRecipe(ingredients: string[]): Promise<Recipe> {
    // Add randomness to create different recipes each time
    const recipeVariation = Math.floor(Math.random() * 3) // 0, 1, or 2
    const recipeData = this.createIntelligentRecipe(ingredients, recipeVariation)

    const recipe: Recipe = {
      id: Date.now().toString() + '_' + recipeVariation,
      title: recipeData.title,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      servings: recipeData.servings,
      totalCO2: this.calculateRecipeCO2(ingredients),
      totalWater: this.calculateRecipeWater(ingredients),
      healthScore: this.calculateHealthScore(ingredients),
      image: recipeData.image
    }

    return recipe
  }

  private createIntelligentRecipe(ingredients: string[], variation: number = 0) {
    // Analyze ingredients to determine recipe type
    const hasProtein = ingredients.some(ing =>
      ing.toLowerCase().includes('chicken') ||
      ing.toLowerCase().includes('fish') ||
      ing.toLowerCase().includes('tofu') ||
      ing.toLowerCase().includes('paneer') ||
      ing.toLowerCase().includes('egg')
    )

    const hasRice = ingredients.some(ing => ing.toLowerCase().includes('rice'))
    const hasVegetables = ingredients.some(ing =>
      ing.toLowerCase().includes('tomato') ||
      ing.toLowerCase().includes('onion') ||
      ing.toLowerCase().includes('pepper') ||
      ing.toLowerCase().includes('mushroom') ||
      ing.toLowerCase().includes('brinjal') ||
      ing.toLowerCase().includes('spinach')
    )

    const hasIndianSpices = ingredients.some(ing =>
      ing.toLowerCase().includes('ginger') ||
      ing.toLowerCase().includes('garlic') ||
      ing.toLowerCase().includes('turmeric')
    )

    // Create different recipe variations based on the same ingredients
    const recipeTypes = []

    if (hasProtein && hasRice && hasVegetables && hasIndianSpices) {
      recipeTypes.push(() => this.generateIndianCurryRecipe(ingredients, variation))
      recipeTypes.push(() => this.generateBiryaniRecipe(ingredients, variation))
      recipeTypes.push(() => this.generatePulaoRecipe(ingredients, variation))
    } else if (hasProtein && hasVegetables) {
      recipeTypes.push(() => this.generateStirFryRecipe(ingredients, variation))
      recipeTypes.push(() => this.generateGrilledRecipe(ingredients, variation))
      recipeTypes.push(() => this.generateSoupRecipe(ingredients, variation))
    } else if (hasVegetables && hasRice) {
      recipeTypes.push(() => this.generateVegetableRiceRecipe(ingredients, variation))
      recipeTypes.push(() => this.generateRisottoRecipe(ingredients, variation))
      recipeTypes.push(() => this.generateRiceBowlRecipe(ingredients, variation))
    } else if (hasVegetables) {
      recipeTypes.push(() => this.generateVegetableSaladRecipe(ingredients, variation))
      recipeTypes.push(() => this.generateVegetableCurryRecipe(ingredients, variation))
      recipeTypes.push(() => this.generateRoastedVegetableRecipe(ingredients, variation))
    } else {
      recipeTypes.push(() => this.generateSimpleBowlRecipe(ingredients, variation))
      recipeTypes.push(() => this.generateSmoothieBowlRecipe(ingredients, variation))
      recipeTypes.push(() => this.generateHealthyMixRecipe(ingredients, variation))
    }

    // Select recipe type based on variation
    const selectedRecipeType = recipeTypes[variation % recipeTypes.length]
    return selectedRecipeType()
  }

  private generateIndianCurryRecipe(ingredients: string[], variation: number = 0) {
    const protein = ingredients.find(ing =>
      ing.toLowerCase().includes('chicken') ||
      ing.toLowerCase().includes('paneer') ||
      ing.toLowerCase().includes('tofu')
    ) || 'protein'

    const vegetables = ingredients.filter(ing =>
      ing.toLowerCase().includes('tomato') ||
      ing.toLowerCase().includes('onion') ||
      ing.toLowerCase().includes('pepper') ||
      ing.toLowerCase().includes('brinjal') ||
      ing.toLowerCase().includes('spinach')
    )

    return {
      title: `${protein.charAt(0).toUpperCase() + protein.slice(1)} Curry with Vegetables`,
      ingredients: [
        `500g ${protein.toLowerCase()}, cut into pieces`,
        '2 large onions, finely chopped',
        '3-4 tomatoes, chopped',
        ...vegetables.slice(2).map(veg => `200g ${veg.toLowerCase()}, chopped`),
        '1 tbsp ginger-garlic paste',
        '2 tsp cumin seeds',
        '1 tsp turmeric powder',
        '2 tsp coriander powder',
        '1 tsp red chili powder',
        '1 tsp garam masala',
        '3 tbsp cooking oil',
        'Salt to taste',
        'Fresh coriander leaves for garnish',
        'Cooked basmati rice for serving'
      ],
      instructions: [
        'Heat oil in a heavy-bottomed pan over medium heat',
        'Add cumin seeds and let them splutter',
        'Add chopped onions and sauté until golden brown (8-10 minutes)',
        'Add ginger-garlic paste and cook for 2 minutes until fragrant',
        'Add tomatoes and cook until they break down and become mushy (5-7 minutes)',
        'Add turmeric, coriander powder, and red chili powder. Cook for 1 minute',
        `Add ${protein.toLowerCase()} pieces and cook until they change color (5-8 minutes)`,
        'Add the chopped vegetables and mix well',
        'Add 1 cup water, cover and simmer for 15-20 minutes until vegetables are tender',
        'Add garam masala and salt to taste',
        'Simmer for another 5 minutes until the curry reaches desired consistency',
        'Garnish with fresh coriander leaves',
        'Serve hot with steamed basmati rice'
      ],
      prepTime: 20,
      cookTime: 35,
      servings: 4,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'
    }
  }

  private generateStirFryRecipe(ingredients: string[], variation: number = 0) {
    const protein = ingredients.find(ing =>
      ing.toLowerCase().includes('chicken') ||
      ing.toLowerCase().includes('tofu') ||
      ing.toLowerCase().includes('fish')
    ) || 'protein'

    return {
      title: `${protein.charAt(0).toUpperCase() + protein.slice(1)} and Vegetable Stir-Fry`,
      ingredients: [
        `400g ${protein.toLowerCase()}, cut into strips`,
        '2 tbsp vegetable oil',
        '2 cloves garlic, minced',
        '1 inch ginger, julienned',
        ...ingredients.filter(ing =>
          ing.toLowerCase().includes('pepper') ||
          ing.toLowerCase().includes('mushroom') ||
          ing.toLowerCase().includes('onion')
        ).map(veg => `1 cup ${veg.toLowerCase()}, sliced`),
        '2 tbsp soy sauce',
        '1 tbsp oyster sauce (optional)',
        '1 tsp sesame oil',
        '1 tsp cornstarch mixed with 2 tbsp water',
        'Salt and pepper to taste',
        'Green onions for garnish'
      ],
      instructions: [
        'Heat 1 tbsp oil in a large wok or skillet over high heat',
        `Add ${protein.toLowerCase()} and stir-fry until cooked through (5-7 minutes)`,
        'Remove protein and set aside',
        'Add remaining oil to the same pan',
        'Add garlic and ginger, stir-fry for 30 seconds until fragrant',
        'Add harder vegetables first (like peppers) and stir-fry for 2-3 minutes',
        'Add softer vegetables (like mushrooms) and cook for another 2 minutes',
        'Return protein to the pan',
        'Add soy sauce, oyster sauce, and sesame oil',
        'Stir in cornstarch mixture to thicken the sauce',
        'Season with salt and pepper',
        'Garnish with chopped green onions',
        'Serve immediately over steamed rice or noodles'
      ],
      prepTime: 15,
      cookTime: 12,
      servings: 3,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400'
    }
  }

  private generateVegetableRiceRecipe(ingredients: string[], variation: number = 0) {
    return {
      title: 'Vegetable Fried Rice',
      ingredients: [
        '3 cups cooked rice (preferably day-old)',
        '2 tbsp vegetable oil',
        '2 eggs, beaten (optional)',
        '3 cloves garlic, minced',
        '1 inch ginger, minced',
        ...ingredients.filter(ing =>
          !ing.toLowerCase().includes('rice')
        ).map(veg => `1/2 cup ${veg.toLowerCase()}, diced`),
        '3 tbsp soy sauce',
        '1 tsp sesame oil',
        '2 green onions, chopped',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Heat 1 tbsp oil in a large wok or skillet over high heat',
        'If using eggs, scramble them first and set aside',
        'Add remaining oil to the pan',
        'Add garlic and ginger, stir-fry for 30 seconds',
        'Add harder vegetables first and stir-fry for 2-3 minutes',
        'Add softer vegetables and cook for another 2 minutes',
        'Add the cooked rice, breaking up any clumps',
        'Stir-fry for 3-4 minutes until rice is heated through',
        'Add soy sauce and sesame oil, mix well',
        'Return scrambled eggs to the pan if using',
        'Season with salt and pepper',
        'Garnish with green onions',
        'Serve hot as a main dish or side'
      ],
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400'
    }
  }

  private generateVegetableSaladRecipe(ingredients: string[], variation: number = 0) {
    return {
      title: 'Fresh Garden Salad',
      ingredients: [
        ...ingredients.map(veg => `2 cups ${veg.toLowerCase()}, chopped or sliced`),
        '3 tbsp olive oil',
        '2 tbsp lemon juice or vinegar',
        '1 tsp Dijon mustard',
        '1 clove garlic, minced',
        '1 tsp honey',
        'Salt and pepper to taste',
        'Fresh herbs (parsley, basil, or cilantro)',
        'Optional: nuts, seeds, or cheese for topping'
      ],
      instructions: [
        'Wash and prepare all vegetables according to their type',
        'Cut harder vegetables into thin slices or small pieces',
        'Leave delicate greens in larger pieces',
        'In a small bowl, whisk together olive oil, lemon juice, and Dijon mustard',
        'Add minced garlic and honey to the dressing',
        'Season dressing with salt and pepper',
        'Place all prepared vegetables in a large salad bowl',
        'Pour dressing over vegetables just before serving',
        'Toss gently to coat all ingredients',
        'Garnish with fresh herbs and optional toppings',
        'Serve immediately as a side dish or light meal'
      ],
      prepTime: 15,
      cookTime: 0,
      servings: 4,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
    }
  }

  private generateSimpleBowlRecipe(ingredients: string[], variation: number = 0) {
    const cookingMethods = ['Roasted', 'Grilled', 'Steamed']
    const method = cookingMethods[variation % cookingMethods.length]

    return {
      title: `Healthy ${method} ${ingredients.join(' & ')} Bowl`,
      ingredients: [
        ...ingredients.map(ing => `1 cup ${ing.toLowerCase()}`),
        '2 tbsp olive oil',
        '1 tsp garlic powder',
        'Salt and pepper to taste',
        'Fresh herbs for garnish',
        variation === 0 ? 'Lemon juice for drizzling' : variation === 1 ? 'Balsamic glaze' : 'Tahini sauce'
      ],
      instructions: [
        variation === 0 ? 'Preheat oven to 400°F (200°C)' : variation === 1 ? 'Preheat grill to medium-high heat' : 'Prepare steamer basket',
        'Prepare all ingredients by washing and chopping appropriately',
        'Toss ingredients with olive oil and seasonings',
        variation === 0 ? 'Roast in oven for 20-25 minutes until tender' :
        variation === 1 ? 'Grill for 15-20 minutes, turning occasionally' :
        'Steam for 12-15 minutes until tender',
        'Arrange in bowls and drizzle with finishing sauce',
        'Serve hot with fresh herbs',
        'Enjoy your healthy, eco-friendly meal!'
      ],
      prepTime: 15,
      cookTime: variation === 2 ? 15 : 25,
      servings: 4,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
    }
  }

  // New recipe variations
  private generateBiryaniRecipe(ingredients: string[], variation: number = 0) {
    const protein = ingredients.find(ing =>
      ing.toLowerCase().includes('chicken') ||
      ing.toLowerCase().includes('paneer') ||
      ing.toLowerCase().includes('tofu')
    ) || 'vegetables'

    return {
      title: `Fragrant ${protein.charAt(0).toUpperCase() + protein.slice(1)} Biryani`,
      ingredients: [
        '2 cups basmati rice, soaked for 30 minutes',
        `500g ${protein.toLowerCase()}, cut into pieces`,
        '1 cup yogurt',
        '2 large onions, thinly sliced',
        '1/4 cup ghee or oil',
        '1 tsp cumin seeds',
        '4-5 green cardamom pods',
        '2 bay leaves',
        '1 inch cinnamon stick',
        '1 tsp ginger-garlic paste',
        '1/2 tsp turmeric powder',
        '1 tsp red chili powder',
        '1 tsp biryani masala',
        'Saffron soaked in 1/4 cup warm milk',
        'Fresh mint and coriander leaves',
        'Salt to taste'
      ],
      instructions: [
        'Marinate protein with yogurt, turmeric, chili powder, and salt for 30 minutes',
        'Heat ghee in a heavy-bottomed pot, fry onions until golden brown',
        'Remove half the onions and set aside for garnish',
        'Add whole spices to remaining onions, cook for 1 minute',
        'Add marinated protein and cook until 70% done',
        'In another pot, boil water with whole spices and salt',
        'Add soaked rice and cook until 70% done, then drain',
        'Layer the rice over protein, sprinkle fried onions, herbs, and saffron milk',
        'Cover with foil, then lid, and cook on high heat for 3-4 minutes',
        'Reduce heat to low and cook for 45 minutes',
        'Let it rest for 10 minutes before opening',
        'Gently mix and serve hot with raita and pickle'
      ],
      prepTime: 45,
      cookTime: 60,
      servings: 6,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400'
    }
  }

  private generateGrilledRecipe(ingredients: string[], variation: number = 0) {
    const protein = ingredients.find(ing =>
      ing.toLowerCase().includes('chicken') ||
      ing.toLowerCase().includes('fish') ||
      ing.toLowerCase().includes('tofu')
    ) || 'vegetables'

    const marinades = ['Mediterranean', 'Asian', 'Mexican']
    const marinade = marinades[variation % marinades.length]

    return {
      title: `${marinade} Grilled ${protein.charAt(0).toUpperCase() + protein.slice(1)}`,
      ingredients: [
        `600g ${protein.toLowerCase()}, cut into portions`,
        marinade === 'Mediterranean' ? '1/4 cup olive oil' : marinade === 'Asian' ? '2 tbsp sesame oil' : '2 tbsp vegetable oil',
        marinade === 'Mediterranean' ? '2 tbsp lemon juice' : marinade === 'Asian' ? '3 tbsp soy sauce' : '2 tbsp lime juice',
        marinade === 'Mediterranean' ? '2 tsp dried oregano' : marinade === 'Asian' ? '1 tbsp honey' : '1 tsp cumin powder',
        marinade === 'Mediterranean' ? '3 cloves garlic, minced' : marinade === 'Asian' ? '2 cloves garlic, minced' : '2 cloves garlic, minced',
        marinade === 'Mediterranean' ? 'Fresh rosemary' : marinade === 'Asian' ? '1 inch ginger, grated' : '1 tsp chili powder',
        ...ingredients.filter(ing => !ing.toLowerCase().includes(protein.toLowerCase())).map(veg => `2 cups ${veg.toLowerCase()}, cut for grilling`),
        'Salt and pepper to taste'
      ],
      instructions: [
        `Mix all marinade ingredients in a bowl`,
        `Marinate ${protein.toLowerCase()} for at least 30 minutes`,
        'Preheat grill to medium-high heat',
        'Remove protein from marinade and season with salt and pepper',
        `Grill ${protein.toLowerCase()} for 6-8 minutes per side until cooked through`,
        'Grill vegetables for 4-6 minutes until tender and slightly charred',
        'Let protein rest for 5 minutes before serving',
        'Serve hot with grilled vegetables',
        'Garnish with fresh herbs and enjoy!'
      ],
      prepTime: 40,
      cookTime: 20,
      servings: 4,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'
    }
  }

  // Additional recipe variations for more variety
  private generatePulaoRecipe(ingredients: string[], variation: number = 0) {
    return {
      title: 'Aromatic Vegetable Pulao',
      ingredients: [
        '2 cups basmati rice, soaked',
        '3 tbsp ghee or oil',
        '1 tsp cumin seeds',
        '2 bay leaves',
        '4 green cardamom pods',
        '1 inch cinnamon stick',
        '1 large onion, sliced',
        ...ingredients.filter(ing => !ing.toLowerCase().includes('rice')).map(veg => `1 cup ${veg.toLowerCase()}, chopped`),
        '3 cups vegetable broth',
        '1 tsp garam masala',
        'Salt to taste',
        'Fresh mint leaves'
      ],
      instructions: [
        'Heat ghee in a heavy-bottomed pot',
        'Add whole spices and let them splutter',
        'Add sliced onions and sauté until golden',
        'Add vegetables and cook for 5 minutes',
        'Add drained rice and gently mix',
        'Add hot broth and bring to a boil',
        'Add garam masala and salt',
        'Cover and cook on low heat for 18-20 minutes',
        'Let it rest for 5 minutes',
        'Garnish with mint and serve hot'
      ],
      prepTime: 20,
      cookTime: 25,
      servings: 4,
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'
    }
  }

  private generateSoupRecipe(ingredients: string[], variation: number = 0) {
    const soupTypes = ['Hearty', 'Creamy', 'Spicy']
    const type = soupTypes[variation % soupTypes.length]

    return {
      title: `${type} Mixed Vegetable Soup`,
      ingredients: [
        ...ingredients.map(ing => `2 cups ${ing.toLowerCase()}, chopped`),
        '2 tbsp olive oil',
        '1 large onion, diced',
        '3 cloves garlic, minced',
        '6 cups vegetable broth',
        type === 'Creamy' ? '1/2 cup coconut milk' : type === 'Spicy' ? '1 tsp red pepper flakes' : '1 can diced tomatoes',
        '1 tsp dried herbs',
        'Salt and pepper to taste',
        'Fresh parsley for garnish'
      ],
      instructions: [
        'Heat oil in a large pot over medium heat',
        'Sauté onion and garlic until fragrant',
        'Add harder vegetables first and cook for 5 minutes',
        'Add remaining vegetables and cook for another 5 minutes',
        'Pour in broth and bring to a boil',
        'Reduce heat and simmer for 20-25 minutes',
        type === 'Creamy' ? 'Stir in coconut milk and simmer for 5 more minutes' :
        type === 'Spicy' ? 'Add red pepper flakes and simmer for 5 more minutes' :
        'Add diced tomatoes and simmer for 10 more minutes',
        'Season with herbs, salt, and pepper',
        'Serve hot garnished with fresh parsley'
      ],
      prepTime: 15,
      cookTime: 35,
      servings: 6,
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'
    }
  }

  private generateRisottoRecipe(ingredients: string[], variation: number = 0) {
    return {
      title: 'Creamy Vegetable Risotto',
      ingredients: [
        '1.5 cups arborio rice',
        '4 cups warm vegetable broth',
        '1/2 cup white wine (optional)',
        '1 large onion, finely diced',
        '3 cloves garlic, minced',
        '3 tbsp olive oil',
        '2 tbsp butter',
        ...ingredients.filter(ing => !ing.toLowerCase().includes('rice')).map(veg => `1 cup ${veg.toLowerCase()}, diced`),
        '1/2 cup grated parmesan (optional)',
        'Fresh herbs for garnish',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Keep broth warm in a separate pot',
        'Heat oil and 1 tbsp butter in a large pan',
        'Sauté onion until translucent',
        'Add garlic and cook for 1 minute',
        'Add rice and stir for 2 minutes until lightly toasted',
        'Add wine if using and stir until absorbed',
        'Add warm broth one ladle at a time, stirring constantly',
        'Continue until rice is creamy and al dente (about 20 minutes)',
        'Stir in vegetables during last 5 minutes',
        'Finish with remaining butter and parmesan',
        'Garnish with herbs and serve immediately'
      ],
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400'
    }
  }

  private generateRiceBowlRecipe(ingredients: string[], variation: number = 0) {
    return {
      title: 'Nourishing Buddha Bowl',
      ingredients: [
        '2 cups cooked brown rice',
        ...ingredients.filter(ing => !ing.toLowerCase().includes('rice')).map(veg => `1 cup ${veg.toLowerCase()}`),
        '3 tbsp tahini or peanut butter',
        '2 tbsp soy sauce',
        '1 tbsp honey',
        '1 tbsp rice vinegar',
        '1 tsp sesame oil',
        '1 clove garlic, minced',
        'Sesame seeds for garnish',
        'Sliced avocado (optional)'
      ],
      instructions: [
        'Prepare rice according to package instructions',
        'Steam or lightly sauté vegetables until tender-crisp',
        'Whisk together tahini, soy sauce, honey, vinegar, sesame oil, and garlic for dressing',
        'Divide rice among bowls',
        'Arrange vegetables over rice',
        'Drizzle with dressing',
        'Top with sesame seeds and avocado if using',
        'Serve immediately and enjoy your nutritious bowl'
      ],
      prepTime: 20,
      cookTime: 15,
      servings: 3,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
    }
  }

  private generateVegetableCurryRecipe(ingredients: string[], variation: number = 0) {
    return {
      title: 'Spiced Vegetable Curry',
      ingredients: [
        ...ingredients.map(veg => `2 cups ${veg.toLowerCase()}, chopped`),
        '2 tbsp coconut oil',
        '1 large onion, diced',
        '3 cloves garlic, minced',
        '1 inch ginger, grated',
        '1 can coconut milk',
        '1 can diced tomatoes',
        '2 tsp curry powder',
        '1 tsp turmeric',
        '1 tsp cumin',
        'Salt to taste',
        'Fresh cilantro for garnish'
      ],
      instructions: [
        'Heat coconut oil in a large pot',
        'Sauté onion until softened',
        'Add garlic and ginger, cook for 1 minute',
        'Add spices and cook until fragrant',
        'Add tomatoes and cook for 5 minutes',
        'Add vegetables and coconut milk',
        'Simmer for 20-25 minutes until vegetables are tender',
        'Season with salt',
        'Garnish with cilantro and serve with rice'
      ],
      prepTime: 15,
      cookTime: 30,
      servings: 5,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'
    }
  }

  private generateRoastedVegetableRecipe(ingredients: string[], variation: number = 0) {
    return {
      title: 'Mediterranean Roasted Vegetables',
      ingredients: [
        ...ingredients.map(veg => `3 cups ${veg.toLowerCase()}, cut into chunks`),
        '1/4 cup olive oil',
        '3 cloves garlic, minced',
        '1 tsp dried oregano',
        '1 tsp dried thyme',
        '1/2 tsp paprika',
        'Salt and pepper to taste',
        'Fresh lemon juice',
        'Fresh herbs for garnish'
      ],
      instructions: [
        'Preheat oven to 425°F (220°C)',
        'Cut all vegetables into similar-sized pieces',
        'Toss vegetables with olive oil, garlic, and spices',
        'Spread on a large baking sheet in single layer',
        'Roast for 25-35 minutes until tender and caramelized',
        'Stir once halfway through cooking',
        'Drizzle with lemon juice before serving',
        'Garnish with fresh herbs'
      ],
      prepTime: 15,
      cookTime: 35,
      servings: 4,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'
    }
  }

  private generateSmoothieBowlRecipe(ingredients: string[], variation: number = 0) {
    return {
      title: 'Energizing Smoothie Bowl',
      ingredients: [
        ...ingredients.slice(0, 3).map(ing => `1 cup ${ing.toLowerCase()}`),
        '1 frozen banana',
        '1/2 cup plant milk',
        '1 tbsp chia seeds',
        '1 tbsp honey or maple syrup',
        'Granola for topping',
        'Fresh berries for topping',
        'Coconut flakes for topping'
      ],
      instructions: [
        'Blend main ingredients with banana and milk until smooth',
        'Add sweetener to taste',
        'Pour into a bowl',
        'Top with granola, berries, and coconut',
        'Sprinkle with chia seeds',
        'Serve immediately for best texture'
      ],
      prepTime: 10,
      cookTime: 0,
      servings: 2,
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400'
    }
  }

  private generateHealthyMixRecipe(ingredients: string[], variation: number = 0) {
    return {
      title: 'Power-Packed Healthy Mix',
      ingredients: [
        ...ingredients.map(ing => `1.5 cups ${ing.toLowerCase()}`),
        '2 tbsp olive oil',
        '1 tbsp balsamic vinegar',
        '1 tsp honey',
        '1/2 tsp garlic powder',
        'Mixed nuts and seeds',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Prepare all ingredients by washing and chopping',
        'Whisk together oil, vinegar, honey, and garlic powder',
        'Toss ingredients with dressing',
        'Let marinate for 15 minutes',
        'Top with nuts and seeds',
        'Serve as a nutritious meal or side dish'
      ],
      prepTime: 20,
      cookTime: 0,
      servings: 3,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400'
    }
  }

  private calculateRecipeCO2(ingredients: string[]): number {
    return ingredients.reduce((total, ingredient) => {
      const food = enhancedFoodDatabase.find(f =>
        f.name.toLowerCase().includes(ingredient.toLowerCase())
      )
      return total + (food?.co2 || 2)
    }, 0)
  }

  private calculateRecipeWater(ingredients: string[]): number {
    return ingredients.reduce((total, ingredient) => {
      const food = enhancedFoodDatabase.find(f =>
        f.name.toLowerCase().includes(ingredient.toLowerCase())
      )
      return total + (food?.water || 1000)
    }, 0)
  }

  private calculateHealthScore(ingredients: string[]): number {
    const avgRisk = ingredients.reduce((total, ingredient) => {
      const food = enhancedFoodDatabase.find(f =>
        f.name.toLowerCase().includes(ingredient.toLowerCase())
      )
      const riskScore = food?.healthRisk === 'low' ? 3 : food?.healthRisk === 'medium' ? 2 : 1
      return total + riskScore
    }, 0) / ingredients.length

    return Math.round(avgRisk * 33.33) // Convert to 0-100 scale
  }
}

export const foodService = new FoodService()
