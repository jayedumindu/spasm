import { Button } from "@mui/base";
import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { TextField } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

import { createEmptyAudioTrack, createEmptyVideoTrack } from "../media/stream";

function Account() {
  const navigate = useNavigate();
  const { code } = useParams();
  const myVideo = document.createElement("video");

  const [peer, setPeer] = useState(null);

  const [message, setMessage] = useState(null);
  const [connection, setConnection] = useState(null);
  const [call, setCall] = useState(null);
  const [ongoing, setOngoing] = useState(false);

  const sendMessage = () => {
    connection.send(message);
  };

  const connectWithHost = () => {
    const peerConnection = new Peer(undefined, {
      host: "spasm-peer-server.onrender.com",
      path: "/connect",
      port: "443",
      secure: true,
    });
    peerConnection.on("open", (id) => {
      console.log("client id" + id);
      setPeer(peerConnection);
    });
  };

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    // when cmoponent mounts
    connectWithHost();
  }, []);

  useEffect(() => {
    console.log("refreshes!");
  });

  useEffect(() => {
    // when peer changes
    console.log("peer changes");
    if (peer) {
      sendVideoStream();
    }
  }, [peer]);

  const sendVideoStream = () => {
    console.log("stream eka ywnwa");
    const stream = new MediaStream([
      createEmptyAudioTrack(),
      createEmptyVideoTrack({ width: 640, height: 480 }),
    ]);
    const userCall = peer.call(code, stream);
    userCall.on("stream", (remoteStream) => {
      console.log("menna hambenwa badu");
      if (!ongoing) {
        attachToDOM("localVideo", remoteStream);
        setOngoing(true)
      }
    });
    setCall(userCall);
  };

  const attachToDOM = (id, stream) => {
    console.log("dom ekata attach una");
    let videoElem = document.createElement("video");
    videoElem.id = id;
    videoElem.width = 640;
    videoElem.height = 360;
    videoElem.autoplay = true;
    videoElem.muted = false;
    videoElem.setAttribute("playsinline", true);
    const parent = document.body.querySelector(".mask");
    videoElem.srcObject = stream;
    parent.append(videoElem);
  };

  const addConnection = function () {
    let conn = peer.connect(code);
    setConnection(conn);
    conn.on("open", function () {
      // Receive messages
      conn.on("data", function (data) {
        console.log("Received", data);
      });
    });
  };

  return (
    isAuthenticated && (
      <>
        {/* <Navbar /> */}
        <h1>User Account</h1>
        {/* <button onClick={sendVideoStream}>listen to the stream</button> */}

        {/* <button onClick={connectWithHost}>Connect to this ID</button> */}
        <div className="mask"></div>
        <hr />
        <TextField
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>send</button>
      </>
    )
  );
}

export default Account;
