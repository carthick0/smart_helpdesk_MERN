import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "agent", "user"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

//hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next(); 
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// compare password
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

export default mongoose.model("User", userSchema);
