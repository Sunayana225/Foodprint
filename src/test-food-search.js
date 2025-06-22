// Simple test to verify food search functionality
import { foodService } from './utils/foodService.js'

// Test local food database
console.log('Testing local food database...')
const allFoods = foodService.getAllFoods()
console.log(`Total foods in database: ${allFoods.length}`)

// Test searching for Indian foods
const indianFoods = allFoods.filter(food => 
  food.name.toLowerCase().includes('idli') ||
  food.name.toLowerCase().includes('dosa') ||
  food.name.toLowerCase().includes('dal') ||
  food.name.toLowerCase().includes('roti')
)

console.log('Indian foods found:')
indianFoods.forEach(food => {
  console.log(`- ${food.name} (${food.category}) - CO2: ${food.co2}kg, Water: ${food.water}L`)
})

// Test search functionality
console.log('\nTesting search for "idli":')
const idliResults = allFoods.filter(food => 
  food.name.toLowerCase().includes('idli')
)
console.log(`Found ${idliResults.length} results for "idli"`)
idliResults.forEach(food => {
  console.log(`- ${food.name}: ${food.calories} calories, ${food.protein}g protein`)
})
