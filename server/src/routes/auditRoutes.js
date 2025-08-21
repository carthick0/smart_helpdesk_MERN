import express from "express";
import AuditController from "../controllers/auditController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();


router.get("/:ticketId/audit", auth(["agent", "admin"]), AuditController.getAuditForTicket);

export default router;
