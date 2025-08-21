import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/serverConfig.js";

export function auth(requiredRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.id, role: payload.role };

      if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient permissions" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
