import Fee from "../models/Fee.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getFees = catchAsync(async (req, res) => {
  const filter = {};
  if (req.user?.roleName === "student") {
    filter.studentEmail = req.user.email.toLowerCase();
  }
  const fees = await Fee.find(filter).sort({ status: 1, dueDate: 1, createdAt: -1 });
  res.status(200).json({ status: "success", results: fees.length, data: { fees } });
});

export const createFee = catchAsync(async (req, res, next) => {
  const { studentEmail, studentName, title, category, amount, dueDate } = req.body;
  if (!studentEmail || !title || !amount || !dueDate) {
    return next(new AppError("Student email, title, amount, and due date are required", 400));
  }
  const fee = await Fee.create({
    studentEmail,
    studentName,
    title,
    category: category || "Academic",
    amount: Number(amount),
    dueDate,
  });
  res.status(201).json({ status: "success", data: { fee } });
});

export const payFee = catchAsync(async (req, res, next) => {
  const fee = await Fee.findById(req.params.id);
  if (!fee) return next(new AppError("Fee record not found", 404));
  if (fee.status === "Paid") return next(new AppError("Fee is already paid", 400));

  fee.status = "Paid";
  fee.transactionId = `TXN-${Date.now()}`;
  fee.paidAt = new Date();
  await fee.save();

  res.status(200).json({ status: "success", data: { fee } });
});
