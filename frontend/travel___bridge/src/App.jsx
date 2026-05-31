import { Routes, Route } from 'react-router-dom'
import Hero from './pages/hero'
import Signup from './pages/signup'
import Login from './pages/login'
import ForgotPassword from './pages/forgotPassword'
import Dashboard from './pages/dashboard'
import TextTranslate from './pages/texttranslate'
import VoiceTranslate from './pages/voicetranslate'
import CameraTranslate from './pages/cameratranslate'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/text-translate" element={<TextTranslate />} />
      <Route path="/voice-translate" element={<VoiceTranslate />} />
      <Route path="/camera-translate" element={<CameraTranslate />} />
    </Routes>
  )
}

export default App


