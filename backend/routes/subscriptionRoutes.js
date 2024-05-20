const express = require("express");
const router = express.Router();
const subscribeController = require("../controllers/subscribeController");

router.get("/subscribe", subscribeController.getSubscriptionData);
router.get("/unsubscribe", subscribeController.getUnsubscribeData);
module.exports = router;
