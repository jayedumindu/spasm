import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";

import "./index.css";

import App from "./App";
import Auth0ProviderWithNavigation from "./components/Auth0ProviderWithNavigation";

const root = ReactDOM.createRoot(document.getElementById("main"));

root.render(
  <BrowserRouter>
    <Auth0ProviderWithNavigation>
      <App />
    </Auth0ProviderWithNavigation>
  </BrowserRouter>
);

// "start": "sudo kill -9 $(sudo lsof -t -i:3000) || react-scripts start",
