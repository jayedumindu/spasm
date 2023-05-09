import { Button, TextField } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { BrowserToRtmpClient } from "@api.video/browser-to-rtmp-client";
import { Peer } from "peerjs";


const { io } = require("socket.io-client");


function Dashboard() {

  // const socket = useRef(io("http://localhost:3080"));

  const myVideo = document.createElement("video");

  const myPeer = useRef(
    new Peer(undefined, {
      host: "spasm-peer-server.onrender.com",
      path: "/connect",
      port: "443",
      secure: true
    })
  );

  // const message = useRef(null)

  let users = [];

  let mainStream = null;

  const recordAndStream = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        mainStream = stream;
        // addVideoStream(myVideo, stream);

        // myPeer.on("call", (call) => {
        //   call.answer(stream);
        //   const video = document.createElement("video");
        //   call.on("stream", (userVideoStream) => {
        //     addVideoStream(video, userVideoStream);
        //   });
        // });

        // myPeer.on("open", (id) => {
        //   socket.emit("user-connected", id);
        // });

        // socket.current.on("user-connected", (userId) => {
        //   users.push(userId);
        //   console.log("me denna hadanne");
        //   connectToNewUser(userId, stream);
        // });
      });
  };

  myPeer.current.on("open", function (id) {
    console.log("My peer ID is: " + id);
  });

  myPeer.current.on("connection", (con) => {
    console.log("connection ekak athi unaaaa")
    con.on("data", (data) => console.log("new message : " + data));
  });

  myPeer.current.on("call", (call) => {
    call.answer(mainStream);
    console.log("clientgen call ekak awaa")
  });

  // socket.current.on("user-connected", (userId) => {
  //   users.push(userId);
  //   console.log("methant nam enwa");
  //   connectToNewUser(userId, mainStream);
  // });

  const addVideoStream = function (video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    document.body.appendChild(video);
  };

  // socket.on("connect", () => {
  //   console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  // });

  // const sendMessage = () => {
  //   socket.emit("send-message", message);
  // };

  function connectToNewUser(userId, stream) {
    console.log(myPeer.current);
    const call = myPeer.current.call(userId, stream);

    // const video = document.createElement("video");
    // call.on("stream", (userVideoStream) => {
    //   addVideoStream(video, userVideoStream);
    // });
    // call.on("close", () => {
    //   video.remove();
    // });

    // peers[userId] = call;
  }

  return (
    <>
      <div className="md:container md:mx-auto p-5">
        <h1 className="text-center">Start your live STREAM!!!!</h1>
        <div className="flex flex-wrap justify-center gap-5">
          {/* <p>Enter a topic</p> */}
          <TextField className="w-3/4" label="Enter a topic" />
          {/* <p>Give a brief description</p> */}
          <TextField className="w-3/4" label="Give a brief description" />
          <div className="breaker" />
          <Button className="w-1/5 p-5">Start</Button>
        </div>

        {/* container for video streaming */}
        <div className="panel w-full h-[32rem] bg-slate-500">
          {/* <Webcam
            className="w-1/5 bottom-0 left-0 m-auto"
            ref={webCamRef}
            onUserMedia={handleUserMedia}
          /> */}
        </div>
        <Button onClick={recordAndStream}>stream</Button>
      </div>
    </>
  );
}

export default Dashboard;
