const express = require("express");
const router = express.Router();
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");

const {
  addwebsite,
  getWebsites,
  getWebsite,
  updateWebsite,
  deleteWebsite,
} = require("../controllers/websitesControllers");
router.post("/addwebsite", isUserAuthenticated, addwebsite);

// Route for retrieving all websites for the logged-in user
router.get("/websites", isUserAuthenticated, getWebsites);
router.get("/website/:id", isUserAuthenticated, getWebsite);
router.put("/upwebsite/:id", isUserAuthenticated, updateWebsite);
router.delete("/website/:id", isUserAuthenticated, deleteWebsite);
module.exports = router;
