import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/dbConfig.js";
import { PORT } from "./config/serverConfig.js";

import userRoutes from "./routes/userRoutes.js";
import kbRoutes from "./routes/kbRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import agentSuggestionRoutes from "./routes/agentSuggestionRoutes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",   // replace with your frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true, // if you use cookies or auth headers
}));
app.use(helmet());

app.use(morgan("tiny"));

// Routes
app.use("/api",agentSuggestionRoutes)
app.use("/api/auth", userRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api", auditRoutes); 

// Health checks
app.get("/healthz", (req, res) => res.status(200).send("OK"));
app.get("/readyz", (req, res) => res.status(200).send("OK"));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

