import CrudRepository from "./crudRepository.js";
import Ticket from "../models/ticket.js";

class TicketRepository extends CrudRepository{
    constructor(){
        super(Ticket)
    };
    async findByStatus(status) {
    return this.model.find({ status });

  }
  async findByUser(userId) {
    return this.model.find({ createdBy: userId });
  }
  async findByFilters(filters) {
    
    return this.model.find(filters).sort({ createdAt: -1 });
  }

  
}

export default new TicketRepository();