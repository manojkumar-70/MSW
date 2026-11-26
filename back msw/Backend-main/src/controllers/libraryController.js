import Book from "../models/Book.js";
import BookIssue from "../models/BookIssue.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllBooks = catchAsync(async (req, res) => {
  const { search, category } = req.query;
  const filter = {};
  if (category && category !== "All") filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
      { isbn: { $regex: search, $options: "i" } },
    ];
  }
  const books = await Book.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: books.length, data: { books } });
});

export const createBook = catchAsync(async (req, res, next) => {
  const { title, author, isbn, category, totalCopies } = req.body;
  if (!title || !author) return next(new AppError("Title and author are required", 400));
  const copies = Number(totalCopies) || 1;
  const book = await Book.create({
    title,
    author,
    isbn,
    category: category || "Social Work",
    totalCopies: copies,
    availableCopies: copies,
  });
  res.status(201).json({ status: "success", data: { book } });
});

export const getIssuedBooks = catchAsync(async (req, res) => {
  const issues = await BookIssue.find().populate("book", "title author").sort({ createdAt: -1 });
  res.status(200).json({ status: "success", results: issues.length, data: { issues } });
});

export const issueBook = catchAsync(async (req, res, next) => {
  const { bookId, studentName, studentEmail, dueDate } = req.body;
  if (!bookId || !studentName || !studentEmail || !dueDate) {
    return next(new AppError("Book, student details, and due date are required", 400));
  }
  const book = await Book.findById(bookId);
  if (!book) return next(new AppError("Book not found", 404));
  if (book.availableCopies < 1) return next(new AppError("No copies available", 400));

  book.availableCopies -= 1;
  await book.save();

  const issue = await BookIssue.create({ book: bookId, studentName, studentEmail, dueDate });
  res.status(201).json({ status: "success", data: { issue } });
});

export const returnBook = catchAsync(async (req, res, next) => {
  const issue = await BookIssue.findById(req.params.id);
  if (!issue) return next(new AppError("Issue record not found", 404));
  if (issue.status === "Returned") return next(new AppError("Book already returned", 400));

  issue.status = "Returned";
  issue.returnDate = new Date();
  await issue.save();

  await Book.findByIdAndUpdate(issue.book, { $inc: { availableCopies: 1 } });
  res.status(200).json({ status: "success", data: { issue } });
});
