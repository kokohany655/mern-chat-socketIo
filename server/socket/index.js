const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const dotenv = require("dotenv");
const { getIdUserFromToken } = require("../controller/auth");
const { User } = require("../models/UserModel");

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUser = new Set();

io.on("connection", (socket) => {
  console.log("connect user", socket.id);

  const token = socket.handshake.auth.token;
  const userId = getIdUserFromToken(token);
  socket.join(userId);
  onlineUser.add(userId);

  socket.emit("onlineUser", Array.from(onlineUser));
  socket.on("message-page", async (userID) => {
    const user = await User.findById(userID).select("name email pic").lean();

    const payload = {
      ...user,
      online: onlineUser.has(userId),
    };
    socket.emit("message-user", payload);
  });
  io.on("disconnect", () => {
    onlineUser.delete(userId);
    console.log("disconnect user", socket.id);
  });
});

module.exports = {
  app,
  server,
};
