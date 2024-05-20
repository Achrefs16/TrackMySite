const pool = require("../db/database");

async function combineProductViews(appId) {
  // SQL for Total Product Views
  const totalViewsSql = `
    SELECT JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productName')) AS productName, COUNT(*) AS TotalViews
    FROM events
    WHERE appId = ? AND event = 'Product-View'
    GROUP BY productName
    ORDER BY TotalViews DESC
      LIMIT 5;
  `;

  // SQL for Daily Product Views in the Last Month

  try {
    // Fetch Total Views
    const totalViewsResult = await pool.query(totalViewsSql, [appId]);

    // Fetch Daily Views

    // Format the combined result

    return totalViewsResult[0];
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
    ORDER BY TotalAdds DESC
      LIMIT 5;
  `;

  try {
    // Fetch Total Adds
    const totalAddsResult = await pool.query(totalAddsSql, [appId]);

    return totalAddsResult[0];
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
    ORDER BY TotalAdds DESC
      LIMIT 5;
  `;

  try {
    // Fetch Total Adds by Category
    const totalCategoryAddsResult = await pool.query(totalCategoryAddsSql, [
      appId,
    ]);

    return totalCategoryAddsResult[0];
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
    ORDER BY TotalViews DESC
       LIMIT 5;
  `;

  try {
    // Fetch Total Views by Category
    const totalViewsByCategoryResult = await pool.query(
      totalViewsByCategorySql,
      [appId]
    );

    return totalViewsByCategoryResult[0];
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
        COUNT(*) AS Count,
        SUM(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productPrice'))) AS TotalRevenue
      FROM events
      WHERE appId = ? AND event = 'Purchase'
      GROUP BY ProductName
      ORDER BY TotalRevenue DESC
         LIMIT 5;
    `;
    const [results] = await pool.query(sql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching sales by product:", error);
    throw error; // Rethrowing the error is optional and depends on how you want to handle it upstream.
  }
}
async function fetchdateProduct(appId) {
  try {
    const sql = `
SELECT 
    Date,
    ProductName,
    Count
FROM (
    SELECT 
        Date,
        ProductName,
        Count,
        ROW_NUMBER() OVER (PARTITION BY Date ORDER BY Count DESC) AS row_num
    FROM (
        SELECT 
            DATE_FORMAT(FROM_UNIXTIME(timestamp / 1000), '%Y-%m-%d') AS Date,
            JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productName')) AS ProductName,
            COUNT(*) AS Count
        FROM events
        WHERE appId = ? AND event = 'Purchase'
        GROUP BY Date, ProductName
    ) AS subquery1
) AS subquery2
WHERE row_num <= 2;

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
        COUNT(*) AS Count,
        SUM(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productPrice'))) AS TotalRevenue
      FROM events
      WHERE appId = ? AND event = 'Purchase'
      GROUP BY productCategory
      ORDER BY TotalRevenue DESC
         LIMIT 10;
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
    console.log(appId);
    const sql = `
      SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productName')) AS ProductName,
        DATE(FROM_UNIXTIME(timestamp / 1000)) AS SaleDate,
        COUNT(*) AS Count,
        SUM(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productPrice'))) AS DailyRevenue
      FROM events
      WHERE appId = ? AND event = 'Purchase'
      GROUP BY SaleDate, ProductName
      ORDER BY SaleDate DESC, DailyRevenue DESC
         LIMIT 10;
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
    Date,
    Category,
    Count
FROM (
    SELECT 
        Date,
        Category,
        Count,
        ROW_NUMBER() OVER (PARTITION BY Date ORDER BY Count DESC) AS row_num
    FROM (
        SELECT 
            DATE_FORMAT(FROM_UNIXTIME(timestamp / 1000), '%Y-%m-%d') AS Date,
            JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productCategory')) AS Category,
            COUNT(*) AS Count
        FROM events
        WHERE appId = ? AND event = 'Purchase'
        GROUP BY Date, Category
    ) AS subquery1
) AS subquery2
WHERE row_num <= 5;
`;

    const [results] = await pool.query(sql, [appId]);
    console.log(results);
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
  fetchdateProduct,
};
