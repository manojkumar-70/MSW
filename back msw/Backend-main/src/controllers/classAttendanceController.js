import ClassAttendance from "../models/ClassAttendance.js";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getStudentsForAttendance = catchAsync(async (req, res) => {
  const { section } = req.query;
  const filter = { roleName: "student" };
  if (section && section !== "All") {
    filter.section = section;
  }
  const students = await User.find(filter).select("_id name email usn department sem section").sort({ name: 1 });
  res.status(200).json({ status: "success", results: students.length, data: { students } });
});

export const saveClassAttendance = catchAsync(async (req, res, next) => {
  const { date, timeSlot, section, subject, records } = req.body;
  if (!date || !timeSlot || !Array.isArray(records) || records.length === 0) {
    return next(new AppError("Date, time slot, and attendance records are required", 400));
  }

  const attendance = await ClassAttendance.findOneAndUpdate(
    { date, timeSlot, section: section || "All" },
    {
      date,
      timeSlot,
      section: section || "All",
      subject: subject || "General",
      faculty: req.user?._id,
      records,
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(200).json({ status: "success", data: { attendance } });
});

export const getAttendanceHistory = catchAsync(async (req, res) => {
  const history = await ClassAttendance.find().sort({ date: -1, createdAt: -1 }).limit(30);
  res.status(200).json({ status: "success", results: history.length, data: { history } });
});
