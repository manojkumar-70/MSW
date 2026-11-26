import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Scholarship name is required"],
      trim: true,
    },
    provider: {
      type: String,
      required: [true, "Provider name is required"],
      trim: true,
    },
    eligibility: {
      type: String,
      required: [true, "Eligibility criteria is required"],
      trim: true,
    },
    amount: {
      type: String,
      required: [true, "Scholarship amount is required"],
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },
    applyLink: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Scholarship = mongoose.model("Scholarship", scholarshipSchema);
export default Scholarship;
