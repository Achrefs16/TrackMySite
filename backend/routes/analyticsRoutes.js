const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.get("/engaged-users", analyticsController.getEngagedUsers);
router.get("/user-journy", analyticsController.getUserJourny);
router.get("/last-page", analyticsController.getLastPage);
router.get("/entry-page", analyticsController.getEntryPage);
router.get("/device", analyticsController.DeviceBrowser);
router.get("/totalevents", analyticsController.TotalEvents);
router.get("/pages", analyticsController.ViewsPerPage);
router.get("/avsession", analyticsController.avessionDuration);
router.get("/engage", analyticsController.UserEngagement);
module.exports = router;
