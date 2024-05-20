const express = require("express");
const router = express.Router();
const commerceController = require("../controllers/commerceController");
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated");
router.get(
  "/addcart",
  isUserAuthenticated,
  commerceController.getAddToCartAnalysis
);
router.get(
  "/addcate",
  isUserAuthenticated,
  commerceController.getAddToCartCategoryAnalysis
);
router.get(
  "/productview",
  isUserAuthenticated,
  commerceController.getCombinedProductViews
);
router.get(
  "/viewcate",
  isUserAuthenticated,
  commerceController.getProductViewsByCategory
);
router.get(
  "/salesproduct",
  isUserAuthenticated,
  commerceController.getSalesByProduct
);
router.get(
  "/salesproductd",
  isUserAuthenticated,
  commerceController.getDailySalesByProduct
);
router.get(
  "/salescate",
  isUserAuthenticated,
  commerceController.getSalesByCategory
);
router.get(
  "/salescated",
  isUserAuthenticated,
  commerceController.getDailySalesByCategory
);

router.get("/pdate", isUserAuthenticated, commerceController.getdateByProduct);
module.exports = router;
