import express from "express";
import http from "http";
import { Server } from "socket.io";
import v1Routes from "./routes/v1/index.js";
import { handleErrorResponse } from "./utils/handleResponse.js";
import { PORT } from "./config/env.js";
import session from "express-session";
import passport from "./config/passport.js";
import Sentry from "./config/instrument.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true, 
  },
});

Sentry.setupExpressErrorHandler(app);

app.use(express.json());
app.use(cors({
  origin: "*",  
  credentials: true, 
}));

app.get("/", (req, res) => {
  res.json("Hello, world!");
});

app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", v1Routes);

app.use((req, res) => {
  handleErrorResponse(res, "Endpoint not found", 404);
});

app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Jalankan server HTTP
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { io };
