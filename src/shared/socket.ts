import type { Server, Socket } from "socket.io";
import { verifyToken } from "../app/modules/auth/auth.service";

let io: Server;

export const initializeSocket = (socketServer: Server) => {
  io = socketServer;

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (token) {
        const decoded = verifyToken(token);
        (socket as any).userId = decoded.userId;
        console.log(`Socket authenticated for user: ${decoded.userId}`);
      }
      next();
    } catch (error) {
      // Allow connection without authentication for public features
      console.log(`Socket connected without authentication: ${socket.id}`);
      next();
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join roadmap item rooms for real-time updates
    socket.on("join_item", (itemId: number) => {
      socket.join(`item_${itemId}`);
      console.log(`Socket ${socket.id} joined item_${itemId}`);
    });

    // Leave roadmap item rooms
    socket.on("leave_item", (itemId: number) => {
      socket.leave(`item_${itemId}`);
      console.log(`Socket ${socket.id} left item_${itemId}`);
    });

    // Handle typing indicators for comments
    socket.on("typing_start", (data: { itemId: number; username: string }) => {
      socket.to(`item_${data.itemId}`).emit("user_typing", {
        itemId: data.itemId,
        username: data.username,
        isTyping: true,
      });
    });

    socket.on("typing_stop", (data: { itemId: number; username: string }) => {
      socket.to(`item_${data.itemId}`).emit("user_typing", {
        itemId: data.itemId,
        username: data.username,
        isTyping: false,
      });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log("Socket.IO initialized successfully");
};

export const emitCommentUpdate = (event: string, data: any) => {
  if (io) {
    io.to(`item_${data.itemId}`).emit(event, data);
    console.log(`Emitted ${event} to item_${data.itemId}`);
  }
};

export const emitVoteUpdate = (event: string, data: any) => {
  if (io) {
    io.to(`item_${data.itemId}`).emit(event, data);
    console.log(`Emitted ${event} to item_${data.itemId}`);
  }
};

// Notification events
export const emitNotification = (userId: string, notification: any) => {
  if (io) {
    const room = `user_${userId}`;
    console.log("🔔 Emitting notification to room:", room);
    console.log("📧 Notification data:", {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
    });

    io.to(room).emit("new_notification", notification);
    console.log(`Emitted notification to user_${userId}`);
    console.log("✅ Notification emitted successfully to user:", userId);
  } else {
    console.error("❌ Socket.IO not initialized for notification");
  }
};

export const emitNotificationUpdate = (userId: string, data: any) => {
  if (io) {
    io.to(`user_${userId}`).emit("notification_update", data);
    console.log(`Emitted notification update to user_${userId}`);
  } else {
    console.error("❌ Socket.IO not initialized for notification update");
  }
};

export const getIO = () => io;
