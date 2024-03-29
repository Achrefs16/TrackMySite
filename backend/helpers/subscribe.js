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

exports.fetchTotalConversion = async (appId) => {
  try {
    // Define SQL to sum total conversion money from 'Purchase' and 'Subscribe' events
    const sql = `
      SELECT 
        'Total Conversion Money' AS Metric,
        SUM(CASE 
              WHEN event = 'Purchase' THEN JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productPrice'))
              WHEN event = 'Subscribe' THEN JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.amount'))
              ELSE 0
            END) AS TotalRevenue
      FROM events
      WHERE 
        appId = ? AND 
        (event = 'Purchase' OR event = 'Subscribe');
    `;

    // Execute the query
    const [results] = await pool.query(sql, [appId]);

    // Check if results are empty and return appropriate response
    if (results.length === 0) {
      return { Metric: "Total Conversion Money", TotalRevenue: 0 };
    }

    return results[0];
  } catch (error) {
    console.error("Error fetching total conversion money:", error);
    throw error;
  }
};
