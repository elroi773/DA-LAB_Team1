import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import ReceiverMain from "./pages/Receiver_main";

function App() {
  return (
    <>
      <Routes>
        <Route path="/receiver" element={<ReceiverMain />} />
      </Routes>
    </>
  );
}

export default App;
