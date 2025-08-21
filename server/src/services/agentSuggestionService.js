import AgentSuggestionRepository from "../repositories/agentSuggestionRepository.js";

class AgentSuggestionService {
  async getByTicketId(ticketId) {
    return AgentSuggestionRepository.findByTicketId(ticketId);
  }
}

export default new AgentSuggestionService();
