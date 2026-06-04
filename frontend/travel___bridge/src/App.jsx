import { Routes, Route } from 'react-router-dom'
import Hero from './pages/hero'
import Signup from './pages/signup'
import Login from './pages/login'
import ForgotPassword from './pages/forgotPassword'
import Dashboard from './pages/dashboard'
import TextTranslate from './pages/texttranslate'
import VoiceTranslate from './pages/voicetranslate'
import CameraTranslate from './pages/cameratranslate'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/text-translate" element={
          <ProtectedRoute>
            <TextTranslate />
          </ProtectedRoute>
        } />
        <Route path="/voice-translate" element={
          <ProtectedRoute>
            <VoiceTranslate />
          </ProtectedRoute>
        } />
        <Route path="/camera-translate" element={
          <ProtectedRoute>
            <CameraTranslate />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App


