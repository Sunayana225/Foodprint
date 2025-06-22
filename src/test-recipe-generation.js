// Simple test to verify recipe generation functionality
import { foodService } from './utils/foodService.js'

console.log('🧪 Testing Recipe Generation...')

// Test 1: Basic recipe generation
console.log('\n📝 Test 1: Basic recipe generation')
try {
  const testIngredients = ['chicken', 'tomatoes', 'onions', 'garlic']
  console.log('Input ingredients:', testIngredients)
  
  const recipe = await foodService.generateRecipe(testIngredients)
  console.log('✅ Recipe generated successfully!')
  console.log('Title:', recipe.title)
  console.log('Prep time:', recipe.prepTime, 'minutes')
  console.log('Cook time:', recipe.cookTime, 'minutes')
  console.log('Servings:', recipe.servings)
  console.log('Ingredients count:', recipe.ingredients.length)
  console.log('Instructions count:', recipe.instructions.length)
  console.log('CO2 impact:', recipe.totalCO2, 'kg')
  console.log('Health score:', recipe.healthScore, '/100')
} catch (error) {
  console.error('❌ Test 1 failed:', error)
}

// Test 2: Indian curry recipe
console.log('\n📝 Test 2: Indian curry recipe')
try {
  const indianIngredients = ['chicken', 'tomatoes', 'onions', 'ginger', 'garlic', 'rice']
  console.log('Input ingredients:', indianIngredients)
  
  const recipe = await foodService.generateRecipe(indianIngredients)
  console.log('✅ Indian recipe generated successfully!')
  console.log('Title:', recipe.title)
  console.log('Should be curry-style:', recipe.title.toLowerCase().includes('curry'))
} catch (error) {
  console.error('❌ Test 2 failed:', error)
}

// Test 3: Vegetable salad
console.log('\n📝 Test 3: Vegetable salad recipe')
try {
  const saladIngredients = ['tomatoes', 'spinach', 'bell peppers']
  console.log('Input ingredients:', saladIngredients)
  
  const recipe = await foodService.generateRecipe(saladIngredients)
  console.log('✅ Salad recipe generated successfully!')
  console.log('Title:', recipe.title)
  console.log('Cook time should be 0:', recipe.cookTime === 0)
} catch (error) {
  console.error('❌ Test 3 failed:', error)
}

// Test 4: Error handling
console.log('\n📝 Test 4: Error handling with empty ingredients')
try {
  const emptyIngredients = []
  const recipe = await foodService.generateRecipe(emptyIngredients)
  console.log('Recipe with empty ingredients:', recipe)
} catch (error) {
  console.log('✅ Error handling works:', error.message)
}

console.log('\n🎉 Recipe generation tests completed!')
