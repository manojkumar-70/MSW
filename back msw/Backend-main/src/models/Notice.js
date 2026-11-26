import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Notice description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["General", "Exam", "Event", "Academic", "Urgent"],
      default: "General",
    },
    targetRole: {
      type: String,
      enum: ["all", "student", "faculty", "admin"],
      default: "all",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    attachmentUrl: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
