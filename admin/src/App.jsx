import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/dashboard" element={<DashboardPage />} />

    </Routes>
  );
};

export default App