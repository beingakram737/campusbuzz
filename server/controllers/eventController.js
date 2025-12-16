import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import Event from "../models/Event.js";

/* ================= PUBLIC ================= */

// GET all events (user + admin home)
export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ date: 1 });

  res.status(200).json({
    success: true,
    data: events,
  });
});

// GET single event (with registered users)
export const getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate(
    "registeredUsers",
    "name email"
  );

  if (!event) {
    return next(new ErrorResponse("Event not found", 404));
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

/* ================= USER ================= */

// Register for event
export const registerEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new ErrorResponse("Event not found", 404));

  const userId = req.user.id;

  const alreadyRegistered = event.registeredUsers.some(
    (u) => u.toString() === userId
  );

  if (alreadyRegistered) {
    return next(new ErrorResponse("Already registered", 400));
  }

  event.registeredUsers.push(userId);
  await event.save();

  res.status(200).json({
    success: true,
    message: "Registered successfully",
  });
});

// Cancel registration (15 days rule)
export const cancelRegistration = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new ErrorResponse("Event not found", 404));

  const userId = req.user.id;

  const isRegistered = event.registeredUsers.some(
    (u) => u.toString() === userId
  );

  if (!isRegistered) {
    return next(new ErrorResponse("Not registered", 400));
  }

  const diffDays =
    (new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24);

  if (diffDays <= 15) {
    return next(
      new ErrorResponse(
        "Registration can only be cancelled 15 days before event",
        400
      )
    );
  }

  event.registeredUsers = event.registeredUsers.filter(
    (u) => u.toString() !== userId
  );

  await event.save();

  res.status(200).json({
    success: true,
    message: "Registration cancelled successfully",
  });
});

/* ================= ADMIN ================= */

// GET all events (admin dashboard)
export const getAdminEvents = asyncHandler(async (req, res) => {
  const events = await Event.find()
    .populate("registeredUsers", "name email")
    .sort({ date: 1 });

  res.status(200).json({
    success: true,
    data: events,
  });
});

// CREATE event
export const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    data: event,
  });
});

// UPDATE event ✅ (THIS FIXES YOUR ERROR)
export const updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!event) {
    return next(new ErrorResponse("Event not found", 404));
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

// DELETE event
export const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse("Event not found", 404));
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
});
