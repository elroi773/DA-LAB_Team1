import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
// import Before from './component/Before_Ui'
import Group from './component/Group'
import ReceiverMain from "./pages/Receiver_main";
import Login from "./pages/Login/Login";
import SignUp from './pages/SignUp/SignUp';
import ReceiverMain from "./pages/Receiver_main";
import SpaceMain from './pages/SpaceMain';

function App() {
  return (
    <>
      <Routes>
        <Route path="/receiver" element={<ReceiverMain />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/receiver" element={<ReceiverMain />} />
        <Route path="/space" element={<SpaceMain />} />
        
      </Routes>
    </>
  );
}

export default App;
