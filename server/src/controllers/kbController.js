import KBService from "../services/kbService.js";

class KBController {
  // Controller extracts req.query.query and passes to service
  async searchKB(req, res) {
    try {
      const query = req.query.query || "";
      const results = await KBService.searchKB(query);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createArticle(req, res) {
    try {
      const article = await KBService.createArticle(req.body);
      res.status(201).json(article);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateArticle(req, res) {
    try {
      const { id } = req.params;
      const updated = await KBService.updateArticle(id, req.body);
      if (!updated) return res.status(404).json({ error: "Article not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteArticle(req, res) {
    try {
      const { id } = req.params;
      const deleted = await KBService.deleteArticle(id);
      if (!deleted) return res.status(404).json({ error: "Article not found" });
      res.json({ message: "Article deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new KBController();
