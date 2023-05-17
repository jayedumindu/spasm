import { Button } from "@mui/base";
import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { TextField } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
const { io } = require("socket.io-client");

function Account() {
  const navigate = useNavigate();
  const myVideo = document.createElement("video");

  const myPeer = useRef(
    new Peer(undefined, {
      host: "spasm-peer-server.onrender.com",
      path: "/connect",
      port: "443",
      secure: true,
    })
  );

  const hostId = useRef(null);
  const message = useRef(null);
  const connection = useRef(null);
  const call = useRef(null);

  const sendMessage = () => {
    connection.current.send(message.current);
  };

  const connectWithHost = () => {
    connection.current = myPeer.current.connect(hostId.current);
  };

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    // when cmoponent mounts
  }, []);

  const sendVideoStream = () => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    getUserMedia(
      { video: true, audio: true },
      (stream) => {
        // myVideo.srcObject = stream;
        // myVideo.muted = true;
        // myVideo.play();
        console.log("call ekak dunna");
        call.current = myPeer.current.call(hostId.current, stream);
        call.current.on("stream", (remoteStream) => {
          console.log("menna hambenwa badu");
          myVideo.srcObject = remoteStream;
          myVideo.muted = true;
          myVideo.addEventListener("loadedmetadata", () => {
            myVideo.play();
          });
          document.body.append(myVideo);
        });
        setCallEvents();
      },
      (err) => {
        console.log("Error!");
      }
    );
  };

  const setCallEvents = () => {
    // call.current.on("stream", (remoteStream) => {
    //   console.log("menna hambenwa badu")
    //   myVideo.srcObject.srcObject = remoteStream;
    //   myVideo.muted = true;
    //   this.friendVideo.play();
    // });
  };

  // const connectToHost = (stream) => {
  //   const connection = myPeer.current.call(hostId.current,stream);
  //   const video = document.createElement("video");
  //   video.muted = true;
  //   // console.log(call)
  //   connection.on("stream", (userVideoStream) => {
  //     addVideoStream(video, userVideoStream);
  //   });
  //   console.log("connected with host " + hostId.current);
  // };

  // when a call is received

  // myPeer.current.on("call", (call) => {
  //   call.answer();
  //   console.log("answer kara");
  //   const video = document.createElement("video");
  //   video.muted = true;
  //   call.on("stream", (userVideoStream) => {
  //     addVideoStream(video, userVideoStream);
  //   });
  // });

  myPeer.current.on("open", (id) => {
    console.log("client id" + id);
  });

  const addVideoStream = function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    document.body.appendChild(video);
    console.log("add unaaaa");
  };

  // managing socket connection

  // socket.current.on("connect", () => {
  //   console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  // });

  // if (!isAuthenticated) {
  //   navigate("/home");
  //   console.log("user not authenticated!!")
  //   return
  // }
  console.log(isAuthenticated)
  return (
    isAuthenticated && (
      <>
        <h1>User Account</h1>
        <button onClick={sendVideoStream}>listen to the stream</button>
        <TextField
          onChange={(event) => (hostId.current = event.target.value)}
        />
        <button onClick={connectWithHost}>Connect to this ID</button>
        <hr />
        <TextField
          onChange={(event) => {
            message.current = event.target.value;
          }}
        />
        <button onClick={sendMessage}>send</button>
      </>
    )
  );
}

export default Account;
