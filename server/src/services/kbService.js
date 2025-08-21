import KBRepository from "../repositories/kbRepository.js";

class KBService {
  // Receives just the query string (not req or res)
  async searchKB(query) {
    // delegate search logic to repository
    return KBRepository.search(query);
  }

  async createArticle(data) {
    return KBRepository.create(data);
  }

  async updateArticle(id, data) {
    return KBRepository.update(id, data);
  }

  async deleteArticle(id) {
    return KBRepository.delete(id);
  }
}

export default new KBService();
