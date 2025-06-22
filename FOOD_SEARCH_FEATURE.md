# Food Search Feature Documentation

## Overview
The FoodPrint app now includes an enhanced food search feature with autocomplete dropdown functionality that integrates both local Indian foods and the USDA FoodData Central API.

## Features

### 🔍 **Smart Autocomplete Search**
- **Real-time search** as you type (minimum 2 characters)
- **Debounced API calls** to prevent excessive requests
- **Keyboard navigation** (arrow keys, enter, escape)
- **Click outside to close** dropdown functionality

### 🥘 **Comprehensive Food Database**
- **Local Indian Foods**: Idli, Dosa, Dal, Roti, Paneer, Samosa, and more
- **USDA Database**: Access to thousands of foods from the USDA FoodData Central API
- **Nutritional Information**: Calories, protein, fat, carbs for each food item
- **Environmental Impact**: CO₂ emissions, water usage, and land use data

### 🚨 **Health Risk Assessment**
- **Risk Levels**: Low, Medium, High risk indicators
- **Color-coded badges** for quick visual identification
- **Health warnings** and considerations for each food
- **Alternative suggestions** for healthier options

## How to Use

### 1. **Navigate to Add Meal Page**
- Go to the "Add Meal" section in the app
- Select your meal type (Breakfast, Lunch, Dinner, Snack)

### 2. **Search for Foods**
- Click on the search input field under "Add Ingredients"
- Start typing the name of any food (e.g., "idli", "chicken", "rice")
- A dropdown will appear with matching results

### 3. **Select Foods**
- Use arrow keys to navigate through results
- Press Enter or click to select a food
- The food will be added to your meal with quantity controls

### 4. **View Details**
- Each food shows environmental impact (CO₂, water usage)
- Health risk levels are displayed with color-coded badges
- Nutritional information is available for most items

## Example Searches

### Indian Foods
- **"idli"** - Traditional South Indian steamed cake
- **"dosa"** - South Indian crepe
- **"dal"** - Lentil curry
- **"roti"** - Indian flatbread
- **"paneer"** - Indian cottage cheese
- **"samosa"** - Fried pastry snack

### International Foods
- **"chicken"** - Various chicken preparations
- **"salmon"** - Fish options
- **"quinoa"** - Healthy grains
- **"avocado"** - Fruits and vegetables

## Technical Implementation

### Components
- **FoodSearchInput**: Autocomplete search component
- **foodApiService**: USDA API integration service
- **foodService**: Local food database management

### API Integration
- **USDA FoodData Central API**: Free government food database
- **Caching**: 5-minute cache for API responses
- **Fallback**: Local database when API is unavailable

### Data Sources
- **Local Database**: 20+ Indian and international foods
- **USDA API**: 300,000+ food items with nutritional data
- **Environmental Data**: Estimated CO₂, water, and land use

## Benefits

### For Users
- **Easy Discovery**: Find foods quickly with autocomplete
- **Comprehensive Data**: Access to both local and international foods
- **Health Awareness**: Understand health implications of food choices
- **Environmental Impact**: Make eco-conscious food decisions

### For Developers
- **Modular Design**: Reusable search component
- **API Integration**: Scalable external data source
- **Performance**: Debounced search and caching
- **Extensible**: Easy to add more food databases

## Future Enhancements
- **Barcode Scanning**: Add foods by scanning product barcodes
- **Recipe Integration**: Search for complete recipes
- **Personalized Suggestions**: AI-powered food recommendations
- **Offline Support**: Cache frequently searched foods locally
- **Multi-language**: Support for regional language food names

## Troubleshooting

### Common Issues
1. **No search results**: Try different spellings or shorter terms
2. **Slow loading**: Check internet connection for USDA API
3. **Missing foods**: Use the local database or suggest additions

### API Limitations
- **Rate Limits**: 1,000 requests per hour with DEMO_KEY
- **Demo Key**: Replace with actual API key for production use
- **Network Dependency**: Requires internet for USDA data

## Getting Started
1. Navigate to the Add Meal page
2. Try searching for "idli" to see Indian foods
3. Try searching for "chicken" to see USDA results
4. Experiment with different food names and categories

The food search feature makes it easy to track your meals while understanding their environmental and health impact!
