import React from "react";
import ReactDOM  from 'react-dom/client'
import Dashboard from "./components/Dashboard/Dashboard";
import './index.css'


const root = ReactDOM.createRoot(document.getElementById("main"));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);

