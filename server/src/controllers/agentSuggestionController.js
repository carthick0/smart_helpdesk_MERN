import AgentSuggestionService from "../services/agentSuggestionService.js";

class AgentSuggestionController {
  async getSuggestionByTicketId(req, res) {
    try {
      const { ticketId } = req.params;
      const suggestion = await AgentSuggestionService.getByTicketId(ticketId);
      if (!suggestion) {
        return res.status(404).json({ message: "Suggestion not found" });
      }
      res.status(200).json(suggestion);
    } catch (error) {
      res.status(500).json({ error: error.message || "Error fetching agent suggestion" });
    }
  }
}

export default new AgentSuggestionController();
