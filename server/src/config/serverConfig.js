import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const PORT = process.env.PORT || 8000;
export const JWT_SECRET=process.env.JWT_SECRET;
export const AUTO_CLOSE_ENABLED=process.env.AUTO_CLOSE_ENABLED;
export const CONFIDENCE_THRESHOLD=process.env.CONFIDENCE_THRESHOLD;