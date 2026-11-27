import express from "express";
import { protect } from "../controllers/authController.js";
import { getFees, createFee, payFee } from "../controllers/feeController.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getFees).post(createFee);
router.patch("/:id/pay", payFee);

export default router;
