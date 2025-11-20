const { Server } = require("socket.io");

let onlineUsers = {};

function socketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ADD USER
    socket.on("addUser", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("onlineUsers", onlineUsers);
    });

    // SEND MESSAGE
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const receiverSocketId = onlineUsers[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getMessage", {
          senderId,
          text,
        });
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      Object.keys(onlineUsers).forEach((userId) => {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
        }
      });

      io.emit("onlineUsers", onlineUsers);
      console.log("User disconnected");
    });
  });
}

module.exports = socketServer;