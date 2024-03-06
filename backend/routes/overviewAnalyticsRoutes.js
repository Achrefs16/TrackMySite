const express = require("express");
const router = express.Router();
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");
const {
  createDataFetchHandler,
} = require("../controllers/OverviewAnalyticsController");
// Set up routes for fetching user data
router.get(
  "/users/:interval",
  isUserAuthenticated,
  createDataFetchHandler("users")
);

// Set up routes for fetching session data
router.get(
  "/sessions/:interval",
  isUserAuthenticated,
  createDataFetchHandler("sessions")
);

// Set up routes for fetching event data
router.get(
  "/events/:interval",
  isUserAuthenticated,
  createDataFetchHandler("events")
);

module.exports = router;
