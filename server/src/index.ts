import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import swapRoutes from "./routes/swapRoutes";
import { Server } from "socket.io"; 
import http from "http";                

dotenv.config();
process.env.PORT
console.log(process.env.PORT);
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/slotswapper";

const app = express();
app.use(cors());
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",           
    methods: ["GET", "POST"]
  }
});

export const userSocketMap = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  // Listen for a "register" event from the client that provides the authenticated userId.
  // The frontend will emit this after the user logs in (we'll implement that later).
  socket.on("register", (userId: string) => {
    // store the mapping so we can target notifications to this user later
    userSocketMap.set(userId, socket.id);
    console.log(`✅ Registered user ${userId} with socket ${socket.id}`);
  });

  // Clean up on disconnect: remove any user entries that were using this socket
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    for (const [userId, sid] of userSocketMap.entries()) {
      if (sid === socket.id) {
        userSocketMap.delete(userId);
        console.log(`🧹 Removed registration for user ${userId}`);
        break;
      }
    }
  });
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/events",eventRoutes);
app.use("/api", swapRoutes);

app.get("/", (req, res) => {
  console.log("Request received at /api");
  res.json({ ok: true, message: "SlotSwapper API (dev)" });
});


const start = async () => {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`DB Connected, Server running on http://localhost:${PORT}`);
  });
};

start();
