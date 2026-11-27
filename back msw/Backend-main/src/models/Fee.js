import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    studentEmail: { type: String, required: true, trim: true, lowercase: true },
    studentName: { type: String, default: "", trim: true },
    title: { type: String, required: [true, "Fee title is required"], trim: true },
    category: {
      type: String,
      enum: ["Academic", "Exam", "Library Fine"],
      default: "Academic",
    },
    amount: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    transactionId: { type: String, default: "" },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;
