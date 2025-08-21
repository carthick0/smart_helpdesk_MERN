import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["billing", "tech", "shipping", "other"], default: "other" },
  status: { type: String, enum: ["open", "triaged", "waiting_human", "resolved", "closed0", "waiting_user"], default: "open" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  agentSuggestionId: { type: mongoose.Schema.Types.ObjectId, ref: "AgentSuggestion" },
  replies: [replySchema],  // Add this
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", ticketSchema);
