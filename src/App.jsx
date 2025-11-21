import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import ReceiverGroup from "./pages/Receiver_Group";

function App() {
  return (
    <>
      <Routes>
        <Route path="/receiver_Group" element={<ReceiverGroup />} />
      </Routes>
    </>
  );
}

export default App;
