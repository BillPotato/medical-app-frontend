import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import FeelingAnalyzerPage from './pages/FeelingAnalyzerPage'
import MedicationParserPage from './pages/MedicationParserPage'
import SurveyPage from './pages/SurveyPage'

function App() {
  const [tasks, setTasks] = useState([])
  const isAuthenticated = !!localStorage.getItem('token')

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem('tasks') || '[]')
    setTasks(t)
  }, [])

  function saveTasks(newTasks) {
    const merged = [...newTasks, ...tasks]
    localStorage.setItem('tasks', JSON.stringify(merged))
    setTasks(merged)
  }

  function handleSurveySubmit(payload) {
    console.log('Survey submitted:', payload)
    // You can add additional logic here if needed
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth routes - only accessible when NOT logged in */}
          <Route
            path="/auth/*"
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />}
          />

          {/* Protected routes - only accessible when logged in */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardPage tasks={tasks} /> : <Navigate to="/auth/signin" replace />
            }
          />

          <Route
            path="/medication-parser"
            element={
              isAuthenticated ? <MedicationParserPage onSave={saveTasks} /> : <Navigate to="/auth/signin" replace />
            }
          />

          <Route
            path="/survey"
            element={
              isAuthenticated ? <SurveyPage onSubmit={handleSurveySubmit} /> : <Navigate to="/auth/signin" replace />
            }
          />

          <Route
            path="/feeling-analyzer"
            element={
              isAuthenticated ? <FeelingAnalyzerPage /> : <Navigate to="/auth/signin" replace />
            }
          />

          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth/signin"} replace />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
