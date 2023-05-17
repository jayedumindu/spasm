import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import React, { useEffect } from "react";

function Homepage() {
  const { loginWithRedirect, logout } = useAuth0();

  const login = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/account",
      },
    });
  };
  useEffect(() => {
    console.log("mounted");
  }, []);
  useEffect(() => {
    console.log("rendered");
  });
  return (
    <>
      <h1>This is homepage</h1>
      <button onClick={login}>Log In</button>
      <button onClick={logout}>Log Out</button>
    </>
  );
}

export default Homepage;
