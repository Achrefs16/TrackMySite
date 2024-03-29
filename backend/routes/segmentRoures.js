const express = require("express");
const router = express.Router();
const segmentsController = require("../controllers/segmentsController");

router.get("/purchasersbylocation", segmentsController.getPurchasersByLocation);
router.get("/purchasersbycity", segmentsController.getPurchasersByCity);
router.get(
  "/countrysubscriber",
  segmentsController.getCountryBySubscriptionPlan
);
router.get("/citysubscriber", segmentsController.getCityBySubscriptionPlan);
router.get("/citycontent", segmentsController.getCityByContentTypeEngagement);
module.exports = router;
