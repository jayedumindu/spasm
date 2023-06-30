import { IconButton } from "@mui/material";
import Peer from "peerjs";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
// buttons
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import AlertDialog from "./AlertDialog";
import BackDrop from "./BackDrop";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Chat from "./Chat";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function Stream() {
  const { state } = useLocation();
  const { user } = useAuth0();

  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [screenShare, setScreen] = useState(false);
  const [callOngoing, setCallOngoing] = useState(false);
  const [peer, setPeer] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [connections, setConnections] = useState([]);
  const [calls, setCalls] = useState([]);
  const [users, setUsers] = useState([]);

  const [userId, setUserId] = useState(null);

  // messages
  const [messages, setMessages] = useState([
    {
      text: "user2 has joined the conversation",
      timestamp: 1578366389250,
      type: "notification",
    },
    {
      author: {
        username: "user1",
        id: 1,
        avatarUrl: "https://image.flaticon.com/icons/svg/2446/2446032.svg",
      },
      text: "Hi",
      type: "text",
      timestamp: 1578366393250,
    },
    {
      author: { username: "user2", id: 2, avatarUrl: null },
      text: "Show two buttons",
      type: "text",
      timestamp: 1578366425250,
      buttons: [
        {
          type: "URL",
          title: "Yahoo",
          payload: "http://www.yahoo.com",
        },
        {
          type: "URL",
          title: "Example",
          payload: "http://www.example.com",
        },
      ],
    },
    {
      author: {
        username: "user1",
        id: 1,
        avatarUrl: "https://image.flaticon.com/icons/svg/2446/2446032.svg",
      },
      text: "What's up?",
      type: "text",
      timestamp: 1578366425250,
      hasError: true,
    },
  ]);

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

  const endCall = () => {
    // save meeting data
    saveMeeting();
    peer.disconnect();
    peer.destroy();
    handleClickOpen();
  };

  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const BASE_URL = "http://127.0.0.1:6500";

  const saveMeeting = async () => {
    let data = {
      peerId: peer.id,
      host: user.email,
      users: users,
      startTime: startTime,
      endTime: Date.now(),
      messages: messages,
    };
    console.log(data);
    console.log("save karanna yanne");
    let res = await axios.post(`${BASE_URL}/save/meeting`, data);
    console.log("meeting data succesfully saved! : " + res.data);
  };

  // only when mounted
  useEffect(() => {
    // retreiving the element
    shareWebCam();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  useEffect(() => {
    let message = messages.at(-1);
    console.log(message);
    connections.forEach((connection) => {
      console.log(connection);
      if (connection.connectionId !== message.connection) {
        connection.send(JSON.stringify(message));
      }
    });
  }, [messages]);

  const startCall = () => {
    setLoading(true);
    const peer = new Peer(undefined, {
      host: "spasm-peer-server.onrender.com",
      path: "/connect",
      port: "443",
      secure: true,
    });
    setPeer(peer);
    peer.on("open", function (id) {
      console.log("connection opened : " + id);
      setUserId(id);
      setCallOngoing(true);
      setTimeout(() => {
        setLoading(false);
        setStartTime(Date.now());
      }, 2000);
    });

    peer.on("connection", (con) => {
      con.on("data", (data) => {
        // parse the JSON string
        let receivedMessage = JSON.parse(data);
        setMessages((prev) =>
          prev.concat({
            author: {
              username: receivedMessage?.name,
              id: 2,
              avatarUrl: receivedMessage?.picture,
            },
            text: receivedMessage?.message,
            timestamp: +new Date(),
            type: "text",
            connection: receivedMessage?.id,
          })
        );
      });
      setMessages((prev) => {
        return [
          ...prev,
          {
            text: `${con.metadata.userName} has joined the conversation`,
            type: "notification",
          },
        ];
      });
      let { email, userName, avatar } = con.metadata;
      setUsers((prev) => [...prev, { email, userName, avatar }]);
      setConnections((prev) => [...prev, con]);
      con.on("open", () => {
        console.log("opened");
      });
      con.on("close", () => {
        console.log("connection closed");
        setMessages((prev) => {
          return [
            ...prev,
            {
              text: `${con.metadata.userName} has left the conversation`,
              type: "notification",
            },
          ];
        });
        // remove the user from userList
        setUsers((prev) => prev.filter((user) => user.email != email));
      });
    });
    peer.on("call", (call) => {
      console.log("call ekak awa");
      // if both are present
      if (cam.current && screen.current) {
        console.log("methana thamai");
        call.answer(overlay.current.captureStream());
      } else {
        console.log("patan gatta");
        call.answer(cam.current.captureStream());
        console.log("dunna");
      }
      // add to "calls"
      setCalls((calls) => [...calls, call]);
      peer.on("close", (con) => {
        //  close the call
        connections.forEach((con) => {
          con.close();
        });
        console.log("peer stopped! /n call stopped");
      });
    });
  };

  function attachMediaStream(id, audio, video) {
    let elem = document.getElementById(id);
    navigator.mediaDevices
      .getUserMedia({
        video: video,
        audio: audio,
      })
      .then((stream) => {
        if (elem) {
          if (typeof elem.srcObject === "object") {
            elem.srcObject = new MediaStream(stream.getTracks());
          } else {
            elem.src = window.URL.createObjectURL(stream);
          }
        } else {
          throw new Error("Unable to attach media stream");
        }
      });
  }

  const shareWebCam = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: video,
        audio: audio,
      })
      .then((stream) => {
        cam.current = attachToDOM("cameraData", stream, true);
      });
  };

  const captureScreen = async () => {
    try {
      localScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: false,
      });
      screen.current = attachToDOM("screenData", localScreenStream, true);
      // merge both screen and camera to a canvas
      await mergeStreams();
      replaceStream(overlay.current.captureStream());
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
  function attachToDOM(id, stream, append) {
    let videoElem = document.createElement("video");
    videoElem.id = id;
    videoElem.width = 640;
    videoElem.height = 360;
    videoElem.autoplay = true;
    videoElem.muted = true;
    videoElem.setAttribute("playsinline", true);
    // videoElem.style.display = display ? display : "block"
    const parent = document.body.querySelector(".video-mask");
    videoElem.srcObject = new MediaStream(stream.getTracks());
    append && parent.append(videoElem);
    // parent.append(videoElem);
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
      let imageData = canvasCtx.getImageData(0, 0, 640, 360); // this makes it work
      canvasCtx.putImageData(imageData, 0, 0); // properly on safari/webkit browsers too
      canvasCtx.restore();
      requestVideoFrame(makeComposite);
    }
  }

  async function mergeStreams() {
    await makeComposite();
    audioContext = new AudioContext();
    audioDestination = audioContext.createMediaStreamDestination();
    let fullVideoStream = canvasElement.captureStream();
    localOverlayStream = new MediaStream([...fullVideoStream.getVideoTracks()]);
    if (localOverlayStream) {
      overlay.current = attachToDOM(
        "pipOverlayStream",
        localOverlayStream,
        false
      );
      console.log("overlay attached!!!");
    }
  }

  const replaceStream = async (mediaStream) => {
    console.log(calls);
    calls.forEach((call) => {
      const peerConnection = call.peerConnection;
      if (peerConnection) {
        for (const sender of peerConnection.getSenders()) {
          if (sender.track.kind == "audio") {
            if (mediaStream.getAudioTracks().length > 0) {
              sender.replaceTrack(mediaStream.getAudioTracks()[0]);
            }
          }
          if (sender.track.kind == "video") {
            if (mediaStream.getVideoTracks().length > 0) {
              sender.replaceTrack(mediaStream.getVideoTracks()[0]);
            }
          }
        }
      }
    });
  };

  const audioToggle = () => {
    if (!audio) {
      attachMediaStream("cameraData", !audio, video);
    } else {
      // stop audio sharing
      let mediaStream = document.getElementById("cameraData").srcObject;
      mediaStream.getAudioTracks().forEach((track) => track.stop());
    }
    replaceStream(cam.current.captureStream());
    console.log("audio replace kra");
    setAudio(!audio);
  };

  const videoToggle = () => {
    if (!video) {
      attachMediaStream("cameraData", audio, !video);
    } else {
      // stop video sharing
      let mediaStream = document.getElementById("cameraData").srcObject;
      mediaStream.getVideoTracks().forEach((track) => track.stop());
    }
    replaceStream(cam.current.captureStream());
    console.log("video replace kra");

    setVideo(!video);
  };

  const screenToggle = () => {
    if (!screenShare) {
      captureScreen();
    } else {
      screen.current = null;
      overlay.current = null;
      replaceStream(cam.current.captureStream());
      // remove from DOM
      document.querySelector(".video-mask :nth-child(2)").remove()

    }
    setScreen(!screenShare);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userId);
  };

  const handleOnSendMessage = (message) => {
    console.log(message);
    setMessages(
      messages.concat({
        author: {
          username: user?.name,
          id: 1,
          avatarUrl: user?.picture,
        },
        text: message,
        timestamp: +new Date(),
        type: "text",
      })
    );
  };

  return (
    <div className="stream-main">
      <div
        className={`${callOngoing ? "stream-main-1-started" : "stream-main-1"}`}
      >
        <div className="stream-header">
          {callOngoing && (
            <>
              <h1>{userId}</h1>
              <IconButton onClick={copyToClipboard} className="copy-btn">
                <ContentCopyIcon />
              </IconButton>
            </>
          )}
        </div>
        <div className="stream-body">
          <AlertDialog open={open} handleClose={handleClose} />
          <BackDrop open={isLoading} title={"establishing a connection  "} />
          <div className="mediaWrapper">
            <div className="video-mask"></div>
          </div>
        </div>
        <div className="buttonBar">
          <IconButton onClick={audioToggle} className="stream-btn">
            {audio && <MicIcon />}
            {!audio && <MicOffIcon />}
          </IconButton>
          <IconButton onClick={videoToggle} className="stream-btn">
            {video && <VideocamIcon />}
            {!video && <VideocamOffIcon />}
          </IconButton>
          <IconButton onClick={screenToggle} className="stream-btn">
            {screenShare && <ScreenShareIcon />}
            {!screenShare && <StopScreenShareIcon />}
          </IconButton>
          <IconButton
            onClick={callOngoing ? endCall : startCall}
            className={`stream-btn stream-btn-call ${
              callOngoing ? "stream-btn-call-started" : "stream-btn-call-ended"
            }`}
          >
            {!callOngoing && (
              <>
                <p>start</p> &nbsp;
                <CallIcon />
              </>
            )}
            {callOngoing && (
              <>
                <p>end</p> &nbsp;
                <CallEndIcon />
              </>
            )}
          </IconButton>
        </div>
      </div>

      {callOngoing && (
        <div className="stream-main-2">
          <Chat messages={messages} handleOnSendMessage={handleOnSendMessage} />
        </div>
      )}
    </div>
  );
}

export default Stream;
