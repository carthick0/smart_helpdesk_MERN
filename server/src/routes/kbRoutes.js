import express from "express";
import KBController from "../controllers/kbController.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.get("/", auth('admin'), KBController.searchKB);
router.post("/", auth(["admin"]), KBController.createArticle);
router.put("/:id", auth(["admin"]), KBController.updateArticle);
router.delete("/:id", auth(["admin"]), KBController.deleteArticle);

export default router;
