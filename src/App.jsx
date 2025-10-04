// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, Suspense } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'

// Import pages
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
      const enhancedTasks = t.map(task => ({
        ...task,
        completed: task.completed || [],
        isActive: task.isActive !== undefined ? task.isActive : true,
        times: task.times || ['08:00'],
        createdAt: task.createdAt || new Date().toISOString()
      }))
      setTasks(enhancedTasks)
    } catch (err) {
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  function saveTasks(newTasks) {
    const enhancedTasks = newTasks.map(task => ({
      ...task,
      completed: task.completed || [],
      isActive: task.isActive !== undefined ? task.isActive : true,
      times: task.times || ['08:00'],
      createdAt: task.createdAt || new Date().toISOString()
    }))

    const merged = [...enhancedTasks, ...tasks]
    localStorage.setItem('tasks', JSON.stringify(merged))
    setTasks(merged)
  }

  function handleUpdateTask(updatedTask) {
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    )
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    setTasks(updatedTasks)
  }

  function handleDeleteTask(taskId) {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    setTasks(updatedTasks)
  }

  function handleSurveySubmit(payload) {
    console.log('Survey submitted:', payload)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <ThemeProvider>
      <Router>
        {/* Remove the fixed background classes here - let each page handle its own background */}
        <div className="App min-h-screen theme-transition">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route
                path="/auth/*"
                element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />}
              />

              <Route
                path="/dashboard"
                element={isAuthenticated ? (
                  <DashboardPage
                    tasks={tasks}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                  />
                ) : (
                  <Navigate to="/auth/signin" replace />
                )}
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

              <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth/signin"} replace />}
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
