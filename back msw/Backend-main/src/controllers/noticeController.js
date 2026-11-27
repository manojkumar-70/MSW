import Notice from "../models/Notice.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllNotices = catchAsync(async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category && category !== "All") {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const notices = await Notice.find(filter)
    .sort({ isPinned: -1, createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: notices.length,
    data: { notices },
  });
});

export const createNotice = catchAsync(async (req, res, next) => {
  const { title, description, category, targetRole, isPinned, attachmentUrl } = req.body;
  if (!title || !description) {
    return next(new AppError("Title and description are required", 400));
  }

  const notice = await Notice.create({
    title,
    description,
    category,
    targetRole,
    isPinned: Boolean(isPinned),
    attachmentUrl,
    createdBy: req.user?._id,
  });

  res.status(201).json({
    status: "success",
    data: { notice },
  });
});

export const deleteNotice = catchAsync(async (req, res, next) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) {
    return next(new AppError("No notice found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
