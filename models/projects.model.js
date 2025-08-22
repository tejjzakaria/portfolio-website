import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: String,
    status: String,
    budget: Number,
    description: String,
    deadline: String,
    progress: String,
    team: [String],
    priority: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
