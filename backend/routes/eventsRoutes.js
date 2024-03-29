const express = require("express");
const router = express.Router();
const { analyzeEventByType } = require("../controllers/eventsController");
router.get("/event/:eventType", async (req, res) => {
  const { appId } = req.query;
  const { eventType } = req.params;

  if (!appId) {
    return res.status(400).send("appId is required");
  }

  try {
    const results = await analyzeEventByType(appId, eventType);
    res.json(results);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
