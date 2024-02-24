const express = require("express");
const router = express.Router();
const commerceController = require("../controllers/commerceController");

router.get("/ac", commerceController.getAddToCartAnalysis);
router.get("/ag", commerceController.getAddToCartCategoryAnalysis);
router.get("/cpv", commerceController.getCombinedProductViews);
router.get("/pvc", commerceController.getProductViewsByCategory);
router.get("/sp", commerceController.getSalesByProduct);
router.get("/spd", commerceController.getDailySalesByProduct);
router.get("/sc", commerceController.getSalesByCategory);
router.get("/scd", commerceController.getDailySalesByCategory);
module.exports = router;
