import CrudRepository from "./crudRepository.js";
import AgentSuggestion from "../models/agentSuggestion.js";

class AgentSuggestionRepository extends CrudRepository {
  constructor() {
    super(AgentSuggestion);
  }

  async findByTicketId(ticketId) {
    return this.model.findOne({ ticketId });
  }
}

export default new AgentSuggestionRepository();
