const express = require("express");
const router = express.Router();
const geoip = require("geoip-lite"); // Assuming you're still using the geoip lookup
const {
  insertEventData,
  insertUserData,
  insertSessionData,
  appIdVerfication,
} = require("../controllers/collectorsController");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
// Middleware to log the IP and perform GeoIP lookup

router.use((req, res, next) => {
  const ipAddress = req.socket.remoteAddress;

  geo = geoip.lookup(ipAddress); // Attach geo info to request object
  console.log("test geo", geo);
  next();
});

// Route for user data
router.post("/user", isAuthenticated, async (req, res) => {
  try {
    await insertUserData(req.body);
    res.json({
      status: "success",
      message: "User data received and processed",
    });
  } catch (error) {
    console.error("Failed to process user data:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error processing user data" });
  }
});

// Route for session data
router.post("/session", isAuthenticated, async (req, res) => {
  try {
    await insertSessionData(req.body);
    res.json({
      status: "success",
      message: "Session data received and processed",
    });
  } catch (error) {
    console.error("Failed to process session data:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error processing session data" });
  }
});

// Route for event data
router.post("/event", async (req, res) => {
  try {
    await insertEventData(req.body);
    res.json({
      status: "success",
      message: "Event data received and processed",
    });
  } catch (error) {
    console.error("Failed to process event data:", error);
    res
      .status(500)
      .json({ status: "error", message: "Error processing event data" });
  }
});

router.post("/appId", appIdVerfication);
module.exports = router;
