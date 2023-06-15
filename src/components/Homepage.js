import { useAuth0 } from "@auth0/auth0-react";
import {
  AppBar,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Slider from "./Slider";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";

function Homepage() {
  const { loginWithRedirect, logout } = useAuth0();
  const [valid, setValid] = useState(false);
  const [code, setCode] = useState(false);

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
  const pattern =
    /[a-z|0-9]{8}-[a-z|0-9]{4}-[a-z|0-9]{4}-[a-z|0-9]{4}-[a-z|0-9]{12}/;
  const validateForRedirect = (event) => {
    let code = event.target.value;
    if (pattern.test(code)) {
      setValid(true);
      setCode(code);
    } else {
      setValid(false);
    }
  };
  return (
    <>
      <div className="home">
        <Navbar />
        <div className="home-main">
          <div className="home-inner-1">
            <h1 className="font-bold text-5xl basis-full">
              <span className="font-adelia">Premium</span> video meetings <br />
              for <span className="font-adelia">everyone</span>
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consectetur, dolorum dolore adipisci quisquam suscipit cupiditate
              sed natus mollitia vel exercitationem, fugiat saepe magni
              dignissimos soluta ratione nulla dolor, ipsa quaerat.
            </p>
            <Button
              startIcon={<VideoCallIcon />}
              onClick={() => (window.location.pathname = "/stream")}
            >
              New Meeting
            </Button>
            <TextField
              onChange={validateForRedirect}
              label={
                <>
                  <KeyboardIcon /> Enter code here
                </>
              }
            />
            {valid && (
              <Button onClick={() => (window.location.pathname = "/join/" + code)}>
                Join
              </Button>
            )}
            <hr />
          </div>
          <div className="home-inner-2">
            <Slider />
          </div>
          
        </div>
      </div>
    </>
  );
}

export default Homepage;
