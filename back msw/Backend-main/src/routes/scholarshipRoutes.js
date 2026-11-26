import express from "express";
import { protect } from "../controllers/authController.js";
import {
  getAllScholarships,
  createScholarship,
  updateScholarshipStatus,
  deleteScholarship,
} from "../controllers/scholarshipController.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getAllScholarships).post(createScholarship);
router.route("/:id").patch(updateScholarshipStatus).delete(deleteScholarship);

export default router;
