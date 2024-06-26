const express = require("express");
const router = express.Router();
const acquisitionController = require("../controllers/acquisitionController");

router.get("/acquisition", acquisitionController.getAcquisitionSources);

module.exports = router;
