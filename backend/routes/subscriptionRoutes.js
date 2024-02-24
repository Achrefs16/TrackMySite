const express = require("express");
const router = express.Router();
const subscribeController = require("../controllers/subscribeController");

router.get("/sd", subscribeController.getSubscriptionData);
router.get("/usd", subscribeController.getUnsubscribeData);
module.exports = router;
