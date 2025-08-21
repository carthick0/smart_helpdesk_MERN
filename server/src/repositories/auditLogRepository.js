import CrudRepository from "./crudRepository.js";
import AuditLog from "../models/auditLog.js";

class AuditLogRepository extends CrudRepository {
  constructor() {
    super(AuditLog);
  }

  async findByTicket(ticketId) {
    return this.model.find({ ticketId }).sort({ timestamp: 1 });
  }
}

export default new AuditLogRepository();
