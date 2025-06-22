// Food-related type definitions

export interface FoodSearchResult {
  id: string
  name: string
  category: string
  co2: number
  water: number
  land: number
  calories?: number
  protein?: number
  fat?: number
  carbs?: number
  source: 'local' | 'usda'
  fdcId?: number
  healthRisk?: 'low' | 'medium' | 'high'
  healthWarnings?: string[]
  alternatives?: string[]
}

export interface USDAFoodItem {
  fdcId: number
  description: string
  dataType: string
  foodCategory?: string
  foodNutrients?: Array<{
    nutrientId: number
    nutrientName: string
    nutrientNumber: string
    unitName: string
    value: number
  }>
  brandOwner?: string
  ingredients?: string
}

export interface FoodItem {
  id: string
  name: string
  category: string
  co2: number
  water: number
  land: number
  calories?: number
  protein?: number
  fat?: number
  carbs?: number
  healthRisk?: 'low' | 'medium' | 'high'
  healthWarnings?: string[]
  alternatives?: string[]
  image?: string
}

export interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  totalCO2: number
  totalWater: number
  healthScore: number
  image?: string
}

export interface HealthAnalysis {
  riskLevel: 'low' | 'medium' | 'high'
  warnings: string[]
  alternatives: string[]
  recommendations: string[]
}
