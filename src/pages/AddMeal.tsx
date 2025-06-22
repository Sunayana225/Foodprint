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
  Lightbulb
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

      // Show success and redirect
      showSuccessToast(
        'Meal Saved Successfully! 🎉',
        `Your ${selectedMealType} has been tracked with ${carbonFootprint.toFixed(1)}kg CO₂ impact.`
      )
      navigate('/dashboard')
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
      </div>
    </div>
  )
}

export default AddMeal
