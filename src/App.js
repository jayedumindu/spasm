import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Disconnected from "./components/Disconected";
import Homepage from "./components/Homepage";
import Dashboard from "./components/Dashboard";
import Account from "./components/Account";
import Stream from "./components/Stream";
import Listen from "./components/Listen";
import RouteGuard from "./components/RouteGuard";
import SplashScreen from "./components/SplashScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/account" element={<RouteGuard component={Account} />} />

      <Route path="/stream" element={<RouteGuard component={Stream} />} />

      <Route path="/stream/end" element={<RouteGuard component={Homepage} />} />

      <Route path="/join/:code" element={<RouteGuard component={Account} />} />
    </Routes>
  );
}

export default App;
