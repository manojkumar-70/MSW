import ClassAttendance from "../models/ClassAttendance.js";
import User from "../models/User.js";
import StudentProfile from "../models/Student/Profile.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getStudentsForAttendance = catchAsync(async (req, res) => {
  const { section, department } = req.query;
  const users = await User.find({ roleName: "student" })
    .select("_id name email usn department sem section")
    .sort({ name: 1 })
    .lean();

  const profiles = await StudentProfile.find({
    userId: { $in: users.map((u) => u._id) },
  })
    .select("userId usn department sem section")
    .lean();

  const profileMap = new Map(profiles.map((p) => [String(p.userId), p]));

  let students = users.map((u) => {
    const p = profileMap.get(String(u._id));
    return {
      ...u,
      usn: p?.usn || u.usn || "",
      department: p?.department || u.department || "",
      sem: p?.sem || u.sem || "",
      section: p?.section || u.section || "",
    };
  });

  if (department && department !== "All") {
    students = students.filter((s) => s.department === department);
  }
  if (section && section !== "All") {
    students = students.filter((s) => s.section === section);
  }

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

export const getStudentClassAttendance = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const sessions = await ClassAttendance.find({ "records.student": studentId })
    .sort({ date: -1, createdAt: -1 })
    .lean();

  const entries = sessions.map((s) => {
    const rec = s.records.find((r) => String(r.student) === String(studentId));
    return {
      _id: s._id,
      date: s.date,
      timeSlot: s.timeSlot,
      subject: s.subject,
      section: s.section,
      status: rec?.status || "P",
    };
  });

  res.status(200).json({ status: "success", results: entries.length, data: { entries } });
});
