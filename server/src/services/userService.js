import jwt from "jsonwebtoken";
import UserRepository from "../repositories/userRepository.js";
import { JWT_SECRET } from "../config/serverConfig.js";

class UserService {
  async register({ name, email, password, role }) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) throw new Error("Email already registered");

    
    const user = await UserRepository.create({
      name,
      email,
      passwordHash: password,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { user, token };
  }

  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Incorrect password");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { user, token };
  }
}

export default new UserService();
