import { Button } from "@mui/base";
import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { TextField } from "@mui/material";
const { io } = require("socket.io-client");

function Account() {
  const myVideo = document.createElement("video");

  const myPeer = useRef(
    new Peer(undefined, {
      host: "spasm-peer-server.onrender.com",
      path: "/connect",
      port: "443",
      secure: true
    })
  );

  const hostId = useRef(null);
  const message = useRef(null);
  const connection = useRef(null);

  const sendMessage = () => {
    // console.log(hostId.current)
    // const connection = myPeer.current.connect(hostId.current)
    // console.log(message.current)
    connection.current.send(message.current);
  };

  const connectWithHost = () => {
    connection.current = myPeer.current.connect(hostId.current);
  };

  // const socket = useRef(io("http://localhost:3080"));

  useEffect(() => {
    // when cmoponent mounts
  }, []);

  // const connectWithHost = () => {
  //   var getUserMedia =
  //     navigator.getUserMedia ||
  //     navigator.webkitGetUserMedia ||
  //     navigator.mozGetUserMedia;
  //   getUserMedia(
  //     { video: true, audio: true },
  //     (stream) => {
  //       // myVideo.srcObject = stream;
  //       // myVideo.muted = true;
  //       // myVideo.play();
  //       const call = myPeer.current.call(hostId, stream);
  //       call.on("stream", (remoteStream) => {
  //         myVideo.srcObject.srcObject = remoteStream;
  //         myVideo.muted = true;
  //         this.friendVideo.play();
  //       });
  //     },
  //     (err) => {
  //       console.log("Error!");
  //     }
  //   );
  // };

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

  return (
    <>
      <h1>User Account</h1>
      <button>listen to the stream</button>
      <TextField onChange={(event) => (hostId.current = event.target.value)} />
      <button onClick={connectWithHost}>Connect to this ID</button>
      <hr />
      <TextField
        onChange={(event) => {
          message.current = event.target.value;
        }}
      />
      <button onClick={sendMessage}>send</button>
    </>
  );
}

export default Account;
