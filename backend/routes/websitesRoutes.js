const express = require("express");
const router = express.Router();
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");

const {
  addwebsite,
  getWebsites,
} = require("../controllers/websitesControllers");
router.post("/addwebsite", isUserAuthenticated, addwebsite);

// Route for retrieving all websites for the logged-in user
router.get("/websites", isUserAuthenticated, getWebsites);
module.exports = router;
