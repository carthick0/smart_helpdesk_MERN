import AuditLogRepository from "../repositories/auditLogRepository.js";

class AuditService {
  async getAuditForTicket(ticketId) {
    return AuditLogRepository.findByTicket(ticketId);
  }

  async logEvent({ ticketId, traceId, actor, action, meta }) {
    return AuditLogRepository.create({
      ticketId,
      traceId,
      actor,
      action,
      meta,
      timestamp: new Date(),
    });
  }
}

export default new AuditService();
