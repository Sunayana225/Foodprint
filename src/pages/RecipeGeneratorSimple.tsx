import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ChefHat, Plus, Clock, Users, TreePine, Droplets, Heart, Sparkles, Leaf } from 'lucide-react'
import { foodService } from '../utils/foodService'

// Define Recipe type locally
interface Recipe {
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

const RecipeGeneratorSimple = () => {
  console.log('🔍 RecipeGeneratorSimple component rendering...')

  const location = useLocation()
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [customIngredient, setCustomIngredient] = useState('')
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFromEcoWarning, setIsFromEcoWarning] = useState(false)

  // Handle suggested recipe from environmental warning
  useEffect(() => {
    const state = location.state as any
    if (state?.suggestedRecipe && state?.fromEcoWarning) {
      console.log('🌱 Loading eco-friendly recipe from environmental warning:', state.suggestedRecipe)

      // Convert the eco recipe format to our Recipe interface
      const ecoRecipe: Recipe = {
        id: 'eco-' + Date.now(),
        title: state.suggestedRecipe.name,
        ingredients: state.suggestedRecipe.ingredients,
        instructions: state.suggestedRecipe.instructions,
        prepTime: parseInt(state.suggestedRecipe.prepTime?.split('-')[0]) || 15,
        cookTime: parseInt(state.suggestedRecipe.cookingTime?.split('-')[0]) || 20,
        servings: state.suggestedRecipe.servings || 2,
        totalCO2: state.suggestedRecipe.estimatedCO2 || 2.0,
        totalWater: 500, // Estimated low water usage
        healthScore: state.suggestedRecipe.ecoScore || 90
      }

      setGeneratedRecipe(ecoRecipe)
      setIsFromEcoWarning(true)

      // Set ingredients from the recipe
      const recipeIngredients = state.suggestedRecipe.ingredients
        .slice(0, 6) // Take first 6 ingredients
        .map((ing: string) => ing.split('(')[0].split(' ').slice(-1)[0]) // Extract main ingredient name
      setSelectedIngredients(recipeIngredients)
    }
  }, [location.state])

  const popularIngredients = [
    'Chicken', 'Salmon', 'Tofu', 'Quinoa', 'Brown Rice', 'Lentils',
    'Spinach', 'Broccoli', 'Bell Peppers', 'Tomatoes', 'Avocado',
    'Sweet Potato', 'Mushrooms', 'Onions', 'Garlic', 'Ginger'
  ]

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient])
    }
  }

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(ing => ing !== ingredient))
  }

  const addCustomIngredient = () => {
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient.trim())) {
      setSelectedIngredients([...selectedIngredients, customIngredient.trim()])
      setCustomIngredient('')
    }
  }

  const generateRecipe = async () => {
    if (selectedIngredients.length < 2) {
      setError('Please select at least 2 ingredients to generate a recipe!')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      console.log('🍳 Generating recipe with ingredients:', selectedIngredients)
      console.log('🔧 FoodService available:', !!foodService)
      console.log('🔧 GenerateRecipe method available:', typeof foodService.generateRecipe)

      const recipe = await foodService.generateRecipe(selectedIngredients)
      console.log('✅ Recipe generated successfully:', recipe)

      if (!recipe) {
        throw new Error('Recipe generation returned null')
      }

      setGeneratedRecipe(recipe)
    } catch (error) {
      console.error('❌ Error generating recipe:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(`Failed to generate recipe: ${errorMessage}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          {isFromEcoWarning && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl mx-2 sm:mx-0">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2" />
                <h2 className="text-base sm:text-lg font-semibold text-green-800">Eco-Friendly Recipe Generated!</h2>
              </div>
              <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                This sustainable recipe was created to help reduce your environmental impact.
                It uses eco-friendly ingredients with a much lower carbon footprint.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 space-y-3 sm:space-y-0">
            <div className={`p-2 sm:p-3 rounded-2xl shadow-lg sm:mr-4 ${
              isFromEcoWarning
                ? 'bg-gradient-to-br from-green-600 to-green-700'
                : 'bg-gradient-to-br from-orange-600 to-orange-700'
            }`}>
              <ChefHat className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {isFromEcoWarning ? 'Eco-Friendly Recipe' : 'Recipe Generator'}
            </h1>
          </div>

          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Create delicious, eco-friendly recipes from your favorite ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Ingredient Selection */}
          <div className="space-y-4 sm:space-y-6">
            {/* Custom Ingredient Input */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Add Your Ingredients</h2>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                  type="text"
                  placeholder="Enter any ingredient..."
                  value={customIngredient}
                  onChange={(e) => setCustomIngredient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomIngredient()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
                <button
                  onClick={addCustomIngredient}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <Plus className="h-5 w-5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            </div>

            {/* Popular Ingredients */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Popular Ingredients</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
                {popularIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => addIngredient(ingredient)}
                    disabled={selectedIngredients.includes(ingredient)}
                    className={`p-2 sm:p-3 text-xs sm:text-sm rounded-lg border-2 transition-all duration-300 font-medium ${
                      selectedIngredients.includes(ingredient)
                        ? 'bg-green-100 border-green-300 text-green-800 cursor-not-allowed'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:shadow-md transform hover:-translate-y-0.5'
                    }`}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Ingredients */}
            {selectedIngredients.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 border-l-4 border-l-orange-500">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Selected Ingredients ({selectedIngredients.length})
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                  {selectedIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-orange-100 text-orange-800 border border-orange-200 shadow-sm"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-2 text-orange-600 hover:text-orange-800 font-bold text-lg leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={generateRecipe}
                  disabled={isGenerating}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Generating Recipe...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6" />
                      <span>Generate Recipe</span>
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-red-600" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Recipe Display */}
          <div className="space-y-4 sm:space-y-6">
            {generatedRecipe ? (
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
                  <div className={`p-2 rounded-xl shadow-lg sm:mr-4 ${
                    isFromEcoWarning
                      ? 'bg-gradient-to-br from-green-500 to-green-600'
                      : 'bg-gradient-to-br from-orange-500 to-orange-600'
                  }`}>
                    <ChefHat className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{generatedRecipe.title}</h2>
                    {isFromEcoWarning && (
                      <div className="flex items-center mt-1">
                        <Leaf className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-700 font-medium">Environmentally Friendly</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Eco-friendly benefits banner */}
                {isFromEcoWarning && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
                    <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                      <TreePine className="h-5 w-5 mr-2" />
                      Environmental Benefits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Low carbon footprint
                      </div>
                      <div className="flex items-center text-blue-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Sustainable ingredients
                      </div>
                      <div className="flex items-center text-purple-700">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Plant-based nutrition
                      </div>
                    </div>
                  </div>
                )}

                {/* Recipe Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center border border-gray-200">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-base sm:text-lg font-bold text-gray-800">{generatedRecipe.prepTime + generatedRecipe.cookTime}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Time</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center border border-blue-200">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-base sm:text-lg font-bold text-blue-800">{generatedRecipe.servings}</div>
                    <div className="text-xs sm:text-sm text-blue-600 font-medium">Servings</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center border border-green-200">
                    <TreePine className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-green-600" />
                    <div className="text-base sm:text-lg font-bold text-green-800">{generatedRecipe.totalCO2.toFixed(1)}</div>
                    <div className="text-xs sm:text-sm text-green-600 font-medium">kg CO₂</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 sm:p-4 text-center border border-orange-200">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-orange-600" />
                    <div className="text-base sm:text-lg font-bold text-orange-800">{generatedRecipe.healthScore}</div>
                    <div className="text-xs sm:text-sm text-orange-600 font-medium">Health Score</div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                    <ul className="space-y-2 sm:space-y-3">
                      {generatedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start text-gray-800 font-medium text-sm sm:text-base">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Instructions</h3>
                  <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
                    <ol className="space-y-3 sm:space-y-4">
                      {generatedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex text-gray-800">
                          <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="font-medium leading-relaxed text-sm sm:text-base">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 space-y-3">
                  <button
                    onClick={generateRecipe}
                    disabled={isGenerating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        <span>Generate Another Recipe</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setGeneratedRecipe(null)
                      setIsFromEcoWarning(false)
                    }}
                    className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Start Fresh</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center border border-gray-200">
                <div className="p-6 bg-gray-50 rounded-xl mb-6">
                  <ChefHat className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Ready to Cook?</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
                  Select at least 2 ingredients from the left panel to generate a delicious, eco-friendly recipe.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center justify-center space-x-2 text-green-700 bg-green-50 rounded-lg p-3">
                    <TreePine className="h-4 w-4" />
                    <span className="font-medium">Eco-friendly</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-orange-700 bg-orange-50 rounded-lg p-3">
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">Health insights</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-blue-700 bg-blue-50 rounded-lg p-3">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">Step-by-step</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeGeneratorSimple
