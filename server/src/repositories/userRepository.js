import CrudRepository from "./crudRepository.js";
import User from "../models/user.js";

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.model.findOne({ email });
  }
}

export default new UserRepository();
