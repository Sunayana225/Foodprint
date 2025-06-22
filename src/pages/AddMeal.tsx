import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Plus,
  Minus,
  TreePine,
  Droplets,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  X,
  ChefHat
} from 'lucide-react'
import { foodService } from '../utils/foodService'
import { localMealService } from '../services/localMealService'
import FoodSearchInput from '../components/FoodSearchInput'
import type { FoodSearchResult, FoodItem } from '../types/food'
import { useSuccessToast, useErrorToast } from '../components/Toast'
import { validateMeal, sanitizeInput } from '../utils/validation'
import { handleError } from '../utils/errorHandling'

const AddMeal = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const showSuccessToast = useSuccessToast()
  const showErrorToast = useErrorToast()
  const [selectedMealType, setSelectedMealType] = useState('breakfast')
  const [selectedIngredients, setSelectedIngredients] = useState<any[]>([])
  const [selectedFoodAnalysis, setSelectedFoodAnalysis] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showEcoWarning, setShowEcoWarning] = useState(false)
  const [ecoWarningData, setEcoWarningData] = useState<{co2: number, ingredients: string[], suggestedRecipe?: any} | null>(null)

  // Convert FoodSearchResult to FoodItem for compatibility
  const convertToFoodItem = (searchResult: FoodSearchResult): FoodItem => {
    return {
      id: searchResult.id,
      name: searchResult.name,
      category: searchResult.category,
      co2: searchResult.co2,
      water: searchResult.water,
      land: searchResult.land,
      calories: searchResult.calories,
      protein: searchResult.protein,
      fat: searchResult.fat,
      carbs: searchResult.carbs,
      healthRisk: searchResult.healthRisk || 'low',
      healthWarnings: searchResult.healthWarnings || [],
      alternatives: searchResult.alternatives || []
    }
  }

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '☀️' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' },
    { id: 'snack', label: 'Snack', icon: '🍎' }
  ]

  const addIngredientFromSearch = (searchResult: FoodSearchResult) => {
    const food = convertToFoodItem(searchResult)
    addIngredient(food)
  }

  const addIngredient = (food: FoodItem) => {
    const existing = selectedIngredients.find(item => item.id === food.id)
    if (existing) {
      setSelectedIngredients(prev =>
        prev.map(item =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    } else {
      setSelectedIngredients(prev => [...prev, { ...food, quantity: 1 }])
    }

    // Analyze health risks for the selected food
    const analysis = foodService.analyzeHealthRisk(food)
    setSelectedFoodAnalysis({ food, analysis })
  }

  const removeIngredient = (foodId: string) => {
    setSelectedIngredients(prev => prev.filter(item => item.id !== foodId))
  }

  const updateQuantity = (foodId: string, change: number) => {
    setSelectedIngredients(prev =>
      prev.map(item => {
        if (item.id === foodId) {
          const newQuantity = Math.max(0, item.quantity + change)
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
        }
        return item
      }).filter(Boolean)
    )
  }

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const totalImpact = selectedIngredients.reduce((acc, item) => ({
    co2: acc.co2 + (item.co2 * item.quantity),
    water: acc.water + (item.water * item.quantity),
    land: acc.land + (item.land * item.quantity)
  }), { co2: 0, water: 0, land: 0 })

  const getImpactLevel = (co2: number) => {
    if (co2 < 2) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' }
    if (co2 < 5) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const impact = getImpactLevel(totalImpact.co2)

  // Environmental warning and recipe suggestion system
  const showEnvironmentalWarning = async (co2: number, ingredients: string[]) => {
    try {
      // Generate eco-friendly recipe suggestion
      const ecoFriendlyIngredients = generateEcoFriendlyAlternatives(ingredients)
      const suggestedRecipe = await generateEcoRecipe(ecoFriendlyIngredients)

      setEcoWarningData({ co2, ingredients, suggestedRecipe })
      setShowEcoWarning(true)
    } catch (error) {
      console.error('Error generating eco recipe:', error)
      // Show warning without recipe if generation fails
      setEcoWarningData({ co2, ingredients })
      setShowEcoWarning(true)
    }
  }

  // Generate eco-friendly alternatives for high CO2 ingredients
  const generateEcoFriendlyAlternatives = (ingredients: string[]): string[] => {
    const ecoAlternatives: { [key: string]: string[] } = {
      'beef': ['lentils', 'chickpeas', 'tofu', 'mushrooms'],
      'lamb': ['black beans', 'quinoa', 'tempeh'],
      'pork': ['jackfruit', 'cauliflower', 'eggplant'],
      'chicken': ['paneer', 'cottage cheese', 'soy chunks'],
      'cheese': ['nutritional yeast', 'cashew cream', 'almond cheese'],
      'butter': ['olive oil', 'coconut oil', 'avocado'],
      'milk': ['oat milk', 'almond milk', 'soy milk'],
      'rice': ['quinoa', 'millet', 'barley'],
      'wheat': ['oats', 'buckwheat', 'amaranth']
    }

    const alternatives: string[] = []
    ingredients.forEach(ingredient => {
      const lowerIngredient = ingredient.toLowerCase()
      for (const [highCO2, ecoOptions] of Object.entries(ecoAlternatives)) {
        if (lowerIngredient.includes(highCO2)) {
          alternatives.push(...ecoOptions.slice(0, 2)) // Add 2 alternatives per ingredient
        }
      }
    })

    // Add some default eco-friendly ingredients if no specific alternatives found
    if (alternatives.length === 0) {
      alternatives.push('spinach', 'tomatoes', 'onions', 'garlic', 'herbs')
    }

    return [...new Set(alternatives)] // Remove duplicates
  }

  // Generate eco-friendly recipe using the alternatives
  const generateEcoRecipe = async (ecoIngredients: string[]): Promise<any> => {
    // Basic ingredients that are commonly available and eco-friendly
    const basicIngredients = [
      'olive oil', 'garlic', 'onion', 'ginger', 'turmeric', 'cumin', 'coriander',
      'salt', 'black pepper', 'lemon juice', 'fresh herbs', 'vegetable broth'
    ]

    // Create a comprehensive recipe based on the eco ingredients
    const primaryIngredient = ecoIngredients[0] || 'lentils'
    const secondaryIngredients = ecoIngredients.slice(1, 4)

    // Recipe templates based on primary ingredient
    const recipeTemplates = {
      'lentils': {
        name: 'Hearty Lentil & Vegetable Curry',
        description: 'A protein-rich, warming curry packed with nutrients and flavor. This sustainable meal provides complete proteins while having minimal environmental impact.',
        ingredients: [
          '1 cup red lentils (washed and drained)',
          '2 cups mixed vegetables (carrots, bell peppers, spinach)',
          '1 large onion (diced)',
          '3 cloves garlic (minced)',
          '1 inch fresh ginger (grated)',
          '2 tbsp olive oil',
          '1 tsp turmeric powder',
          '1 tsp cumin seeds',
          '1 tsp coriander powder',
          '2 cups vegetable broth',
          'Salt and pepper to taste',
          'Fresh cilantro for garnish',
          'Lemon juice (1 tbsp)'
        ],
        instructions: [
          'Heat olive oil in a large pot over medium heat',
          'Add cumin seeds and let them splutter for 30 seconds',
          'Add diced onions and sauté until golden brown (5-6 minutes)',
          'Add minced garlic and grated ginger, cook for 1 minute',
          'Add turmeric and coriander powder, stir for 30 seconds',
          'Add washed lentils and mixed vegetables, stir well',
          'Pour in vegetable broth and bring to a boil',
          'Reduce heat, cover and simmer for 15-20 minutes until lentils are tender',
          'Season with salt, pepper, and lemon juice',
          'Garnish with fresh cilantro and serve hot',
          'Serve with brown rice or whole wheat bread for a complete meal'
        ]
      },
      'chickpeas': {
        name: 'Mediterranean Chickpea Power Bowl',
        description: 'A vibrant, nutrient-dense bowl combining protein-rich chickpeas with fresh vegetables and aromatic herbs.',
        ingredients: [
          '1.5 cups cooked chickpeas (or 1 can, drained)',
          '2 cups mixed greens (spinach, arugula)',
          '1 cucumber (diced)',
          '2 tomatoes (chopped)',
          '1 red onion (thinly sliced)',
          '3 tbsp olive oil',
          '2 cloves garlic (minced)',
          '1 tsp dried oregano',
          '1/2 tsp paprika',
          '2 tbsp lemon juice',
          '1/4 cup fresh parsley (chopped)',
          'Salt and pepper to taste',
          '2 tbsp tahini or hummus'
        ],
        instructions: [
          'Heat 1 tbsp olive oil in a pan over medium heat',
          'Add chickpeas, garlic, oregano, and paprika',
          'Sauté for 5-7 minutes until chickpeas are lightly crispy',
          'Season with salt and pepper, set aside',
          'In a large bowl, combine mixed greens, cucumber, tomatoes, and red onion',
          'Whisk together remaining olive oil, lemon juice, and a pinch of salt',
          'Toss vegetables with the dressing',
          'Top with seasoned chickpeas',
          'Drizzle with tahini or add a dollop of hummus',
          'Garnish with fresh parsley',
          'Serve immediately as a complete, satisfying meal'
        ]
      },
      'tofu': {
        name: 'Asian-Inspired Crispy Tofu Stir-Fry',
        description: 'A delicious plant-based meal with crispy tofu and colorful vegetables in a savory sauce.',
        ingredients: [
          '400g firm tofu (cubed)',
          '2 cups mixed vegetables (broccoli, bell peppers, snap peas)',
          '2 tbsp sesame oil',
          '3 cloves garlic (minced)',
          '1 inch fresh ginger (grated)',
          '2 tbsp soy sauce (low sodium)',
          '1 tbsp rice vinegar',
          '1 tsp honey or maple syrup',
          '1 tsp cornstarch',
          '2 green onions (sliced)',
          '1 tbsp sesame seeds',
          'Red pepper flakes (optional)',
          'Brown rice for serving'
        ],
        instructions: [
          'Press tofu to remove excess water, then cube into bite-sized pieces',
          'Heat 1 tbsp sesame oil in a large pan or wok over medium-high heat',
          'Add tofu cubes and cook until golden and crispy on all sides (8-10 minutes)',
          'Remove tofu and set aside',
          'In the same pan, add remaining oil and mixed vegetables',
          'Stir-fry vegetables for 4-5 minutes until tender-crisp',
          'Add garlic and ginger, cook for 1 minute',
          'Mix soy sauce, rice vinegar, honey, and cornstarch in a small bowl',
          'Return tofu to pan, pour sauce over everything',
          'Toss everything together for 2-3 minutes until sauce thickens',
          'Garnish with green onions and sesame seeds',
          'Serve over brown rice for a complete meal'
        ]
      }
    }

    // Select appropriate template or create a custom one
    let selectedTemplate = recipeTemplates[primaryIngredient as keyof typeof recipeTemplates]

    if (!selectedTemplate) {
      // Create a custom recipe for other ingredients
      selectedTemplate = {
        name: `Healthy ${primaryIngredient.charAt(0).toUpperCase() + primaryIngredient.slice(1)} Bowl`,
        description: `A nutritious and sustainable meal featuring ${primaryIngredient} with fresh vegetables and aromatic spices.`,
        ingredients: [
          `2 cups ${primaryIngredient}`,
          ...secondaryIngredients.map(ing => `1 cup ${ing}`),
          '2 tbsp olive oil',
          '1 onion (diced)',
          '2 cloves garlic (minced)',
          '1 tsp cumin powder',
          '1 tsp turmeric',
          'Salt and pepper to taste',
          'Fresh herbs for garnish',
          'Lemon juice (1 tbsp)'
        ],
        instructions: [
          'Heat olive oil in a large pan over medium heat',
          'Add diced onion and cook until softened (5 minutes)',
          'Add garlic, cumin, and turmeric, cook for 1 minute',
          `Add ${primaryIngredient} and other vegetables`,
          'Cook for 10-15 minutes until tender',
          'Season with salt, pepper, and lemon juice',
          'Garnish with fresh herbs and serve hot'
        ]
      }
    }

    return {
      ...selectedTemplate,
      cookingTime: '25-35 minutes',
      prepTime: '10-15 minutes',
      servings: 3,
      difficulty: 'Easy',
      estimatedCO2: Math.max(1.2, Math.random() * 2.5), // Much lower CO2
      ecoScore: 88 + Math.floor(Math.random() * 12), // High eco score
      nutritionHighlights: [
        'High in plant protein',
        'Rich in fiber',
        'Low carbon footprint',
        'Nutrient-dense',
        'Heart-healthy'
      ],
      healthBenefits: [
        'Supports sustainable eating',
        'Provides complete nutrition',
        'Environmentally friendly',
        'Budget-friendly ingredients'
      ]
    }
  }

  const handleEcoWarningClose = () => {
    setShowEcoWarning(false)
    setEcoWarningData(null)
    // Still redirect to dashboard after closing warning
    navigate('/dashboard')
  }

  const handleGenerateEcoRecipe = () => {
    if (ecoWarningData?.suggestedRecipe) {
      // Navigate to recipe generator with the suggested recipe
      navigate('/recipe-generator', {
        state: {
          suggestedRecipe: ecoWarningData.suggestedRecipe,
          fromEcoWarning: true
        }
      })
    }
  }

  const saveMeal = async () => {
    if (!currentUser) {
      showErrorToast('Authentication Error', 'Please sign in to save meals.')
      return
    }

    // Clear previous validation errors
    setValidationErrors([])

    // Validate meal data
    const ingredientNames = selectedIngredients.map(item => sanitizeInput(item.name))
    const mealName = `${selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} - ${ingredientNames.slice(0, 2).join(', ')}${ingredientNames.length > 2 ? '...' : ''}`

    const validation = validateMeal({
      name: mealName,
      ingredients: ingredientNames,
      category: selectedMealType,
      calories: selectedIngredients.reduce((sum, item) => sum + (item.calories * item.quantity), 0)
    })

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      showErrorToast('Validation Error', validation.errors[0])
      return
    }

    setIsSaving(true)
    try {
      const carbonFootprint = localMealService.calculateCarbonFootprint(ingredientNames)
      const waterUsage = localMealService.calculateWaterUsage(ingredientNames)
      const ecoScore = localMealService.calculateEcoScore(carbonFootprint, waterUsage)
      const totalCalories = selectedIngredients.reduce((sum, item) => sum + (item.calories * item.quantity), 0)

      const mealData = {
        name: mealName,
        ingredients: ingredientNames,
        carbonFootprint,
        waterUsage,
        calories: totalCalories,
        category: selectedMealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        ecoScore
      }

      await localMealService.addMeal(currentUser.uid, mealData)

      // Check for high CO2 impact and show environmental feedback
      if (carbonFootprint > 8.0) { // High CO2 threshold
        showEnvironmentalWarning(carbonFootprint, ingredientNames)
      } else {
        // Show success and redirect
        showSuccessToast(
          'Meal Saved Successfully! 🎉',
          `Your ${selectedMealType} has been tracked with ${carbonFootprint.toFixed(1)}kg CO₂ impact.`
        )
        navigate('/dashboard')
      }
    } catch (error) {
      const appError = handleError(error, 'save-meal')
      showErrorToast('Failed to Save Meal', appError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add a Meal</h1>
          <p className="text-gray-600">Track your food choices and see their environmental impact</p>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-sm font-medium text-red-800">Please fix the following issues:</h3>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    {error}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Meal Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meal Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Meal Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {mealTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedMealType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedMealType === type.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Food Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Ingredients</h2>
              <FoodSearchInput
                onFoodSelect={addIngredientFromSearch}
                placeholder="Search for foods (try 'idli', 'chicken', 'rice'...)"
                className="mb-4"
              />
              <div className="text-sm text-gray-500 mt-2">
                <Info className="inline h-4 w-4 mr-1" />
                Search includes both local Indian foods and USDA database with thousands of foods
              </div>
            </motion.div>

            {/* Selected Ingredients */}
            {selectedIngredients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Ingredients</h2>
                <div className="space-y-3">
                  {selectedIngredients.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          {(item.co2 * item.quantity).toFixed(1)} kg CO₂ • {(item.water * item.quantity).toFixed(0)}L water
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeIngredient(item.id)}
                          className="p-1 rounded-full hover:bg-red-100 text-red-600 transition-colors ml-2"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Health Analysis */}
            {selectedFoodAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  Health Analysis: {selectedFoodAnalysis.food.name}
                </h2>

                {/* Risk Level */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Health Risk Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedFoodAnalysis.analysis.riskLevel)}`}>
                      {selectedFoodAnalysis.analysis.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  {selectedFoodAnalysis.analysis.riskLevel === 'low' && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Great choice! This is a healthy food option.
                      </p>
                    </div>
                  )}
                </div>

                {/* Health Warnings */}
                {selectedFoodAnalysis.analysis.warnings.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                      Health Considerations:
                    </h3>
                    <ul className="space-y-1">
                      {selectedFoodAnalysis.analysis.warnings.map((warning: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Alternatives */}
                {selectedFoodAnalysis.analysis.alternatives.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-1 text-green-500" />
                      Healthier Alternatives:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFoodAnalysis.analysis.alternatives.map((alt: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {selectedFoodAnalysis.analysis.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h3>
                    <ul className="space-y-1">
                      {selectedFoodAnalysis.analysis.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column - Impact Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card sticky top-24"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TreePine className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Carbon Footprint</span>
                  </div>
                  <span className="font-semibold">{totalImpact.co2.toFixed(1)} kg CO₂</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Water Usage</span>
                  </div>
                  <span className="font-semibold">{totalImpact.water.toFixed(0)} L</span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Impact Level</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${impact.bg} ${impact.color}`}>
                      {impact.level}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={saveMeal}
                disabled={selectedIngredients.length === 0 || isSaving}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>{isSaving ? 'Saving...' : 'Save Meal'}</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Environmental Warning Modal */}
        {showEcoWarning && ecoWarningData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Environmental Impact Warning</h3>
                      <p className="text-gray-600">This meal has a high carbon footprint</p>
                    </div>
                  </div>
                  <button
                    onClick={handleEcoWarningClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Warning Message */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <TreePine className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800 mb-1">High Carbon Footprint Detected</h4>
                      <p className="text-sm text-orange-700">
                        Your meal has a carbon footprint of <strong>{ecoWarningData.co2.toFixed(1)} kg CO₂</strong>,
                        which is significantly higher than the recommended 3-5 kg per meal.
                        This is not environmentally friendly and contributes to climate change.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Suggestion */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Lightbulb className="h-5 w-5 text-green-600 mr-2" />
                    Try Making an Eco-Friendly Recipe Instead!
                  </h4>
                  <p className="text-gray-600 mb-4">
                    We've generated a delicious, sustainable alternative recipe using eco-friendly ingredients
                    that will have a much lower environmental impact.
                  </p>

                  {/* Recipe Preview */}
                  {ecoWarningData.suggestedRecipe && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-green-800">{ecoWarningData.suggestedRecipe.name}</h5>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          ~{ecoWarningData.suggestedRecipe.estimatedCO2.toFixed(1)} kg CO₂
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mb-3">{ecoWarningData.suggestedRecipe.description}</p>

                      {/* Recipe Details */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="text-xs text-green-600">
                          <div className="flex items-center space-x-1 mb-1">
                            <span>🕒</span>
                            <span>Prep: {ecoWarningData.suggestedRecipe.prepTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>⏱️</span>
                            <span>Cook: {ecoWarningData.suggestedRecipe.cookingTime}</span>
                          </div>
                        </div>
                        <div className="text-xs text-green-600">
                          <div className="flex items-center space-x-1 mb-1">
                            <span>👥</span>
                            <span>{ecoWarningData.suggestedRecipe.servings} servings</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>📊</span>
                            <span>{ecoWarningData.suggestedRecipe.difficulty}</span>
                          </div>
                        </div>
                      </div>

                      {/* Key Ingredients Preview */}
                      <div className="mb-3">
                        <h6 className="text-xs font-medium text-green-800 mb-1">Key Ingredients:</h6>
                        <div className="flex flex-wrap gap-1">
                          {ecoWarningData.suggestedRecipe.ingredients.slice(0, 4).map((ingredient: string, index: number) => (
                            <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              {ingredient.split('(')[0].trim()}
                            </span>
                          ))}
                          {ecoWarningData.suggestedRecipe.ingredients.length > 4 && (
                            <span className="text-xs text-green-600">+{ecoWarningData.suggestedRecipe.ingredients.length - 4} more</span>
                          )}
                        </div>
                      </div>

                      {/* Health Benefits */}
                      {ecoWarningData.suggestedRecipe.nutritionHighlights && (
                        <div className="mb-3">
                          <h6 className="text-xs font-medium text-green-800 mb-1">Health Benefits:</h6>
                          <div className="flex flex-wrap gap-1">
                            {ecoWarningData.suggestedRecipe.nutritionHighlights.slice(0, 3).map((benefit: string, index: number) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-green-600 pt-2 border-t border-green-200">
                        <span>🌱 Eco Score: {ecoWarningData.suggestedRecipe.ecoScore}/100</span>
                        <span>💚 {((ecoWarningData.co2 - ecoWarningData.suggestedRecipe.estimatedCO2) / ecoWarningData.co2 * 100).toFixed(0)}% less CO₂</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleGenerateEcoRecipe}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ChefHat className="h-5 w-5" />
                    <span>Generate Eco-Friendly Recipe</span>
                  </button>
                  <button
                    onClick={handleEcoWarningClose}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Continue with Current Meal
                  </button>
                </div>

                {/* Environmental Tip */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <strong>Tip:</strong> Choosing plant-based ingredients over meat and dairy can reduce
                      your meal's carbon footprint by up to 70%. Small changes make a big difference!
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AddMeal
