import express from "express";
import { protect } from "../controllers/authController.js";
import {
  getStudentsForAttendance,
  saveClassAttendance,
  getAttendanceHistory,
  getStudentClassAttendance,
} from "../controllers/classAttendanceController.js";

const router = express.Router();

router.use(protect);
router.get("/students", getStudentsForAttendance);
router.get("/student/:studentId", getStudentClassAttendance);
router.route("/").get(getAttendanceHistory).post(saveClassAttendance);

export default router;
