// pages/AuthPage.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from '../components/auth/SignIn'
import SignUp from '../components/auth/SignUp'

export default function AuthPage() {
  const isAuthenticated = !!localStorage.getItem('token')

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/auth/signin" replace />} />
      </Routes>
    </div>
  )
}
