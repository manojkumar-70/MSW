import express from "express";
import { protect } from "../controllers/authController.js";
import {
  getAllNotices,
  createNotice,
  deleteNotice,
} from "../controllers/noticeController.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getAllNotices).post(createNotice);
router.route("/:id").delete(deleteNotice);

export default router;
