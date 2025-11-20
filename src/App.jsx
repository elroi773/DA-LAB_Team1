import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import LookBook from './pages/LookBook'
import GroupCreate from './pages/GroupCreate'
import GiverMain from './pages/GiverMain'


function App() {
  return (
    <>
      <Routes>
        <Route path="/look-book" element={<LookBook />} />
        <Route path="/groupcreate" element={<GroupCreate />}/>
        <Route path="/" element={<GiverMain />}/>
      </Routes>
    </>
  )
}

export default App
