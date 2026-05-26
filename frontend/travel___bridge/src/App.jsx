import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Hero from './pages/hero'
import Signup from './pages/signup'
import Login from './pages/login'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App


