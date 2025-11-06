import express from "express";
import { createSwapRequest, getSwappableSlots, getSwapRequests, respondToSwap } from "../controllers/swapController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/swappable", protect, getSwappableSlots);
router.post("/swap-request", protect, createSwapRequest);
router.post("/swap-response/:id", protect, respondToSwap);
router.get("/swap-requests", protect, getSwapRequests);

export default router;
