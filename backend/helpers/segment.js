const pool = require("../db/database");

async function PurchasersByLocation(appId) {
  const purchasersByLocationSql = `
    SELECT 
      u.country, 
      u.city, 
      COUNT(DISTINCT e.userId) AS NumberOfPurchasers
    FROM 
      events e
    INNER JOIN 
      users u ON e.userId = u.userId
    WHERE 
      e.appId = ? 
      AND e.event = 'Purchase' 
      AND u.appId = e.appId
    GROUP BY 
      u.country, 
      u.city
    ORDER BY 
      NumberOfPurchasers DESC, 
      u.country, 
      u.city;
  `;

  try {
    const [results] = await pool.query(purchasersByLocationSql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching purchasers by location:", error);
    throw error;
  }
}

async function PurchasersByCityInCountry(appId, country) {
  const purchasersByCitySql = `
    SELECT 
      u.city, 
      COUNT(DISTINCT e.userId) AS NumberOfPurchasers
    FROM 
      events e
    INNER JOIN 
      users u ON e.userId = u.userId
    WHERE 
      e.appId = ? 
      AND u.country = ?
      AND e.event = 'Purchase' 
      AND u.appId = e.appId
    GROUP BY 
      u.city
    ORDER BY 
      NumberOfPurchasers DESC;
  `;

  try {
    const [results] = await pool.query(purchasersByCitySql, [appId, country]);
    return results;
  } catch (error) {
    console.error("Error fetching purchasers by city in country:", error);
    throw error;
  }
}
async function CityByContentTypeEngagement(appId) {
  const contentTypeEngagementSql = `
    SELECT 
      u.city, 
      JSON_EXTRACT(e.eventData, '$.contentType') AS ContentType,
      COUNT(DISTINCT e.userId) AS NumberOfEngagedUsers
    FROM 
      events e
    INNER JOIN 
      users u ON e.userId = u.userId
    WHERE 
      e.appId = ? 
      AND e.event = 'Content-Engagement'
      AND u.appId = e.appId
    GROUP BY 
      u.city, 
      ContentType
    ORDER BY 
      u.city, 
      NumberOfEngagedUsers DESC;
  `;

  try {
    const [results] = await pool.query(contentTypeEngagementSql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching city by content type engagement:", error);
    throw error;
  }
}

async function CountryBySubscriptionPlan(appId) {
  const subscriptionPlanSql = `
    SELECT 
      u.country,
      JSON_EXTRACT(e.eventData, '$.subscriptionPlan') AS SubscriptionPlan,
      COUNT(DISTINCT e.userId) AS NumberOfSubscribers
    FROM 
      events e
    INNER JOIN 
      users u ON e.userId = u.userId
    WHERE 
      e.appId = ? 
      AND e.event = 'Subscribe'
      AND u.appId = e.appId
    GROUP BY 
      u.country, 
      SubscriptionPlan
    ORDER BY 
      u.country, 
      NumberOfSubscribers DESC;
  `;

  try {
    const [results] = await pool.query(subscriptionPlanSql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching country by subscription plan:", error);
    throw error;
  }
}

async function CityBySubscriptionPlan(appId) {
  const subscriptionPlanSql = `
    SELECT 
      u.city,
      JSON_EXTRACT(e.eventData, '$.subscriptionPlan') AS SubscriptionPlan,
      COUNT(DISTINCT e.userId) AS NumberOfSubscribers
    FROM 
      events e
    INNER JOIN 
      users u ON e.userId = u.userId
    WHERE 
      e.appId = ? 
      AND e.event = 'Subscribe'
      AND u.appId = e.appId
    GROUP BY 
      u.city, 
      SubscriptionPlan
    ORDER BY 
      u.city, 
      NumberOfSubscribers DESC;
  `;

  try {
    const [results] = await pool.query(subscriptionPlanSql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching city by subscription plan:", error);
    throw error;
  }
}
