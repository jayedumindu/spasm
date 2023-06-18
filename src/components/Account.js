import { Button } from "@mui/base";
import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { TextField } from "@mui/material";
import { useAuth0, User } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

import { createEmptyAudioTrack, createEmptyVideoTrack } from "../media/stream";
import Chat from "./Chat";

function Account() {
  const navigate = useNavigate();
  const { code } = useParams();
  const myVideo = document.createElement("video");

  const [peer, setPeer] = useState(null);

  const [connection, setConnection] = useState(null);
  const [call, setCall] = useState(null);

  const sendMessage = (message) => {
    let messageToHost = {
      name: user?.name,
      avatar: user?.picture,
      message: message,
      id: connection.connectionId,
    };
    connection.send(JSON.stringify(messageToHost));
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

  const { isAuthenticated, user, } = useAuth0();

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
    const userConnection = peer.connect(code, {
      metadata: { userName: user.name, email: user.email, avatar: user.picture },
    });
    userConnection.on("open", function () {
      // Receive messages
      userConnection.on("data", function (data) {
        let receivedMessage = JSON.parse(data);
        receivedMessage.author && (receivedMessage.author.id = 2);
        console.log(data);
        setMessages((prev) => {
          return [...prev, receivedMessage];
        });
      });
    });
    const userCall = peer.call(code, stream);
    userCall.on("stream", (remoteStream) => {
      console.log("menna hambenwa badu");
      removeFromDOM("localVideo");
      attachToDOM("localVideo", remoteStream);
    });
    setCall(userCall);
    setConnection(userConnection);
  };

  const removeFromDOM = (id, stream) => {
    let elem = document.getElementById(id);
    if (elem) elem.remove();
  };

  const attachToDOM = (id, stream) => {
    console.log("dom ekata attach una");
    let videoElem = document.createElement("video");
    videoElem.id = id;
    videoElem.width = 940;
    videoElem.height = 460;
    videoElem.autoplay = true;
    videoElem.muted = false;
    videoElem.setAttribute("playsinline", true);
    const parent = document.body.querySelector(".video-mask");
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
        <div className="stream-main">
          <div className="stream-header">
            <h3>Header</h3>
          </div>
          <div className="stream-body">
            <div className="mediaWrapper">
              <div className="video-mask"></div>
            </div>
            <Chat messages={messages} handleOnSendMessage={sendMessage} />
          </div>
          <div className="buttonBar">
            <button>Hiiiii</button>
          </div>
        </div>
      </>
    )
  );
}

export default Account;
