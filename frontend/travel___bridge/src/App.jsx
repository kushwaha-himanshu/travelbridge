import { Routes, Route } from 'react-router-dom'
import Hero from './pages/hero'
import Signup from './pages/signup'
import Login from './pages/login'
import Dashboard from './pages/dashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App


