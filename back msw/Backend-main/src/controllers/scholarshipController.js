import Scholarship from "../models/Scholarship.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllScholarships = catchAsync(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};

  if (status && status !== "All") {
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { provider: { $regex: search, $options: "i" } },
      { eligibility: { $regex: search, $options: "i" } },
    ];
  }

  const scholarships = await Scholarship.find(filter).sort({ deadline: 1, createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: scholarships.length,
    data: { scholarships },
  });
});

export const createScholarship = catchAsync(async (req, res, next) => {
  const { name, provider, eligibility, amount, deadline, applyLink, status } = req.body;
  if (!name || !provider || !eligibility || !amount || !deadline) {
    return next(new AppError("All required scholarship fields must be provided", 400));
  }

  const scholarship = await Scholarship.create({
    name,
    provider,
    eligibility,
    amount,
    deadline,
    applyLink,
    status: status || "Open",
    createdBy: req.user?._id,
  });

  res.status(201).json({
    status: "success",
    data: { scholarship },
  });
});

export const updateScholarshipStatus = catchAsync(async (req, res, next) => {
  const scholarship = await Scholarship.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!scholarship) {
    return next(new AppError("No scholarship found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { scholarship },
  });
});

export const deleteScholarship = catchAsync(async (req, res, next) => {
  const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
  if (!scholarship) {
    return next(new AppError("No scholarship found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
