import express from "express";
import ConfigController from "../controllers/configController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();


router.get("/", auth(["admin"]), ConfigController.getConfig);
router.put("/", auth(["admin"]), ConfigController.updateConfig);

export default router;
