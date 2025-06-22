import React, { useState, useEffect, useRef } from 'react'
import { Search, Loader2, Plus } from 'lucide-react'
import { foodApiService } from '../services/foodApiService'
import { foodService } from '../utils/foodService'
import type { FoodSearchResult } from '../types/food'

interface FoodSearchInputProps {
  onFoodSelect: (food: FoodSearchResult) => void
  placeholder?: string
  className?: string
}

const FoodSearchInput: React.FC<FoodSearchInputProps> = ({
  onFoodSelect,
  placeholder = "Search for foods...",
  className = ""
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FoodSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Enhanced search with alternative names
  const searchLocalFoods = (query: string) => {
    const searchTerm = query.toLowerCase()

    // Alternative names mapping
    const alternativeNames: { [key: string]: string[] } = {
      'brinjal': ['eggplant', 'aubergine'],
      'eggplant': ['brinjal', 'aubergine'],
      'bhindi': ['okra', 'lady finger'],
      'okra': ['bhindi', 'lady finger'],
      'gobi': ['cauliflower'],
      'cauliflower': ['gobi'],
      'aloo': ['potato'],
      'potato': ['aloo'],
      'pyaz': ['onion'],
      'onion': ['pyaz'],
      'adrak': ['ginger'],
      'ginger': ['adrak'],
      'lehsun': ['garlic'],
      'garlic': ['lehsun'],
      'chana': ['chickpeas', 'chickpea', 'garbanzo'],
      'chickpeas': ['chana', 'garbanzo'],
      'matar': ['peas', 'green peas'],
      'peas': ['matar', 'green peas'],
      'palak': ['spinach'],
      'spinach': ['palak']
    }

    return foodService.getAllFoods().filter(food => {
      // Direct name match
      if (food.name.toLowerCase().includes(searchTerm) ||
          food.category.toLowerCase().includes(searchTerm)) {
        return true
      }

      // Check alternative names
      for (const [key, alternatives] of Object.entries(alternativeNames)) {
        if (searchTerm.includes(key)) {
          return alternatives.some(alt => food.name.toLowerCase().includes(alt))
        }
        if (alternatives.some(alt => searchTerm.includes(alt))) {
          return food.name.toLowerCase().includes(key)
        }
      }

      return false
    }).map(food => ({
      ...food,
      source: 'local' as const
    }))
  }

  // Debounced search function
  const performSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      // Search local database first
      const localResults = searchLocalFoods(searchQuery)
      
      // Only search USDA if local results are insufficient
      if (localResults.length < 5) {
        const usdaResults = await foodApiService.searchFoods(searchQuery)
        const combinedResults = [...localResults, ...usdaResults]
        const uniqueResults = combinedResults.filter((food, index, self) =>
          index === self.findIndex(f => f.name.toLowerCase() === food.name.toLowerCase())
        ).slice(0, 10)
        setResults(uniqueResults)
      } else {
        setResults(localResults.slice(0, 10))
      }
      
      setIsOpen(true)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Error searching foods:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      performSearch(value)
    }, 300)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleFoodSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle food selection
  const handleFoodSelect = (food: FoodSearchResult) => {
    onFoodSelect(food)
    setQuery('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const getRiskColor = (risk?: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="input-field pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {results.length > 0 ? (
            results.map((food, index) => (
              <button
                key={food.id}
                onClick={() => handleFoodSelect(food)}
                className={`w-full p-3 text-left hover:bg-primary-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  index === selectedIndex ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-900 truncate pr-2">
                    {food.name}
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {food.healthRisk && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(food.healthRisk)}`}>
                        {food.healthRisk}
                      </span>
                    )}
                    {food.source === 'usda' && food.id.startsWith('off-') && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                        Global
                      </span>
                    )}
                    {food.source === 'usda' && food.id.startsWith('usda-') && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                        USDA
                      </span>
                    )}
                    {food.source === 'local' && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        Local
                      </span>
                    )}
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {food.category} • {food.co2.toFixed(1)} kg CO₂ • {food.water.toFixed(0)}L water
                </div>
                {food.calories && (
                  <div className="text-xs text-gray-400 mt-1">
                    {food.calories.toFixed(0)} cal • {food.protein?.toFixed(1)}g protein
                  </div>
                )}
              </button>
            ))
          ) : query.length >= 2 && !isLoading ? (
            <div className="p-4 text-center text-gray-500">
              No foods found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default FoodSearchInput
