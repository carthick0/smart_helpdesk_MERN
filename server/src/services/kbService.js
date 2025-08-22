import KBRepository from "../repositories/kbRepository.js";

class KBService {
  
  async searchKB(query) {
    return KBRepository.search(query);
  }

  async createArticle(data) {
    return KBRepository.create(data);
  }

  async updateArticle(id, data) {
    return KBRepository.update(id, data);
  }

  async getOneArticle(id){
    return KBRepository.findById(id);
  }
  async deleteArticle(id) {
    return KBRepository.delete(id);
  }
}

export default new KBService();
