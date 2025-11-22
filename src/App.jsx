import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from "./pages/Login/Login";
import SignUp from './pages/SignUp/SignUp';
import ReceiverMain from "./pages/Receiver_main";
import SpaceMain from './pages/SpaceMain';
import LookBook from './pages/LookBook';
import GroupCreate from './pages/GroupCreate';
import GiverMain from './pages/GiverMain';
import Intro from './pages/Intro';
import GroupStatistics from "./pages/GroupStatistics.jsx";
import Receiver_Group from "./pages/Receiver_Group.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Intro/>}/>
        <Route path="/receiver-main" element={<ReceiverMain />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<SpaceMain />} />
        <Route path="/look-book" element={<LookBook />} />
        <Route path="/groupcreate" element={<GroupCreate />}/>
        <Route path="/giver-main" element={<GiverMain />}/>
        <Route path="/groupstatistics" element={<GroupStatistics/>}/>
        <Route path="/receiver_Group" element={<Receiver_Group/>}/>
      </Routes>
    </>
  );
}

export default App;
