import axios from 'axios'
import type { FoodSearchResult, USDAFoodItem } from '../types/food'

// API configurations
const USDA_API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1'
const USDA_API_KEY = 'DEMO_KEY' // Replace with actual API key

const OPEN_FOOD_FACTS_API_BASE_URL = 'https://world.openfoodfacts.org'

interface OpenFoodFactsProduct {
  product_name: string
  categories: string
  nutriments: {
    'energy-kcal_100g'?: number
    'proteins_100g'?: number
    'fat_100g'?: number
    'carbohydrates_100g'?: number
  }
  code: string
}

class FoodApiService {
  private cache = new Map<string, { data: FoodSearchResult[], timestamp: number }>()
  private cacheTimeout = 60 * 60 * 1000 // 1 hour cache for better performance
  private maxCacheSize = 200 // Increased cache size
  private requestQueue = new Map<string, Promise<FoodSearchResult[]>>() // Prevent duplicate requests

  async searchFoods(query: string): Promise<FoodSearchResult[]> {
    if (!query || query.length < 2) {
      return []
    }

    // Check cache first
    const cacheKey = query.toLowerCase()
    const cachedResult = this.cache.get(cacheKey)

    if (cachedResult && Date.now() - cachedResult.timestamp < this.cacheTimeout) {
      return cachedResult.data
    }

    // Check if request is already in progress
    const existingRequest = this.requestQueue.get(cacheKey)
    if (existingRequest) {
      return existingRequest
    }

    // Create and queue the request
    const searchPromise = this.performSearch(query, cacheKey)
    this.requestQueue.set(cacheKey, searchPromise)

    try {
      const results = await searchPromise
      return results
    } finally {
      // Remove from queue when done
      this.requestQueue.delete(cacheKey)
    }
  }

  private async performSearch(query: string, cacheKey: string): Promise<FoodSearchResult[]> {
    try {
      // Search both Open Food Facts and USDA in parallel
      const [openFoodFactsResults, usdaResults] = await Promise.all([
        this.searchOpenFoodFacts(query),
        this.searchUSDA(query)
      ])

      // Combine results, prioritizing Open Food Facts for better international coverage
      const combinedResults = [...openFoodFactsResults, ...usdaResults]

      // Manage cache size
      if (this.cache.size >= this.maxCacheSize) {
        // Remove oldest entries
        const oldestKey = Array.from(this.cache.entries())
          .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0]
        this.cache.delete(oldestKey)
      }

      // Cache results
      this.cache.set(cacheKey, {
        data: combinedResults,
        timestamp: Date.now()
      })

      return combinedResults
    } catch (error) {
      console.error('Error searching foods:', error)
      return []
    }
  }

  private async searchOpenFoodFacts(query: string): Promise<FoodSearchResult[]> {
    try {
      const response = await axios.get(
        `${OPEN_FOOD_FACTS_API_BASE_URL}/cgi/search.pl`,
        {
          params: {
            search_terms: query,
            search_simple: 1,
            action: 'process',
            json: 1,
            page_size: 10,
            fields: 'product_name,categories,nutriments,code'
          }
        }
      )

      const products = response.data.products || []
      return products
        .filter((product: OpenFoodFactsProduct) => product.product_name)
        .map((product: OpenFoodFactsProduct) => this.mapOpenFoodFactsToFoodResult(product))
        .slice(0, 8) // Limit to 8 results
    } catch (error) {
      console.error('Error searching Open Food Facts:', error)
      return []
    }
  }

  private async searchUSDA(query: string): Promise<FoodSearchResult[]> {
    try {
      const response = await axios.post(
        `${USDA_API_BASE_URL}/foods/search`,
        {
          query: query,
          dataType: ['Foundation', 'SR Legacy', 'Survey (FNDDS)'],
          pageSize: 10,
          pageNumber: 1,
          sortBy: 'dataType.keyword',
          sortOrder: 'asc'
        },
        {
          params: {
            api_key: USDA_API_KEY
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const foods = response.data.foods || []
      return foods.map((food: USDAFoodItem) => this.mapUSDAToFoodResult(food)).slice(0, 5)
    } catch (error) {
      console.error('Error searching USDA foods:', error)
      return []
    }
  }

  private mapOpenFoodFactsToFoodResult(product: OpenFoodFactsProduct): FoodSearchResult {
    const calories = product.nutriments['energy-kcal_100g'] || 0
    const protein = product.nutriments['proteins_100g'] || 0
    const fat = product.nutriments['fat_100g'] || 0
    const carbs = product.nutriments['carbohydrates_100g'] || 0

    // Estimate environmental impact based on product name and category
    const { co2, water, land } = this.estimateEnvironmentalImpact(product.product_name, product.categories)

    return {
      id: `off-${product.code}`,
      name: product.product_name,
      category: this.extractMainCategory(product.categories) || 'Food',
      co2,
      water,
      land,
      calories,
      protein,
      fat,
      carbs,
      source: 'usda', // Using 'usda' to indicate external API
      healthRisk: this.estimateHealthRisk(product.product_name, calories, fat),
      healthWarnings: [],
      alternatives: []
    }
  }

  private extractMainCategory(categories: string): string {
    if (!categories) return 'Food'

    const categoryList = categories.split(',').map(c => c.trim())

    // Prioritize meaningful categories
    const priorityCategories = [
      'vegetables', 'fruits', 'meat', 'dairy', 'grains', 'legumes',
      'spices', 'beverages', 'snacks', 'breakfast', 'indian'
    ]

    for (const priority of priorityCategories) {
      const found = categoryList.find(cat =>
        cat.toLowerCase().includes(priority)
      )
      if (found) return found
    }

    return categoryList[0] || 'Food'
  }

  private mapUSDAToFoodResult(usdaFood: USDAFoodItem): FoodSearchResult {
    // Extract nutritional information
    const nutrients = usdaFood.foodNutrients || []
    const calories = this.getNutrientValue(nutrients, 'Energy', 'kcal') || 0
    const protein = this.getNutrientValue(nutrients, 'Protein') || 0
    const fat = this.getNutrientValue(nutrients, 'Total lipid (fat)') || 0
    const carbs = this.getNutrientValue(nutrients, 'Carbohydrate, by difference') || 0

    // Estimate environmental impact based on food category and type
    const { co2, water, land } = this.estimateEnvironmentalImpact(usdaFood.description, usdaFood.foodCategory)

    return {
      id: `usda-${usdaFood.fdcId}`,
      name: usdaFood.description,
      category: usdaFood.foodCategory || 'Unknown',
      co2,
      water,
      land,
      calories,
      protein,
      fat,
      carbs,
      source: 'usda',
      fdcId: usdaFood.fdcId,
      healthRisk: this.estimateHealthRisk(usdaFood.description, calories, fat),
      healthWarnings: [],
      alternatives: []
    }
  }

  private getNutrientValue(nutrients: any[], nutrientName: string, unitName?: string): number {
    const nutrient = nutrients.find(n =>
      n.nutrientName.toLowerCase().includes(nutrientName.toLowerCase()) &&
      (!unitName || n.unitName.toLowerCase() === unitName.toLowerCase())
    )
    return nutrient ? nutrient.value : 0
  }

  private estimateEnvironmentalImpact(description: string, category?: string): { co2: number; water: number; land: number } {
    const desc = description.toLowerCase()
    const cat = category?.toLowerCase() || ''

    // Meat products
    if (desc.includes('beef') || desc.includes('steak')) {
      return { co2: 60, water: 15000, land: 164 }
    }
    if (desc.includes('lamb') || desc.includes('mutton')) {
      return { co2: 39, water: 10000, land: 185 }
    }
    if (desc.includes('pork') || desc.includes('ham') || desc.includes('bacon')) {
      return { co2: 12, water: 6000, land: 11 }
    }
    if (desc.includes('chicken') || desc.includes('poultry')) {
      return { co2: 6.9, water: 4325, land: 7.5 }
    }

    // Fish and seafood
    if (desc.includes('salmon') || desc.includes('tuna') || desc.includes('fish')) {
      return { co2: 11.9, water: 3000, land: 3.2 }
    }

    // Dairy
    if (desc.includes('cheese')) {
      return { co2: 13.5, water: 3178, land: 8.8 }
    }
    if (desc.includes('milk') || desc.includes('yogurt')) {
      return { co2: 3.2, water: 1000, land: 9 }
    }

    // Grains and cereals (including Indian foods)
    if (desc.includes('rice') || desc.includes('idli') || desc.includes('dosa')) {
      return { co2: 2.7, water: 2497, land: 2.9 }
    }
    if (desc.includes('wheat') || desc.includes('bread') || desc.includes('roti') || desc.includes('chapati')) {
      return { co2: 1.4, water: 1827, land: 3.4 }
    }

    // Legumes and pulses
    if (desc.includes('lentil') || desc.includes('dal') || desc.includes('bean') ||
        desc.includes('chickpea') || desc.includes('pea') || desc.includes('chana')) {
      return { co2: 0.9, water: 4055, land: 3.4 }
    }

    // Vegetables (including Indian names)
    if (cat.includes('vegetable') || desc.includes('tomato') || desc.includes('onion') ||
        desc.includes('potato') || desc.includes('eggplant') || desc.includes('brinjal') ||
        desc.includes('okra') || desc.includes('bhindi') || desc.includes('cauliflower') ||
        desc.includes('gobi') || desc.includes('spinach') || desc.includes('palak') ||
        desc.includes('carrot') || desc.includes('cabbage') || desc.includes('peas')) {
      return { co2: 0.4, water: 250, land: 0.3 }
    }

    // Fruits
    if (cat.includes('fruit') || desc.includes('apple') || desc.includes('banana') || desc.includes('mango')) {
      return { co2: 0.7, water: 822, land: 0.7 }
    }

    // Default for unknown foods
    return { co2: 2.0, water: 1000, land: 2.0 }
  }

  private estimateHealthRisk(description: string, calories: number, fat: number): 'low' | 'medium' | 'high' {
    const desc = description.toLowerCase()

    // High risk foods
    if (desc.includes('fried') || desc.includes('deep-fried') || desc.includes('bacon') ||
        desc.includes('sausage') || desc.includes('processed') || fat > 20) {
      return 'high'
    }

    // Medium risk foods
    if (desc.includes('beef') || desc.includes('pork') || desc.includes('cheese') ||
        calories > 300 || fat > 10) {
      return 'medium'
    }

    // Low risk foods (vegetables, fruits, lean proteins)
    return 'low'
  }
}

export const foodApiService = new FoodApiService()
