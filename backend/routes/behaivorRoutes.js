const express = require("express");
const router = express.Router();
const behaivorController = require("../controllers/behaivorController");

router.get("/pagesviews", behaivorController.getPageViews);
router.get("/pageengagement", behaivorController.getPageEngagement);
router.get("/entrypage", behaivorController.getEntryPage);
router.get("/lastpage", behaivorController.getLastPage);
router.get("/userjourneys", behaivorController.getUserJourneys);
router.get("/avgssession", behaivorController.getAvgSessionDuration);
router.get("/avgeevent", behaivorController.getAvgEventsPage);
router.get("/bouncerate", behaivorController.getBounceRate);
module.exports = router;
