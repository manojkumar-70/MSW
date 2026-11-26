import express from "express";
import { protect } from "../controllers/authController.js";
import {
  getAllBooks,
  createBook,
  getIssuedBooks,
  issueBook,
  returnBook,
} from "../controllers/libraryController.js";

const router = express.Router();

router.use(protect);
router.route("/books").get(getAllBooks).post(createBook);
router.route("/issues").get(getIssuedBooks).post(issueBook);
router.patch("/issues/:id/return", returnBook);

export default router;
