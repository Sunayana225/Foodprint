import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChefHat,
  Plus,
  Clock,
  Users,
  TreePine,
  Droplets,
  Heart,
  Sparkles,
  X,
  CheckCircle
} from 'lucide-react'
import { foodService } from '../utils/foodService'

// Define Recipe type locally to avoid import issues
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

const RecipeGenerator = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [customIngredient, setCustomIngredient] = useState('')
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

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
      alert('Please select at least 2 ingredients to generate a recipe!')
      return
    }

    setIsGenerating(true)
    try {
      console.log('🍳 Generating recipe with ingredients:', selectedIngredients)
      const recipe = await foodService.generateRecipe(selectedIngredients)
      console.log('✅ Recipe generated successfully:', recipe)

      if (!recipe) {
        throw new Error('Recipe generation returned null')
      }

      setGeneratedRecipe(recipe)
    } catch (error) {
      console.error('❌ Error generating recipe:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to generate recipe: ${errorMessage}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Fair'
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl shadow-xl mr-6">
              <ChefHat className="h-12 w-12 text-white" />
            </div>
            <h1 className="section-title">AI Recipe Generator</h1>
          </div>
          <p className="section-subtitle">
            Create healthy, eco-friendly recipes from your favorite ingredients with AI-powered suggestions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Ingredient Selection */}
          <div className="space-y-6">
            {/* Custom Ingredient Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <h2 className="text-xl font-semibold gradient-text mb-4">Add Your Ingredients</h2>
              <div className="flex space-x-2 mb-4">
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
                  className="btn-primary px-4"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            {/* Popular Ingredients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-semibold gradient-text mb-4">Popular Ingredients</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {popularIngredients.map((ingredient, index) => (
                  <motion.button
                    key={ingredient}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => addIngredient(ingredient)}
                    disabled={selectedIngredients.includes(ingredient)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                      selectedIngredients.includes(ingredient)
                        ? 'border-green-500 bg-green-50 text-green-700 cursor-not-allowed'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    {ingredient}
                    {selectedIngredients.includes(ingredient) && (
                      <CheckCircle className="h-4 w-4 inline ml-1" />
                    )}
                  </motion.button>
                ))}
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
                <h2 className="text-xl font-semibold gradient-text mb-4">
                  Selected Ingredients ({selectedIngredients.length})
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-2 hover:text-primary-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={generateRecipe}
                  disabled={selectedIngredients.length < 2 || isGenerating}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating Recipe...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Generate Recipe</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Column - Generated Recipe */}
          <div className="space-y-6">
            {generatedRecipe ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="card"
              >
                <div className="mb-6">
                  <img
                    src={generatedRecipe.image}
                    alt={generatedRecipe.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{generatedRecipe.title}</h2>

                  {/* Recipe Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-sm font-medium">{generatedRecipe.prepTime + generatedRecipe.cookTime} min</div>
                      <div className="text-xs text-gray-500">Total Time</div>
                    </div>
                    <div className="text-center">
                      <Users className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                      <div className="text-sm font-medium">{generatedRecipe.servings}</div>
                      <div className="text-xs text-gray-500">Servings</div>
                    </div>
                    <div className="text-center">
                      <TreePine className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <div className="text-sm font-medium">{generatedRecipe.totalCO2.toFixed(1)} kg</div>
                      <div className="text-xs text-gray-500">CO₂</div>
                    </div>
                    <div className="text-center">
                      <Droplets className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-medium">{(generatedRecipe.totalWater / 1000).toFixed(1)}L</div>
                      <div className="text-xs text-gray-500">Water</div>
                    </div>
                  </div>

                  {/* Health Score */}
                  <div className="flex items-center justify-center mb-6 p-4 bg-gray-50 rounded-lg">
                    <Heart className={`h-6 w-6 mr-2 ${getHealthScoreColor(generatedRecipe.healthScore)}`} />
                    <span className="text-lg font-semibold text-gray-900">Health Score: </span>
                    <span className={`text-lg font-bold ml-1 ${getHealthScoreColor(generatedRecipe.healthScore)}`}>
                      {generatedRecipe.healthScore}/100 ({getHealthScoreLabel(generatedRecipe.healthScore)})
                    </span>
                  </div>
                </div>

                {/* Ingredients List */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {generatedRecipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="card text-center"
              >
                <ChefHat className="h-24 w-24 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Cook?</h3>
                <p className="text-gray-600 mb-4">
                  Select at least 2 ingredients from the left panel to generate a personalized,
                  eco-friendly recipe with health insights.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <TreePine className="h-4 w-4 mr-1 text-green-500" />
                    Low Carbon Footprint
                  </div>
                  <div className="flex items-center justify-center">
                    <Heart className="h-4 w-4 mr-1 text-red-500" />
                    Health Optimized
                  </div>
                  <div className="flex items-center justify-center">
                    <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                    AI Generated
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeGenerator
