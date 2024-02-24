const express = require("express");
const router = express.Router();
const behaivorController = require("../controllers/behaivorController");

router.get("/pv", behaivorController.getPageViews);
router.get("/pe", behaivorController.getPageEngagement);
router.get("/ep", behaivorController.getEntryPage);
router.get("/lp", behaivorController.getLastPage);
router.get("/uj", behaivorController.getUserJourneys);
router.get("/asd", behaivorController.getAvgSessionDuration);
router.get("/aep", behaivorController.getAvgEventsPage);
router.get("/br", behaivorController.getBounceRate);
module.exports = router;
