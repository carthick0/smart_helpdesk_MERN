import TicketService from "../services/ticketService.js";

class TicketController {
  // Create a new ticket
  async createTicket(req, res) {
    try {
      const { title, description, category } = req.body;
    const createdBy = req.user.id;
      const result = await TicketService.createTicket({ title, description, category, createdBy });
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message || "Error creating ticket" });
    }
  }

  // Get all tickets
// Get tickets, optional filtering by status, assignee, etc.
async getAllTickets(req, res) {
  try {
    // Extract possible filters from query parameters
    const { status, assignee, createdBy } = req.query;

    // Pass filters object to service
    const filters = {};
    if (status) filters.status = status;
    if (assignee) filters.assignee = assignee;
    if (createdBy) filters.createdBy = createdBy;

    const tickets = await TicketService.getTickets(filters);
    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error fetching tickets" });
  }
}

  // Get ticket by ID
  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const ticket = await TicketService.getTicketById(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      return res.status(200).json(ticket);
    } catch (error) {
      return res.status(500).json({ error: error.message || "Error fetching ticket" });
    }
  }

  // Update a ticket
  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedTicket = await TicketService.updateTicket(id, updates);
      if (!updatedTicket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      return res.status(200).json(updatedTicket);
    } catch (error) {
      return res.status(500).json({ error: error.message || "Error updating ticket" });
    }
  }

  // Delete a ticket
  async deleteTicket(req, res) {
    try {
      const { id } = req.params;
      const result = await TicketService.deleteTicket(id);
      if (!result) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      return res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message || "Error deleting ticket" });
    }
  }
  async sendReply(req, res) {
    try {
      const { id } = req.params;
      const { reply } = req.body;
      const userId = req.user.id;

      if (!reply || reply.trim() === "") {
        return res.status(400).json({ message: "Reply cannot be empty" });
      }


      const updatedTicket = await TicketService.addAgentReply(id, userId, reply);

      if (!updatedTicket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.status(200).json({ message: "Reply sent successfully" });
    } catch (error) {
      console.error("sendReply error:", error);
      res.status(500).json({ error: error.message || "Error sending reply" });
    }
  }
  async updateStatus(req,res){
    try {
      const {id}=req.params;
      const{status}=req.body;
      const updatedTicket = await TicketService.updateTicket(id, { status });

      if (!updatedTicket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.status(200).json({ message: "Status updated successfully", ticket: updatedTicket });
    } catch (error) {
       res.status(500).json({ error: error.message || "Error updating status" });
    }
  }
}

export default new TicketController();
