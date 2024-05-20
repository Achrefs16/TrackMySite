const {
  fetchDailySalesByCategory,
  fetchDailySalesByProduct,
  fetchSalesByCategory,
  fetchSalesByProduct,
  combineAddToCartCategoryViews,
  combineAddToCartViews,
  combineProductViews,
  combineProductViewsByCategory,
  fetchdateProduct,
} = require("../helpers/commerce");

exports.getCombinedProductViews = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    // Assuming combineProductViews function is defined and available
    const combinedViews = await combineProductViews(appId);
    res.json({ CombinedProductViews: combinedViews });
  } catch (error) {
    console.error("Error in getCombinedProductViews:", error);
    res
      .status(500)
      .json({ error: "Error fetching combined product views data" });
  }
};

exports.getAddToCartAnalysis = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const addToCartData = await combineAddToCartViews(appId);
    res.json({ AddToCartData: addToCartData });
  } catch (error) {
    console.error("Error in getAddToCartAnalysis:", error);
    res.status(500).json({ error: "Error fetching add-to-cart analysis data" });
  }
};

exports.getAddToCartCategoryAnalysis = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const categoryAddToCartData = await combineAddToCartCategoryViews(appId);
    res.json({ AddToCartCategoryData: categoryAddToCartData });
  } catch (error) {
    console.error("Error in getAddToCartCategoryAnalysis:", error);
    res
      .status(500)
      .json({ error: "Error fetching add-to-cart category analysis data" });
  }
};

exports.getProductViewsByCategory = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const productViewsByCategory = await combineProductViewsByCategory(appId);
    res.json({ ProductViewsByCategory: productViewsByCategory });
  } catch (error) {
    console.error("Error in getProductViewsByCategory:", error);
    res
      .status(500)
      .json({ error: "Error fetching product views by category data" });
  }
};

exports.getSalesByProduct = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const salesByProduct = await fetchSalesByProduct(appId);
    res.json({ SalesByProduct: salesByProduct });
  } catch (error) {
    console.error("Error in getSalesByProduct:", error);
    res.status(500).json({ error: "Error fetching sales by product data" });
  }
};

exports.getSalesByCategory = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const salesByCategory = await fetchSalesByCategory(appId);
    res.json({ SalesByCategory: salesByCategory });
  } catch (error) {
    console.error("Error in getSalesByCategory:", error);
    res.status(500).json({ error: "Error fetching sales by category data" });
  }
};

exports.getDailySalesByProduct = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const dailySalesByProduct = await fetchDailySalesByProduct(appId);
    res.json({ DailySalesByProduct: dailySalesByProduct });
  } catch (error) {
    console.error("Error in getDailySalesByProduct:", error);
    res
      .status(500)
      .json({ error: "Error fetching daily sales by product data" });
  }
};
exports.getDailySalesByCategory = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const dailySalesByCategory = await fetchDailySalesByCategory(appId);
    res.json({ DailySalesByCategory: dailySalesByCategory });
  } catch (error) {
    console.error("Error in getDailySalesByCategory:", error);
    res
      .status(500)
      .json({ error: "Error fetching daily sales by category data" });
  }
};

exports.getdateByProduct = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const salesByProduct = await fetchdateProduct(appId);
    res.json({ SalesByProduct: salesByProduct });
  } catch (error) {
    console.error("Error in getSalesByProduct:", error);
    res.status(500).json({ error: "Error fetching sales by product data" });
  }
};
