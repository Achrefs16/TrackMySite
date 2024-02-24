const pool = require("../db/database");

async function combineProductViews(appId) {
  // SQL for Total Product Views
  const totalViewsSql = `
    SELECT JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productName')) AS productName, COUNT(*) AS TotalViews
    FROM events
    WHERE appId = ? AND event = 'Product-View'
    GROUP BY productName
    ORDER BY TotalViews DESC;
  `;

  // SQL for Daily Product Views in the Last Month
  const dailyViewsSql = `
    SELECT  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productName')) AS productName,
           DATE(FROM_UNIXTIME(timestamp / 1000)) AS ViewDate, 
           COUNT(*) AS DailyViews
    FROM events
    WHERE appId = ? AND event = 'Product-View'
          AND timestamp >= UNIX_TIMESTAMP(CURDATE() - INTERVAL 1 MONTH) * 1000
    GROUP BY productName, ViewDate
    ORDER BY productName, ViewDate DESC;
  `;

  try {
    // Fetch Total Views
    const [totalViewsResult] = await pool.query(totalViewsSql, [appId]);

    // Fetch Daily Views
    const [dailyViewsResult] = await pool.query(dailyViewsSql, [appId]);

    // Format the combined result
    const combinedResult = totalViewsResult.reduce(
      (acc, { productName, TotalViews }) => {
        // Initialize product in accumulator with total views and an empty array for daily views
        acc[productName] = {
          TotalViews: parseInt(TotalViews, 10),
          DailyViews: [],
        };
        return acc;
      },
      {}
    );

    // Fill in daily views for each product
    dailyViewsResult.forEach(({ productName, ViewDate, DailyViews }) => {
      if (combinedResult[productName]) {
        combinedResult[productName].DailyViews.push({
          ViewDate,
          DailyViews: parseInt(DailyViews, 10),
        });
      }
    });

    return combinedResult;
  } catch (error) {
    console.error("Error combining product views:", error);
    throw error; // Rethrow or handle as needed
  }
}

async function combineAddToCartViews(appId) {
  // SQL for Total "Add-to-Cart" Actions
  const totalAddsSql = `
    SELECT JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productName')) AS productName, COUNT(*) AS TotalAdds
    FROM events
    WHERE appId = ? AND event = 'Add-to-Cart'
    GROUP BY productName
    ORDER BY TotalAdds DESC;
  `;

  // SQL for Daily "Add-to-Cart" Actions in the Last Month
  const dailyAddsSql = `
    SELECT  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productName')) AS productName,
           DATE(FROM_UNIXTIME(timestamp / 1000)) AS AddDate, 
           COUNT(*) AS DailyAdds
    FROM events
    WHERE appId = ? AND event = 'Add-to-Cart'
          AND timestamp >= UNIX_TIMESTAMP(CURDATE() - INTERVAL 1 MONTH) * 1000
    GROUP BY productName, AddDate
    ORDER BY productName, AddDate DESC;
  `;

  try {
    // Fetch Total Adds
    const [totalAddsResult] = await pool.query(totalAddsSql, [appId]);

    // Fetch Daily Adds
    const [dailyAddsResult] = await pool.query(dailyAddsSql, [appId]);

    // Format the combined result
    const combinedResult = totalAddsResult.reduce(
      (acc, { productName, TotalAdds }) => {
        // Initialize product in accumulator with total adds and an empty array for daily adds
        acc[productName] = {
          TotalAdds: parseInt(TotalAdds, 10),
          DailyAdds: [],
        };
        return acc;
      },
      {}
    );

    // Fill in daily adds for each product
    dailyAddsResult.forEach(({ productName, AddDate, DailyAdds }) => {
      if (combinedResult[productName]) {
        // Ensure the product exists in the combinedResult object
        combinedResult[productName].DailyAdds.push({
          AddDate,
          DailyAdds: parseInt(DailyAdds, 10),
        });
      }
    });

    return combinedResult;
  } catch (error) {
    console.error("Error combining add-to-cart data:", error);
    throw error; // Rethrow or handle as needed
  }
}

async function combineAddToCartCategoryViews(appId) {
  // SQL for Total "Add-to-Cart" Actions by Category
  const totalCategoryAddsSql = `
    SELECT  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productCategory')) AS productCategory, COUNT(*) AS TotalAdds
    FROM events
    WHERE appId = ? AND event = 'Add-to-Cart'
    GROUP BY productCategory
    ORDER BY TotalAdds DESC;
  `;

  // SQL for Daily "Add-to-Cart" Actions in the Last Month by Category
  const dailyCategoryAddsSql = `
    SELECT  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productCategory')) AS productCategory,
           DATE(FROM_UNIXTIME(timestamp / 1000)) AS AddDate, 
           COUNT(*) AS DailyAdds
    FROM events
    WHERE appId = ? AND event = 'Add-to-Cart'
          AND timestamp >= UNIX_TIMESTAMP(CURDATE() - INTERVAL 1 MONTH) * 1000
    GROUP BY productCategory, AddDate
    ORDER BY productCategory, AddDate DESC;
  `;

  try {
    // Fetch Total Adds by Category
    const [totalCategoryAddsResult] = await pool.query(totalCategoryAddsSql, [
      appId,
    ]);

    // Fetch Daily Adds by Category for the Last Month
    const [dailyCategoryAddsResult] = await pool.query(dailyCategoryAddsSql, [
      appId,
    ]);

    // Format the combined result for categories
    const combinedCategoryResult = totalCategoryAddsResult.reduce(
      (acc, { productCategory, TotalAdds }) => {
        // Initialize category in accumulator with total adds and an empty array for daily adds
        acc[productCategory] = {
          TotalAdds: parseInt(TotalAdds, 10),
          DailyAdds: [],
        };
        return acc;
      },
      {}
    );

    // Fill in daily adds for each category
    dailyCategoryAddsResult.forEach(
      ({ productCategory, AddDate, DailyAdds }) => {
        if (combinedCategoryResult[productCategory]) {
          // Ensure the category exists in the combinedCategoryResult object
          combinedCategoryResult[productCategory].DailyAdds.push({
            AddDate,
            DailyAdds: parseInt(DailyAdds, 10),
          });
        }
      }
    );

    return combinedCategoryResult;
  } catch (error) {
    console.error("Error combining add-to-cart category data:", error);
    throw error; // Rethrow or handle as needed
  }
}

async function combineProductViewsByCategory(appId) {
  // SQL for Total Product Views by Category
  const totalViewsByCategorySql = `
    SELECT  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productCategory')) AS productCategory, COUNT(*) AS TotalViews
    FROM events
    WHERE appId = ? AND event = 'Product-View'
    GROUP BY productCategory
    ORDER BY TotalViews DESC;
  `;

  // SQL for Daily Product Views in the Last Month by Category
  const dailyViewsByCategorySql = `
    SELECT  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productCategory')) AS productCategory,
           DATE(FROM_UNIXTIME(timestamp / 1000)) AS ViewDate, 
           COUNT(*) AS DailyViews
    FROM events
    WHERE appId = ? AND event = 'Product-View'
          AND timestamp >= UNIX_TIMESTAMP(CURDATE() - INTERVAL 1 MONTH) * 1000
    GROUP BY productCategory, ViewDate
    ORDER BY productCategory, ViewDate DESC;
  `;

  try {
    // Fetch Total Views by Category
    const [totalViewsByCategoryResult] = await pool.query(
      totalViewsByCategorySql,
      [appId]
    );

    // Fetch Daily Views by Category for the Last Month
    const [dailyViewsByCategoryResult] = await pool.query(
      dailyViewsByCategorySql,
      [appId]
    );

    // Combine results
    const combinedResult = totalViewsByCategoryResult.reduce(
      (acc, { productCategory, TotalViews }) => {
        // Initialize category in accumulator with total views and an empty array for daily views
        acc[productCategory] = {
          TotalViews: parseInt(TotalViews, 10),
          DailyViews: [],
        };
        return acc;
      },
      {}
    );

    // Fill in daily views for each category
    dailyViewsByCategoryResult.forEach(
      ({ productCategory, ViewDate, DailyViews }) => {
        if (combinedResult[productCategory]) {
          combinedResult[productCategory].DailyViews.push({
            ViewDate,
            DailyViews: parseInt(DailyViews, 10),
          });
        }
      }
    );

    return combinedResult;
  } catch (error) {
    console.error("Error combining product view data by category:", error);
    throw error;
  }
}

async function fetchSalesByProduct(appId) {
  try {
    const sql = `
      SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productName')) AS ProductName,
        COUNT(*) AS UnitsSold,
        SUM(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productPrice'))) AS TotalRevenue
      FROM events
      WHERE appId = ? AND event = 'Purchase'
      GROUP BY ProductName
      ORDER BY TotalRevenue DESC;
    `;
    const [results] = await pool.query(sql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching sales by product:", error);
    throw error; // Rethrowing the error is optional and depends on how you want to handle it upstream.
  }
}
async function fetchSalesByCategory(appId) {
  try {
    const sql = `
      SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productCategory')) AS ProductCategory,
        COUNT(*) AS UnitsSold,
        SUM(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productPrice'))) AS TotalRevenue
      FROM events
      WHERE appId = ? AND event = 'Purchase'
      GROUP BY ProductCategory
      ORDER BY TotalRevenue DESC;
    `;
    const [results] = await pool.query(sql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching sales by category:", error);
    throw error;
  }
}
async function fetchDailySalesByProduct(appId) {
  try {
    const sql = `
      SELECT 
        DATE(FROM_UNIXTIME(timestamp / 1000)) AS SaleDate,
        JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productName')) AS ProductName,
        COUNT(*) AS UnitsSold,
        SUM(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productPrice'))) AS DailyRevenue
      FROM events
      WHERE appId = ? AND event = 'Purchase'
      GROUP BY SaleDate, ProductName
      ORDER BY SaleDate DESC, DailyRevenue DESC;
    `;
    const [results] = await pool.query(sql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching daily sales by product:", error);
    throw error;
  }
}
async function fetchDailySalesByCategory(appId) {
  try {
    const sql = `
      SELECT 
        DATE(FROM_UNIXTIME(timestamp / 1000)) AS SaleDate,
        JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productCategory')) AS ProductCategory,
        COUNT(*) AS UnitsSold,
        SUM(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productPrice'))) AS DailyRevenue
      FROM events
      WHERE appId = ? AND event = 'Purchase'
      GROUP BY SaleDate, ProductCategory
      ORDER BY SaleDate DESC, DailyRevenue DESC;
    `;
    const [results] = await pool.query(sql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching daily sales by category:", error);
    throw error;
  }
}
module.exports = {
  fetchDailySalesByCategory,
  fetchDailySalesByProduct,
  fetchSalesByCategory,
  fetchSalesByProduct,
  combineAddToCartCategoryViews,
  combineAddToCartViews,
  combineProductViews,
  combineProductViewsByCategory,
};
