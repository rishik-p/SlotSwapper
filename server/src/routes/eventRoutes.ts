import express from "express";
import {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";
import { protect} from "../middleware/authMiddleware";

const router=express.Router();
router.use(protect);

router.post("/",createEvent);
router.get("/my",getMyEvents);
router.put("/:id",updateEvent);
router.delete("/:id",deleteEvent);

export default router;
