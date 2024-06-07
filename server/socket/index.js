const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const dotenv = require("dotenv");
const { getIdUserFromToken } = require("../controller/auth");
const { User } = require("../models/UserModel");
const { Conversion } = require("../models/chatModel");
const { Message } = require("../models/MessageModel");
const { getConversation } = require("../utils/getConversation");

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


  const token = socket.handshake.auth.token;
  const userId = getIdUserFromToken(token);
  socket.join(userId);
  onlineUser.add(userId);

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userID) => {
    const user = await User.findById(userID).select("name email pic").lean();

    const payload = {
      ...user,
    };
    socket.emit("message-user", payload);

    const getConversationMessage = await Conversion.findOne({
      "$or" : [
          { sender : userId, receiver :userID },
          { sender : userID, receiver :  userId}
      ]
  }).populate('messages').sort({ updatedAt : -1 })

  socket.emit("message" , getConversationMessage.messages)
  });

  socket.on("new-message", async (data) => {
    let conversation = await Conversion.findOne({
      $or: [
        { sender: data.sender, receiver: data.receiver },
        { sender: data.receiver, receiver: data.sender },
      ],
    });

    if (!conversation) {
      const createConversation = new Conversion({
        sender: data.sender,
        receiver: data.receiver,
      });

      conversation = await createConversation.save();
    }

    const message = new Message(data);

    const saveMessage = await message.save();

    const updateConversation = await Conversion.findByIdAndUpdate(
    {_id :  conversation._id},
      { "$push": { messages: saveMessage?._id } },
      { new: true }
    );
    
    const getConversationMessage = await Conversion.findOne({
      "$or" : [
          { sender : data?.sender, receiver : data?.receiver },
          { sender : data?.receiver, receiver :  data?.sender}
      ]
  }).populate('messages').sort({ updatedAt : -1 })


  io.to(data?.sender).emit("conversation" , getConversationMessage?.messages || [])
  io.to(data?.receiver).emit("conversation" , getConversationMessage?.messages || [])

  const conversationSideBarSender = await getConversation(data?.sender)
  const conversationSideBarReceiver = await getConversation(data?.receiver)

  io.to(data?.sender).emit("conversation-sidBar" , conversationSideBarSender)
  io.to(data?.receiver).emit("conversation-sidBar" , conversationSideBarReceiver)
  });


  socket.on("sideBar" ,async (currentUser)=>{

    const conversation= await getConversation(currentUser)

    socket.emit("conversation-sidBar" ,  conversation)

  })

  socket.on("seen" , async(userIdConversationOpen)=>{
    const getConversationId = await Conversion.findOne({
      "$or":[
        {sender : userId, receiver: userIdConversationOpen},
        {sender : userIdConversationOpen, receiver: userId},

      ]
    })

    const conversationMessage = getConversationId?.messages || []

    const updateMessages = await Message.updateMany(
      { _id : {"$in" : conversationMessage} , sender:userIdConversationOpen },
      {"$set" : {seen : true}},
      {new :true}
    )

    const conversationSideBarSender = await getConversation(userId)
  const conversationSideBarReceiver = await getConversation(userIdConversationOpen)

  io.to(userId).emit("conversation-sidBar" , conversationSideBarSender)
  io.to(userIdConversationOpen).emit("conversation-sidBar" , conversationSideBarReceiver)
  })

  socket.on("disconnect", () => {
    onlineUser.delete(userId);
    io.emit("onlineUser", Array.from(onlineUser));

  });

 
});

module.exports = {
  app,
  server,
};
