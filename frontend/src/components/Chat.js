import React from "react";
import { ChatFeed, Message } from "react-chat-ui";
import ChatBox, { ChatFrame } from "react-chat-plugin";

function Chat({ messages, handleOnSendMessage}) {
  return (
    <div className="chatBox">
      <ChatBox
        messages={messages}
        userId={1}
        onSendMessage={handleOnSendMessage}
        width={"400px"}
        height={"500px"}
      />
    </div>
  );
}

export default Chat;
