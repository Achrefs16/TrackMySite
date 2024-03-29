const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateProfile,
  getProfile,
} = require("../controllers/userAuthController");
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.get("/profile", isUserAuthenticated, getProfile);
router.patch("/profile", isUserAuthenticated, updateProfile);

module.exports = router;
