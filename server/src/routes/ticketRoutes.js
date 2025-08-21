import express from "express";
import TicketController from "../controllers/ticketController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth(), TicketController.createTicket);
router.get("/", auth(), TicketController.getAllTickets);
router.get("/:id", auth(), TicketController.getTicketById);
router.put("/:id", auth(["agent", "admin"]), TicketController.updateTicket);
router.delete("/:id", auth(["admin"]), TicketController.deleteTicket);
router.post("/:id/reply", auth(["agent", "admin"]), TicketController.sendReply);
router.patch("/:id/status", auth(), TicketController.updateStatus);

export default router;
