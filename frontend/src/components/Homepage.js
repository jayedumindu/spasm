import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Button, IconButton, TextField, Toolbar, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Slider from "./Slider";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import KeyboardIcon from "@mui/icons-material/Keyboard";

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
      <div className="home">
        <Navbar />
        <div className="home-main">
          <div className="home-inner-1">
            <h1 className="font-bold text-5xl basis-full">
              Premium video meetings for everyone
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consectetur, dolorum dolore adipisci quisquam suscipit cupiditate
              sed natus mollitia vel exercitationem, fugiat saepe magni
              dignissimos soluta ratione nulla dolor, ipsa quaerat.
            </p>
            <Button startIcon={<VideoCallIcon />} onClick={() => window.location.pathname = "/stream"}>New Meeting</Button>
            <TextField
              label={
                <>
                  <KeyboardIcon /> Enter code here
                </>
              }
            />
            <hr />
          </div>
          <div className="home-inner-2">
            <Slider />
          </div>
          {/* <h1>This is homepage</h1>
        <button onClick={login}>Log In</button>
        <button onClick={logout}>Log Out</button> */}
        </div>
      </div>
    </>
  );
}

export default Homepage;
