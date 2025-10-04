import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, Suspense } from 'react'

// Import all components directly
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import SurveyPage from './pages/SurveyPage'
import MedicationParserPage from './pages/MedicationParserPage'
import FeelingAnalyzerPage from './pages/FeelingAnalyzerPage'

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-8 text-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Patient Helper...</p>
    </div>
  </div>
)

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const isAuthenticated = !!localStorage.getItem('token')

  useEffect(() => {
    try {
      const t = JSON.parse(localStorage.getItem('tasks') || '[]')
      setTasks(t)
    } catch (err) {
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  function saveTasks(newTasks) {
    const merged = [...newTasks, ...tasks]
    localStorage.setItem('tasks', JSON.stringify(merged))
    setTasks(merged)
  }

  function handleSurveySubmit(payload) {
    console.log('Survey submitted:', payload)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/auth/*"
              element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />}
            />

            <Route
              path="/dashboard"
              element={isAuthenticated ? <DashboardPage tasks={tasks} /> : <Navigate to="/auth/signin" replace />}
            />

            <Route
              path="/medication-parser"
              element={isAuthenticated ? <MedicationParserPage onSave={saveTasks} /> : <Navigate to="/auth/signin" replace />}
            />

            <Route
              path="/survey"
              element={isAuthenticated ? <SurveyPage onSubmit={handleSurveySubmit} /> : <Navigate to="/auth/signin" replace />}
            />

            <Route
              path="/feeling-analyzer"
              element={isAuthenticated ? <FeelingAnalyzerPage /> : <Navigate to="/auth/signin" replace />}
            />

            <Route
              path="/"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth/signin"} replace />}
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth/signin"} replace />}
            />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
