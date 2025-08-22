import CrudRepository from "./crudRepository.js";
import Config from "../models/config.js";

class ConfigRepository extends CrudRepository {
  constructor() {
    super(Config);
  }
}

export default new ConfigRepository();
