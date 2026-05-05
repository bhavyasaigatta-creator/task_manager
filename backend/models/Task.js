import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    default: "pending"
  },
  userId: String   // ✅ ADD THIS LINE
});

const Task = mongoose.model("Task", taskSchema);

export default Task;