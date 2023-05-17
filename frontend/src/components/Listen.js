import Peer from "peerjs";
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { createEmptyAudioTrack as audioTrack, createEmptyVideoTrack as videoTrack} from '../media/stream'

function Listen() {
  const { state } = useLocation();

  //  on mounted
  useEffect(() => {
    const myVideo = document.createElement("video");
    const myPeer = new Peer(undefined, {
      host: "spasm-peer-server.onrender.com",
      path: "/connect",
      port: "443",
      secure: true,
    });

    myPeer.on("open", function () {
      const connection = myPeer.connect(state.hostId);
      const call = myPeer.call(
        state.hostId,
        new MediaStream([audioTrack(), videoTrack({ width: 640, height: 480 })])
      );
      call.on("stream", (remoteStream) => {
        console.log("streaming is happening!!!!");
        myVideo.srcObject = remoteStream;
        myVideo.muted = true;
        myVideo.addEventListener("loadedmetadata", () => {
          myVideo.play();
        });
        document.body.append(myVideo);
      });
      call.on("close", (remoteStream) => {
        myVideo.remove()
      });
      call.on("disconnect", (remoteStream) => {
        myVideo.remove()
      });
    });
  })

  
  return (
    <div>
      <h1>Listen Page</h1>
      <h1>Props are</h1>
    </div>
  );
}

export default Listen;
