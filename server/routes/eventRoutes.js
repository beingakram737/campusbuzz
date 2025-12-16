import express from "express";
import {
  getEvents,
  getEvent,
  getAdminEvents,
  registerEvent,
  cancelRegistration,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/", getEvents);

/* ================= ADMIN (⚠️ MUST BE BEFORE :id) ================= */
router.get(
  "/admin",
  protect,
  authorize("admin"),
  getAdminEvents
);

/* ================= ADMIN CRUD ================= */
router.post(
  "/",
  protect,
  authorize("admin"),
  createEvent
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateEvent
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteEvent
);

/* ================= SINGLE EVENT ================= */
router.get("/:id", getEvent);

/* ================= USER ACTIONS ================= */
router.post("/:id/register", protect, registerEvent);
router.delete("/:id/register", protect, cancelRegistration);

export default router;
