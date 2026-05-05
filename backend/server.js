import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend + DB working ✅");
});
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);
// ✅ Start server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});