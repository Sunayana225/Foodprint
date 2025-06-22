import { useState } from 'react'
import { ChefHat, Plus, Clock, Users, TreePine, Droplets, Heart, Sparkles } from 'lucide-react'
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

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [customIngredient, setCustomIngredient] = useState('')
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-lg mr-4">
              <ChefHat className="h-12 w-12 text-white" />
            </div>
            <h1 className="section-title">Recipe Generator</h1>
          </div>
          {/* Quick Test Button for Development */}
          {import.meta.env.DEV && (
            <button
              onClick={() => {
                setSelectedIngredients(['chicken', 'tomatoes', 'onions', 'garlic'])
                setTimeout(() => generateRecipe(), 100)
              }}
              className="mb-4 px-4 py-2 bg-accent-600 text-white rounded-xl hover:bg-accent-700 text-sm font-medium shadow-md transition-all duration-300"
            >
              🧪 Quick Test (Dev Only)
            </button>
          )}
          <p className="section-subtitle">
            Create delicious, eco-friendly recipes from your favorite ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Ingredient Selection */}
          <div className="space-y-6">
            {/* Custom Ingredient Input */}
            <div className="card">
              <h2 className="text-xl font-semibold gradient-text mb-4">Add Your Ingredients</h2>
              <div className="flex space-x-3 mb-4">
                <input
                  type="text"
                  placeholder="Enter any ingredient..."
                  value={customIngredient}
                  onChange={(e) => setCustomIngredient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomIngredient()}
                  className="input-field flex-1"
                />
                <button
                  onClick={addCustomIngredient}
                  className="btn-primary px-6"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Popular Ingredients */}
            <div className="card">
              <h3 className="text-lg font-semibold gradient-text mb-4">Popular Ingredients</h3>
              <div className="grid grid-cols-2 gap-3">
                {popularIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => addIngredient(ingredient)}
                    disabled={selectedIngredients.includes(ingredient)}
                    className={`p-3 text-sm rounded-xl border-2 transition-all duration-300 font-medium ${
                      selectedIngredients.includes(ingredient)
                        ? 'bg-gradient-to-r from-accent-100 to-accent-200 border-accent-300 text-accent-800 cursor-not-allowed shadow-inner'
                        : 'bg-white border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 hover:shadow-md transform hover:-translate-y-0.5'
                    }`}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Ingredients */}
            {selectedIngredients.length > 0 && (
              <div className="card-interactive">
                <h3 className="text-lg font-semibold gradient-text mb-4">
                  Selected Ingredients ({selectedIngredients.length})
                </h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {selectedIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300 shadow-sm"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-2 text-primary-600 hover:text-primary-800 font-bold text-lg leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={generateRecipe}
                  disabled={isGenerating}
                  className="btn-primary-large w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 rounded-xl shadow-md">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-red-600" />
                      {error}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Recipe Display */}
          <div className="space-y-6">
            {generatedRecipe ? (
              <div className="card">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl shadow-lg mr-4">
                    <ChefHat className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">{generatedRecipe.title}</h2>
                </div>

                {/* Recipe Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="stat-card text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                    <div className="text-lg font-bold text-primary-800">{generatedRecipe.prepTime + generatedRecipe.cookTime} min</div>
                    <div className="text-sm text-primary-600 font-medium">Total Time</div>
                  </div>
                  <div className="stat-card text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-secondary-600" />
                    <div className="text-lg font-bold text-secondary-800">{generatedRecipe.servings}</div>
                    <div className="text-sm text-secondary-600 font-medium">Servings</div>
                  </div>
                  <div className="stat-card text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <TreePine className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="text-lg font-bold text-green-800">{generatedRecipe.totalCO2.toFixed(1)} kg</div>
                    <div className="text-sm text-green-600 font-medium">CO₂ Impact</div>
                  </div>
                  <div className="stat-card text-center bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
                    <Heart className="h-6 w-6 mx-auto mb-2 text-accent-600" />
                    <div className="text-lg font-bold text-accent-800">{generatedRecipe.healthScore}/100</div>
                    <div className="text-sm text-accent-600 font-medium">Health Score</div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold gradient-text mb-4">Ingredients</h3>
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
                    <ul className="space-y-3">
                      {generatedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center text-primary-800 font-medium">
                          <span className="w-3 h-3 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full mr-4 shadow-sm"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-xl font-bold gradient-text mb-4">Instructions</h3>
                  <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-6 border border-secondary-200">
                    <ol className="space-y-4">
                      {generatedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex text-secondary-800">
                          <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold rounded-full flex items-center justify-center mr-4 mt-0.5 shadow-md">
                            {index + 1}
                          </span>
                          <span className="font-medium leading-relaxed">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Generate Another Recipe Button */}
                <div className="mt-8 pt-6 border-t-2 border-primary-200">
                  <button
                    onClick={() => setGeneratedRecipe(null)}
                    className="btn-secondary w-full"
                  >
                    <Sparkles className="h-5 w-5" />
                    Generate Another Recipe
                  </button>
                </div>
              </div>
            ) : (
              <div className="card text-center">
                <div className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl mb-6">
                  <ChefHat className="h-24 w-24 mx-auto mb-4 text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-3">Ready to Cook?</h3>
                <p className="text-lg text-primary-700 mb-6 leading-relaxed">
                  Select at least 2 ingredients from the left panel to generate a delicious, eco-friendly recipe.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center justify-center space-x-2 text-green-700 bg-green-50 rounded-xl p-3">
                    <TreePine className="h-4 w-4" />
                    <span className="font-medium">Eco-friendly recipes</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-accent-700 bg-accent-50 rounded-xl p-3">
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">Health insights</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-primary-700 bg-primary-50 rounded-xl p-3">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">Step-by-step instructions</span>
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
