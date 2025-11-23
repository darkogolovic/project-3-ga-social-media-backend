const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://circle-sociall.netlify.app"
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const onlineUsers = new Map(); 

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("Online users:", Array.from(onlineUsers.keys()));
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
    
      for (let [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) onlineUsers.delete(uid);
      }
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("User disconnected:", socket.id);
    });

    
    socket.on("joinRoom", (conversationId) => {
      socket.join(conversationId);
      console.log("Joined room:", conversationId);
    });

    socket.on("sendMessage", (data) => {
      console.log("Message received:", data);
      io.to(data.conversationId).emit("receiveMessage", data);
    });
  });
};
