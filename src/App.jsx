import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import SpaceMain from './pages/SpaceMain'



function App() {
  return (
    <>
      <Routes>
        <Route path="/space" element={<SpaceMain />} />
      </Routes>
    </>
  )
}

export default App
