import mongoose from "mongoose";

const bookIssueSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.ObjectId, ref: "Book", required: true },
    studentName: { type: String, required: true, trim: true },
    studentEmail: { type: String, required: true, trim: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ["Issued", "Returned"], default: "Issued" },
  },
  { timestamps: true }
);

const BookIssue = mongoose.model("BookIssue", bookIssueSchema);
export default BookIssue;
