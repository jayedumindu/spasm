import { Button, TextField } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { BrowserToRtmpClient } from "@api.video/browser-to-rtmp-client";
import { Peer } from "peerjs";
import { useNavigate } from "react-router-dom";

const { io } = require("socket.io-client");

function Dashboard() {
  const mainStream = useRef(null);
  const hostId = useRef(null);
  const navigate = useNavigate();

  const joinStream = () => {
    // TODO
    // first, pass the hostId to Stream componenent using routes
    navigate("/join", {
      state: { peer: "peer", hostId: hostId.current },
      replace: false,
    });
  };

  const recordAndStream = () => {
    navigate("/stream", {
      state: { audio: true, video: true, screen: false },
      replace: false,
    });
    
  };

  // myPeer.current.on("open", function (id) {
  //   console.log("My peer ID is: " + id);
  // });

  // myPeer.current.on("connection", (con) => {
  //   con.on("data", (data) => console.log("new message : " + data));
  // });

  // myPeer.current.on("call", (call) => {
  //   call.answer(mainStream.current);
  // });

  return (
    <>
      <div className="md:container md:mx-auto p-5">
        <div className="flex flex-wrap justify-center gap-5">
          <TextField className="w-3/4" label="Enter a topic" />
          <TextField className="w-3/4" label="Give a brief description" />
          <div className="breaker" />
          <Button onClick={recordAndStream}>stream</Button>

          <div className="breaker" />
          <h3>or</h3>
          <div className="breaker" />
          <TextField
            className="w-3/4"
            label="Enter code"
            onChange={(event) => {
              hostId.current = event.target.value;
            }}
          />
          <Button onClick={joinStream}>join</Button>
        </div>

        {/* container for video streaming */}
        {/* <div className="panel w-full h-[32rem] bg-slate-500">
        </div> */}
      </div>
    </>
  );
}

export default Dashboard;
