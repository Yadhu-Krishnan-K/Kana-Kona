import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

/*
userSocketMap structure

Map {
   userId => Set(socketId)
}
*/

const userSocketMap = new Map();

export const getReceiverSocketIds = (userId) => {
  return userSocketMap.get(userId);
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('a user connected = ',userId)

  if (userId) {
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }

    userSocketMap.get(userId).add(socket.id);
  }

  console.log("User connected:", socket.id);

  // send online users list
  io.emit("getOnlineUsers", [...userSocketMap.keys()]);

  // typing event
  socket.on("typing", ({ receiverId }) => {
    const receiverSockets = getReceiverSocketIds(receiverId);

    if (receiverSockets) {
      receiverSockets.forEach((socketId) => {
        io.to(socketId).emit("typing", true);
      });
    }
  });

  // stop typing
  socket.on("stoppedTyping", ({ receiverId }) => {
    const receiverSockets = getReceiverSocketIds(receiverId);

    if (receiverSockets) {
      receiverSockets.forEach((socketId) => {
        io.to(socketId).emit("typing", false);
      });
    }
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (userId) {
      const userSockets = userSocketMap.get(userId);

      if (userSockets) {
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          userSocketMap.delete(userId);
        }
      }
    }

    io.emit("getOnlineUsers", [...userSocketMap.keys()]);
  });
});

export { io, app, server };