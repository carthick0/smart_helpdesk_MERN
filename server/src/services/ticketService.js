import TicketRepository from "../repositories/ticketRepository.js";
import AgentSuggestionRepository from "../repositories/agentSuggestionRepository.js";
import AuditLogRepository from "../repositories/auditLogRepository.js";
import KBService from "./kbService.js";
import { v4 as uuidv4 } from "uuid";
import { AUTO_CLOSE_ENABLED, CONFIDENCE_THRESHOLD } from "../config/serverConfig.js";

class TicketService {
async createTicket({ title, description, category, createdBy }) {
  // Create ticket with initial status "open"
  const ticket = await TicketRepository.create({
    title,
    description,
    category,
    createdBy,
    status: "open",
  });

  const traceId = uuidv4();

  await AuditLogRepository.create({
    ticketId: ticket._id,
    traceId,
    actor: "system",
    action: "TICKET_CREATED",
    meta: {},
    timestamp: new Date(),
  });

  // Run triage which updates ticket status internally (e.g., to 'resolved' or 'waiting_human')
  await this.triage(ticket, traceId);

  // Fetch updated ticket with new status after triage finishes
  const updatedTicket = await TicketRepository.findById(ticket._id);

  // Fetch agentSuggestion associated with ticket if needed
  const agentSuggestion = await AgentSuggestionRepository.findByTicketId(ticket._id);

  return { ticket: updatedTicket, agentSuggestion };
}


  async getTicketById(ticketId) {
  
  return TicketRepository.model
    .findById(ticketId)
    .populate("replies.author", "name email")
    .exec();
}

  async getTickets(filters) {
  return TicketRepository.findByFilters(filters);
}

   async getTicketsByUser(userId) {
    return TicketRepository.findByUser(userId);
  }
  async getAllTickets() {
    return TicketRepository.findAll();
  }

  async updateTicket(ticketId, updates) {
    return TicketRepository.update(ticketId, updates);
  }

  async deleteTicket(ticketId) {
    return TicketRepository.delete(ticketId);
  }
  
  async addAgentReply(ticketId, agentId, replyText) {


    const ticket = await TicketRepository.findById(ticketId);
    if (!ticket) return null;

    ticket.replies = ticket.replies || [];
    ticket.replies.push({
      author: agentId,
      message: replyText,
      date: new Date(),
    });

    
    ticket.status = "resolved";  

    await ticket.save();
    return ticket;
  }

  async triage(ticket, traceId) {
    const predictedCategory = this.classifyTicket(ticket.description);
    const confidence = this.computeConfidence(ticket.description);

    await AuditLogRepository.create({
      ticketId: ticket._id,
      traceId,
      actor: "system",
      action: "AGENT_CLASSIFIED",
      meta: { predictedCategory, confidence },
      timestamp: new Date(),
    });

    // Use predictedCategory to search KB articles for better matching
    const kbArticles = await KBService.searchKB(predictedCategory);

    await AuditLogRepository.create({
      ticketId: ticket._id,
      traceId,
      actor: "system",
      action: "KB_RETRIEVED",
      meta: { articleIds: kbArticles.map((a) => a._id) },
      timestamp: new Date(),
    });

    const draftReply = this.draftReply(kbArticles);

    await AuditLogRepository.create({
      ticketId: ticket._id,
      traceId,
      actor: "system",
      action: "DRAFT_GENERATED",
      meta: { draftReply },
      timestamp: new Date(),
    });

    let autoClosed = false;
    console.log(`Confidence: ${confidence}, Threshold: ${CONFIDENCE_THRESHOLD}, AutoCloseEnabled: ${AUTO_CLOSE_ENABLED}`);

    if (AUTO_CLOSE_ENABLED && confidence >= 0.5) {
      console.log(`Auto-closing ticket ${ticket._id} with confidence ${confidence}`);
      await TicketRepository.update(ticket._id, { status: "resolved" });
      autoClosed = true;

      await AuditLogRepository.create({
        ticketId: ticket._id,
        traceId,
        actor: "system",
        action: "AUTO_CLOSED",
        meta: {},
        timestamp: new Date(),
      });
    } else {
      console.log(`Assigning ticket ${ticket._id} to human; confidence ${confidence}`);
      await TicketRepository.update(ticket._id, { status: "waiting_human" });
    }

const agentSuggestion = await AgentSuggestionRepository.create({
  ticketId: ticket._id,
  predictedCategory,
  articleIds: kbArticles.map((a) => a._id),
  draftReply,
  confidence,
  autoClosed,
  modelInfo: {
    provider: "STUB_MODE",
    model: "v1",
    promptVersion: "1.0",
    latencyMs: 0,
  },
  createdAt: new Date(),
});

return agentSuggestion;

  }

  classifyTicket(text) {
    if (/refund|invoice/i.test(text)) return "billing";
    if (/error|bug|stack/i.test(text)) return "tech";
    if (/delivery|shipment/i.test(text)) return "shipping";
    return "other";
  }

  computeConfidence(text) {
    const keywords = ['refund', 'invoice', 'error', 'bug', 'stack', 'delivery', 'shipment'];
    let count = 0;

    keywords.forEach(kw => {
      if (new RegExp(kw, 'i').test(text)) count++;
    });

    if (count >= 2) return 0.9;    
    if (count === 1) return 0.7;   
    return 0.4;                   
  }

  draftReply(articles) {
    if (!articles || articles.length === 0) return "Sorry, no KB found for this ticket.";
    const citations = articles.map((a, i) => `${i + 1}. ${a.title}`).join("\n");
    return `Hello,\n\nPlease see the following KB articles that may help:\n${citations}`;
  }

}

export default new TicketService();