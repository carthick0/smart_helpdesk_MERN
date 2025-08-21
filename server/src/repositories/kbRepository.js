import CrudRepository from "./crudRepository.js";
import Article from "../models/article.js";

class KBRepository extends CrudRepository {
  constructor() {
    super(Article);
  }

  async search(query) {
    if (!query) {
      // Return all published articles if no query specified
      return this.model.find({ status: "published" });
    }

    const keywords = query.split(/\s+/).map(k => k.trim()).filter(Boolean);

    const regexes = keywords.map(k => new RegExp(k, "i"));

    return this.model.find({
      status: "published",
      $or: [
        ...regexes.map(r => ({ title: r })),
        ...regexes.map(r => ({ body: r })),
        { tags: { $in: keywords } }
      ]
    });
  }
}

export default new KBRepository();
