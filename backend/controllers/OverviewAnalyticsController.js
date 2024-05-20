const pool = require("../db/database"); // Assuming you have a pool for database connections

/**
 * Creates an Express route handler for fetching data by time intervals.
 * @param {string} entityType - 'users' or 'sessions', depending on the data to fetch.
 * @return {Function} - Express route handler.
 */
exports.createDataFetchHandler = (entityType) => {
  return async (req, res) => {
    try {
      const appId = req.query.appId;
      if (!appId) {
        return res.status(400).json({ error: "appId is required" });
      }

      const interval = req.params.interval;
      // Assuming interval is passed as a URL parameter
      const results = await fetchDataByIntervalAndSubIntervals(
        interval,
        appId,
        entityType
      );
      res.json(results);
    } catch (error) {
      console.error("Error in createDataFetchHandler:", error);
      res.status(500).json({ error: "Error fetching data" });
    }
  };
};
// Assuming you have a pool for database connections

/**
 * Fetches total counts and sub-interval breakdowns for a given interval, appId, and entityType.
 * @param {string} interval - The time interval ('day', 'week', 'month', 'quarter', 'halfYear', 'year').
 * @param {string} appId - The application ID.
 * @param {string} entityType - The entity type ('users', 'sessions', or 'events').
 * @returns {Promise<Object>} - Object containing total counts and sub-interval breakdowns.
 */
async function fetchDataByIntervalAndSubIntervals(interval, appId, entityType) {
  let condition = ""; // SQL condition for the main interval
  let breakdownGroupBy = ""; // SQL GROUP BY clause for sub-intervals
  switch (interval) {
    case "day":
      condition = `DATE(FROM_UNIXTIME(timestamp / 1000)) = CURRENT_DATE`;
      breakdownGroupBy = `DATE_FORMAT(FROM_UNIXTIME(timestamp / 1000), '%Y-%m-%d %H:00:00')

`;
      break;
    case "week":
      condition = `FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 1 week)`;
      breakdownGroupBy = `DATE(FROM_UNIXTIME(timestamp / 1000))`;
      break;
    case "month":
      condition = `FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)`;
      breakdownGroupBy = `DATE(FROM_UNIXTIME(timestamp / 1000))`;
      break;
    case "quarter":
      condition = `FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)`;
      breakdownGroupBy = `DATE(FROM_UNIXTIME(timestamp / 1000))`;
      break;
    case "halfYear":
      condition = `FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)`;
      breakdownGroupBy = `DATE(FROM_UNIXTIME(timestamp / 1000))`;
      break;
    case "year":
      condition = `FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)`;
      breakdownGroupBy = `DATE_FORMAT(FROM_UNIXTIME(timestamp / 1000), '%Y-%m')`; // Group by year and month
      break;
  }
  let distinctColumn = "id"; // Default
  if (entityType === "users") {
    distinctColumn = "userId"; // For users, use userId
  } else if (entityType === "sessions") {
    distinctColumn = "sessionId";
    // For sessions, use sessionId
  }
  // SQL for fetching the total count

  const totalSql = `
    SELECT COUNT(DISTINCT ${distinctColumn}) AS TotalCount 
    FROM ${entityType} 
    WHERE appId = '${appId}' AND ${condition};
  `;

  // SQL for fetching sub-interval breakdowns, if applicable
  const breakdownSql = breakdownGroupBy
    ? `
    SELECT ${breakdownGroupBy} AS SubInterval, COUNT(DISTINCT ${distinctColumn}) AS Count 
    FROM ${entityType} 
    WHERE appId = '${appId}' AND ${condition} 
    GROUP BY SubInterval 
    ORDER BY SubInterval ASC;
  `
    : null;

  try {
    const totalResult = await pool.query(totalSql);
    const total = totalResult[0][0]?.TotalCount || 0;
    let breakdown = [];

    if (breakdownSql) {
      const breakdownResult = await pool.query(breakdownSql);
      breakdown = breakdownResult[0];
    }

    return {
      TotalCount: total,
      Breakdown: breakdown,
    };
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

exports.fetchTotalConversion = async (req, res) => {
  try {
    const appId = req.query.appId;
    if (!appId) {
      return res.status(400).json({ error: "appId is required" });
    }

    const interval = req.params.interval;
    let dateCondition = ""; // SQL condition for the interval

    switch (interval) {
      case "day":
        condition = `DATE(FROM_UNIXTIME(timestamp / 1000)) = CURRENT_DATE`;
        breakdownGroupBy = `DATE_FORMAT(FROM_UNIXTIME(timestamp / 1000), '%Y-%m-%d %H:00:00')

`;
        break;
      case "week":
        condition = `FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 1 week)`;
        breakdownGroupBy = `DATE(FROM_UNIXTIME(timestamp / 1000))`;
        break;
      case "month":
        condition = `FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)`;
        breakdownGroupBy = `DATE(FROM_UNIXTIME(timestamp / 1000))`;
        break;
      case "quarter":
        condition = `FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)`;
        breakdownGroupBy = `DATE(FROM_UNIXTIME(timestamp / 1000))`;
        break;
      case "halfYear":
        condition = `FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)`;
        breakdownGroupBy = `DATE(FROM_UNIXTIME(timestamp / 1000))`;
        break;
      case "year":
        condition = `FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)`;
        breakdownGroupBy = `DATE_FORMAT(FROM_UNIXTIME(timestamp / 1000), '%Y-%m')`; // Group by year and month
        break;
    }

    const sql = `
        SELECT 
         
            SUM(
              CASE 
                WHEN event = 'Purchase' THEN JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.productPrice'))
                WHEN event = 'Subscribe' THEN JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.amount'))
                ELSE 0
              END
            
          ) AS TotalRevenue
        FROM events
        WHERE 
          appId = ? AND 
          (event = 'Purchase' OR event = 'Subscribe')
          ${dateCondition ? `AND ${dateCondition}` : ""};
      `;

    // Execute the query
    const [results] = await pool.query(sql, [appId]);

    // Check if results are empty and return appropriate response
    if (results.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }
    console.log(results[0]);
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching total conversion money:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
