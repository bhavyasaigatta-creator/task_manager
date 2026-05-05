import express from "express";
import User from "../models/User.js";

const router = express.Router();

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.create({ email, password });
  res.json(user);
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ message: "Login success", user });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

export default router;