import AuditService from "../services/auditService.js";

class AuditController {
  async getAuditForTicket(req, res) {
    try {
      const { ticketId } = req.params;
      const logs = await AuditService.getAuditForTicket(ticketId);
      res.json(logs);
    } catch (err) {
      console.error("AuditController error: ", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }
}

export default new AuditController();
