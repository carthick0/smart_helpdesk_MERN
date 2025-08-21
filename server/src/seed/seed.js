import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/dbConfig.js";

import User from "../models/user.js";
import Article from "../models/article.js";
import Ticket from "../models/ticket.js";
import Config from "../models/config.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const seed = async () => {
  try {
    await connectDB();

    // Clear collections
    await User.deleteMany({});
    await Article.deleteMany({});
    await Ticket.deleteMany({});
    await Config.deleteMany({});

    // Create users
   const users = await User.create([
  { name: "Admin User", email: "admin@example.com", passwordHash: "adminpass", role: "admin" },
  { name: "Support Agent", email: "agent@example.com", passwordHash: "agentpass", role: "agent" },
  { name: "Regular User", email: "user@example.com", passwordHash: "userpass", role: "user" }
]);

    // Create KB articles
    const articles = await Article.create([
      {
        title: "How to update payment method",
        body: "You can update your payment method in the billing section...",
        tags: ["billing", "payments"],
        status: "published"
      },
      {
        title: "Troubleshooting 500 errors",
        body: "If you see a 500 error, try clearing your cache and cookies...",
        tags: ["tech", "errors"],
        status: "published"
      },
      {
        title: "Tracking your shipment",
        body: "You can track your shipment using the tracking ID provided...",
        tags: ["shipping", "delivery"],
        status: "published"
      }
    ]);
const regularUserId = users.find(u => u.email === "user@example.com")._id;

// Create tickets with createdBy set
const tickets = await Ticket.create([
  {
    title: "Refund for double charge",
    description: "I was charged twice for order #1234",
    category: "billing",
    status: "open",
    createdBy: regularUserId,
  },
  {
    title: "App shows 500 on login",
    description: "Stack trace mentions auth module",
    category: "tech",
    status: "open",
    createdBy: regularUserId,
  },
  {
    title: "Where is my package?",
    description: "Shipment delayed 5 days",
    category: "shipping",
    status: "open",
    createdBy: regularUserId,
  }
]);

    // Create default config
    await Config.create({
      autoCloseEnabled: true,
      confidenceThreshold: 0.78,
      slaHours: 24
    });

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();
