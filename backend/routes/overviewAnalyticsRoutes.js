const express = require("express");
const router = express.Router();
const {
  createDataFetchHandler,
} = require("../controllers/OverviewAnalyticsController");
// Set up routes for fetching user data
router.get("/users/:interval", createDataFetchHandler("users"));

// Set up routes for fetching session data
router.get("/sessions/:interval", createDataFetchHandler("sessions"));

// Set up routes for fetching event data
router.get("/events/:interval", createDataFetchHandler("events"));

module.exports = router;
