import mongoose from 'mongoose';
import TicketService from '../src/services/ticketService.js';
import TicketRepository from '../src/repositories/ticketRepository.js';

describe("TicketService Core Tests", () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/helpdesk_test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("1. Create ticket and verify initial triage and agent suggestion", async () => {
    const ticketData = {
      title: "Test Ticket",
      description: "There is an error in system",
      category: "tech",
      createdBy: new mongoose.Types.ObjectId(),
    };
    const { ticket, agentSuggestion } = await TicketService.createTicket(ticketData);

    expect(ticket.title).toBe(ticketData.title);
    expect(["waiting_human", "resolved"]).toContain(ticket.status);
    expect(agentSuggestion).toHaveProperty("draftReply");
  });

  test("2. Compute confidence returns expected values", () => {
    expect(TicketService.computeConfidence("error bug")).toBe(0.9);
    expect(TicketService.computeConfidence("refund")).toBe(0.7);
    expect(TicketService.computeConfidence("no keywords")).toBe(0.4);
  });

  test("3. Triage auto closes ticket if confidence is high", async () => {
    const ticket = await TicketRepository.create({
      title: "High confidence",
      description: "error bug",
      category: "tech",
      createdBy: new mongoose.Types.ObjectId(),
      status: "open",
    });

    await TicketService.triage(ticket, "traceid1");
    const updatedTicket = await TicketRepository.findById(ticket._id);

    expect(updatedTicket.status).toBe("resolved");
  });

  test("4. Adding agent reply updates ticket status to resolved", async () => {
    const ticket = await TicketRepository.create({
      title: "Reply test",
      description: "Some description",
      category: "other",
      createdBy: new mongoose.Types.ObjectId(),
      status: "waiting_human",
    });

    const updated = await TicketService.addAgentReply(
      ticket._id,
      new mongoose.Types.ObjectId(),
      "This is an agent reply"
    );

    expect(updated.status).toBe("resolved");
    expect(updated.replies.length).toBe(1);
    expect(updated.replies[0].message).toBe("This is an agent reply");
  });

  test("5. getTickets filters tickets by given status", async () => {
    await TicketRepository.create({
      title: "Filter test",
      description: "Desc",
      category: "other",
      createdBy: new mongoose.Types.ObjectId(),
      status: "open",
    });

    const tickets = await TicketService.getTickets({ status: "open" });
    expect(tickets.every(t => t.status === "open")).toBe(true);
  });
});
