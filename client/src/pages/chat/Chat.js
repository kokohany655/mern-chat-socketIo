import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const Chat = () => {
  const param = useParams();

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_API, {
      auth: {
        token: localStorage.getItem("token-chat-forge"),
      },
      withCredentials: true,
    });

    socket.emit("message-page", param.userId);

    socket.on("message-user", (data) => {
      console.log({ data });
    });
  }, []);

  return <div>Chat</div>;
};

export default Chat;
