import React from "react";
import ReactDOM  from 'react-dom/client'
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import './index.css'
import Account from "./components/Account";


const root = ReactDOM.createRoot(document.getElementById("main"));
root.render(
  <React.StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Routes>
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

