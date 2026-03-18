import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import * as sessionController from "./controllers/sessionController.js";
import { startCharging, stopCharging } from "./controllers/actionController.js";
import { startSimulator } from "./services/simulator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

// REST API
app.get("/api/sessions", sessionController.getSessions);
app.get("/api/sessions/:id", sessionController.getSessionById);
app.post("/api/sessions", (req, res) => sessionController.createSession(req, res, io));

app.post("/api/sessions/:id/start", (req, res) => startCharging(req, res, io));
app.post("/api/sessions/:id/stop", (req, res) => stopCharging(req, res, io));

// Serve static files from the Vue app build directory
const publicPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(publicPath));

// Socket.io
io.on("connection", (socket) => {
  socket.join("dashboard");
});

// Handle SPA routing - ALWAYS LAST
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startSimulator(io);
});

export { io };
