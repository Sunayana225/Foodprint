import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AddMeal = lazy(() => import('./pages/AddMeal'))
const RecipeGeneratorSimple = lazy(() => import('./pages/RecipeGeneratorSimple'))
const ProfileSimple = lazy(() => import('./pages/ProfileSimple'))
const Challenges = lazy(() => import('./pages/Challenges'))
const ChallengeProgress = lazy(() => import('./pages/ChallengeProgress'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))

// Component to conditionally render Footer only on homepage
function ConditionalFooter() {
  const location = useLocation()

  // Only show footer on the homepage (landing page)
  if (location.pathname === '/') {
    return <Footer />
  }

  return null
}

function App() {
  useEffect(() => {
    console.log('🚀 FoodPrint App initialized');
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="pt-16 flex-grow">
            <Suspense fallback={
              <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            }>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/recipe-generator" element={
                  <ProtectedRoute>
                    <RecipeGeneratorSimple />
                  </ProtectedRoute>
                } />

                <Route path="/add-meal" element={
                  <ProtectedRoute>
                    <AddMeal />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfileSimple />
                  </ProtectedRoute>
                } />
                <Route path="/challenges" element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Challenges />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } />
                <Route path="/challenges/:challengeId" element={
                  <ProtectedRoute>
                    <ChallengeProgress />
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </main>
            <ConditionalFooter />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
