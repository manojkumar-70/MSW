import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Book title is required"], trim: true },
    author: { type: String, required: [true, "Author is required"], trim: true },
    isbn: { type: String, trim: true, default: "" },
    category: { type: String, default: "Social Work", trim: true },
    totalCopies: { type: Number, required: true, min: 1, default: 1 },
    availableCopies: { type: Number, required: true, min: 0, default: 1 },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
