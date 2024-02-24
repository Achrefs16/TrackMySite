const pool = require("../db/database");

exports.fetchSubscriptionData = async (appId) => {
  try {
    const subscriptionSql = `
      SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.subscriptionPlan')) AS SubscriptionPlan,
        COUNT(*) AS TotalSubscriptions,
        SUM(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.amount'))) AS TotalRevenue
      FROM events
      WHERE appId = ? AND event = 'Subscribe'
      GROUP BY SubscriptionPlan
      ORDER BY TotalSubscriptions DESC;
    `;

    const [results] = await pool.query(subscriptionSql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching subscription data:", error);
    throw error;
  }
};

exports.fetchUnsubscribeData = async (appId) => {
  try {
    const unsubscribeSql = `
      SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.reason')) AS Reason,
        COUNT(*) AS TotalUnsubscribes
      FROM events
      WHERE appId = ? AND event = 'Unsubscribe'
      GROUP BY Reason
      ORDER BY TotalUnsubscribes DESC;
    `;

    const [results] = await pool.query(unsubscribeSql, [appId]);
    return results;
  } catch (error) {
    console.error("Error fetching unsubscription data:", error);
    throw error;
  }
};
