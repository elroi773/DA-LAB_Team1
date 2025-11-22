import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
// import Before from './component/Before_Ui'
import Group from './component/Group'
import ReceiverMain from "./pages/Receiver_main";

function App() {
  return (
    <>
    <Group></Group>
    {/* <Before></Before> */}
      <Routes>
        <Route path="/receiver" element={<ReceiverMain />} />
      </Routes>
    </>
  );
}

export default App;
