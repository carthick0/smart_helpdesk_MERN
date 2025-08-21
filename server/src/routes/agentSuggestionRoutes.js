import express from "express";
import AgentSuggestionController from "../controllers/agentSuggestionController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/agent/suggestion/:ticketId", auth(["agent", "admin"]), AgentSuggestionController.getSuggestionByTicketId);

export default router;
