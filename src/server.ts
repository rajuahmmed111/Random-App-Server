import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { initializeSocket } from "./shared/socket";
import config from "./config/config";

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: config.frontend_url,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize socket handlers
initializeSocket(io);

const PORT = config.port || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.IO server initialized`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

export { io };
export default server;

