
import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: [{ type: String }],
  status: { type: String, enum: ["published"], default: "published" },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Article", articleSchema);
