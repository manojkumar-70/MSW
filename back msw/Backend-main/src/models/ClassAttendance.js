import mongoose from "mongoose";

const classAttendanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    section: { type: String, required: true, default: "All" },
    subject: { type: String, default: "General" },
    faculty: { type: mongoose.Schema.ObjectId, ref: "Users" },
    records: [
      {
        student: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
        studentName: { type: String, required: true },
        usn: { type: String, default: "" },
        status: { type: String, enum: ["P", "A"], required: true },
      },
    ],
  },
  { timestamps: true }
);

const ClassAttendance = mongoose.model("ClassAttendance", classAttendanceSchema);
export default ClassAttendance;
