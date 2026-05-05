import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// ✅ Add Task
router.post("/", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

// ✅ Get All Tasks (with userId)
router.get("/", async (req, res) => {
  const { userId } = req.query;
  const tasks = await Task.find({ userId });
  res.json(tasks);
});

// ✅ Update Task
router.put("/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedTask);
});

// ✅ Delete Task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// ✅ KEEP THIS ALWAYS AT END
export default router;