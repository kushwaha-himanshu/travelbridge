import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Hero from './pages/hero'
import Signup from './pages/signup'
import Login from './pages/login'
import ForgotPassword from './pages/forgotPassword'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}

export default App


