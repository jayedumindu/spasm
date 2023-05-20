import Peer from "peerjs";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

function Stream() {
  const { state } = useLocation();

  const canvasElement = document.createElement("canvas");
  const canvasCtx = canvasElement.getContext("2d", {
    willReadFrequently: true,
  });

  let localCamStream,
    localScreenStream,
    localOverlayStream,
    audioContext,
    audioDestination;
  let audioTracks = [];
  const screen = useRef(null);
  const cam = useRef(null);
  const overlay = useRef(null);

  const shareWebCam = async () => {
    const myPeer = new Peer(undefined, {
      host: "spasm-peer-server.onrender.com",
      path: "/connect",
      port: "443",
      secure: true,
    });
    const getUserMedia = navigator.mediaDevices.getUserMedia;
    localCamStream = await getUserMedia({
      video: state?.video | true,
      audio: state?.audio | true,
    });
    cam.current = attachToDOM("cameraData", localCamStream);
    myPeer.on("open", function (id) {
      console.log("connection opened : " + id);
      userId.current = id;
    });

    myPeer.on("connection", (con) => {
      con.on("data", (data) => console.log("new message : " + data));
    });

    myPeer.on("call", (call) => {
      console.log("call ekak awa")
      // if both are present
      if (cam.current && screen.current) {
        // let stream = new MediaStream([
        //   ...canvasElement.captureStream().getVideoTracks(),
        // ]);
        // attachToDOM("output", stream);
        // console.log(stream);
        console.log("methana thamai")
        call.answer(overlay.current.captureStream());
      } else {
        console.log("patan gatta");
        call.answer(cam.current.captureStream());
        console.log("dunna");
      }
      myPeer.on("close", (con) => {
        //  close the call
        call.close();
      });
    });
  };

  // only when mounted
  useEffect(() => {
    // shareWebCam();
  }, []);

  const userId = useRef(null);

  const captureScreen = async () => {
    try {
      localScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: false,
      });
      screen.current = attachToDOM("screenData", localScreenStream);
      // merge both screen and camera to a canvas
      await mergeStreams();
    } catch (ex) {
      console.log("Error occurred", ex);
    }
  };

  // animating the canvas
  const requestVideoFrame = function (callback) {
    window.setTimeout(function () {
      callback(Date.now());
    }, 1000 / 60); // 60 fps - just like requestAnimationFrame
  };

  // composing video from html element
  function attachToDOM(id, stream) {
    let videoElem = document.createElement("video");
    videoElem.id = id;
    videoElem.width = 640;
    videoElem.height = 360;
    videoElem.autoplay = true;
    videoElem.muted = true;
    videoElem.setAttribute("playsinline", true);
    videoElem.srcObject = new MediaStream(stream.getTracks());
    document.body.append(videoElem);
    return videoElem;
  }

  // merge webcam and screen to a canvas
  async function makeComposite() {
    if (cam.current && screen.current) {
      canvasCtx.save();
      canvasElement.setAttribute("width", `${screen.current.videoWidth}px`);
      canvasElement.setAttribute("height", `${screen.current.videoHeight}px`);
      canvasCtx.clearRect(
        0,
        0,
        screen.current.videoWidth,
        screen.current.videoHeight
      );
      canvasCtx.drawImage(
        screen.current,
        0,
        0,
        screen.current.videoWidth,
        screen.current.videoHeight
      );
      canvasCtx.drawImage(
        cam.current,
        0,
        Math.floor(screen.current.videoHeight - screen.current.videoHeight / 4),
        Math.floor(screen.current.videoWidth / 4),
        Math.floor(screen.current.videoHeight / 4)
      ); // this is just a rough calculation to offset the webcam stream to bottom left
      // screen.current.
      let imageData = canvasCtx.getImageData(0, 0, 640, 360); // this makes it work
      canvasCtx.putImageData(imageData, 0, 0); // properly on safari/webkit browsers too
      canvasCtx.restore();
      requestVideoFrame(makeComposite);
    }
  }

  async function mergeStreams() {
    // document.getElementById("mutingStreams").style.display = "block";
    await makeComposite();
    audioContext = new AudioContext();
    audioDestination = audioContext.createMediaStreamDestination();
    let fullVideoStream = canvasElement.captureStream();
    // let existingAudioStreams = [
    //   ...(localCamStream ? localCamStream.getAudioTracks() : []),
    //   ...(localScreenStream ? localScreenStream.getAudioTracks() : []),
    // ];
    // audioTracks.push(
    //   audioContext.createMediaStreamSource(
    //     new MediaStream([existingAudioStreams[0]])
    //   )
    // );
    // if (existingAudioStreams.length > 1) {
    //   audioTracks.push(
    //     audioContext.createMediaStreamSource(
    //       new MediaStream([existingAudioStreams[1]])
    //     )
    //   );
    // }
    // audioTracks.map((track) => track.connect(audioDestination));
    // console.log(audioDestination.stream);
    localOverlayStream = new MediaStream([...fullVideoStream.getVideoTracks()]);
    // let fullOverlayStream = new MediaStream([
    //   ...fullVideoStream.getVideoTracks(),
    //   ...audioDestination.stream.getTracks(),
    // ]);
    // console.log(localOverlayStream, existingAudioStreams);
    if (localOverlayStream) {
      overlay.current = attachToDOM("pipOverlayStream", localOverlayStream);
      // mediaRecorder = new MediaRecorder(fullOverlayStream, encoderOptions);
      // mediaRecorder.ondataavailable = handleDataAvailable;
      // overlay.volume = 0;
      // cam.volume = 0;
      // screen.volume = 0;
      // cam.style.display = "none";
      // localCamStream.getAudioTracks().map(track => { track.enabled = false });
      // screen.style.display = "none";
      // localScreenStream.getAudioTracks().map(track => { track.enabled = false });
    }
  }

  return (
    <div>
      <h1>user peer : {userId.current}</h1>

      <button onClick={captureScreen}> share my screen </button>
      <br />
      <button onClick={shareWebCam}> video chat </button>
      <div id="mediaWrapper"></div>
    </div>
  );
}

export default Stream;
