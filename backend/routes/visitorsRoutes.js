const express = require("express");
const router = express.Router();
const visitorsController = require("../controllers/visitorsController");

router.get("/tv/:interval", visitorsController.getTotalVisitors);
router.get("/nv", visitorsController.getNewUsersLastWeek);
router.get("/rv", visitorsController.getReturningUsers);
router.get("/lv", visitorsController.getUserLoyalty);
router.get("/gv", visitorsController.getGeographicDistribution);
router.get("/dv", visitorsController.getDeviceAndBrowserUsage);
router.get("/language", visitorsController.getLanguagePreferences);
module.exports = router;
