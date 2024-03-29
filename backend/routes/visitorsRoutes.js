const express = require("express");
const router = express.Router();
const visitorsController = require("../controllers/visitorsController");
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");

router.get(
  "/totalvisitor/:interval",
  isUserAuthenticated,
  visitorsController.getTotalVisitors
);
router.get(
  "/newusers",
  isUserAuthenticated,
  visitorsController.getNewUsersLastWeek
);
router.get(
  "/returningusers",
  isUserAuthenticated,
  visitorsController.getReturningUsers
);
router.get(
  "/userloyalty",
  isUserAuthenticated,
  visitorsController.getUserLoyalty
);
router.get(
  "/geographicdistribution",
  isUserAuthenticated,
  visitorsController.getGeographicDistribution
);
router.get(
  "/devices",
  isUserAuthenticated,
  visitorsController.getDeviceAndBrowserUsage
);
router.get(
  "/language",
  isUserAuthenticated,
  visitorsController.getLanguagePreferences
);
module.exports = router;
