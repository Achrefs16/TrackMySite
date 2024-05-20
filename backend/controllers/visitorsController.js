const pool = require("../db/database");

exports.getTotalVisitors = async (req, res) => {
  const appId = req.query.appId;
  const interval = req.params.interval;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const totalVisitors = await fetchUserAnalyticsByInterval(appId, interval);
    res.json({ interval, totalVisitors });
  } catch (error) {
    console.error("Error in getTotalVisitors:", error);
    res.status(500).json({ error: "Error fetching total visitors data" });
  }
};
async function fetchUserAnalyticsByInterval(appId, interval) {
  let condition = ""; // SQL condition for the main interval
  let breakdownGroupBy = ""; // SQL GROUP BY clause for sub-intervals

  switch (interval) {
    case "day":
      condition = `DATE(FROM_UNIXTIME(timestamp / 1000)) = CURRENT_DATE`;
      breakdownGroupBy = `DATE_FORMAT(FROM_UNIXTIME(timestamp / 1000), '%Y-%m-%d %H:00:00')`;
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

  // SQL for fetching the total count of unique users
  const totalSql = `
    SELECT COUNT(DISTINCT userId) AS TotalCount 
    FROM users 
    WHERE appId = ? AND ${condition};
  `;

  // SQL for fetching sub-interval breakdowns, if applicable
  const breakdownSql = breakdownGroupBy
    ? `
    SELECT ${breakdownGroupBy} AS SubInterval, COUNT(DISTINCT userId) AS Count 
    FROM users 
    WHERE appId = ? AND ${condition} 
    GROUP BY SubInterval 
    ORDER BY SubInterval ASC;
  `
    : null;

  try {
    const totalResult = await pool.query(totalSql, [appId]);
    const total = totalResult[0][0]?.TotalCount || 0;
    let breakdown = [];

    if (breakdownSql) {
      const breakdownResult = await pool.query(breakdownSql, [appId]);
      breakdown = breakdownResult[0];
    }

    return {
      TotalCount: total,
      Breakdown: breakdown,
    };
  } catch (error) {
    console.error("Error executing query for user analytics:", error);
    throw error;
  }
}

///////////////////////////////////new users
exports.getNewUsersLastWeek = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const newUsers = await fetchNewUsers(appId);
    res.json({ NewUsers: newUsers });
  } catch (error) {
    console.error("Error in getNewUsersLastWeek:", error);
    res.status(500).json({ error: "Error fetching new users data" });
  }
};
async function fetchNewUsers(appId) {
  const newUsersSql = `
    SELECT COUNT(*) AS NewUsers
    FROM users
    WHERE appId = ? AND FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(CURRENT_DATE, INTERVAL 1 week);
  `;

  try {
    const [results] = await pool.query(newUsersSql, [appId]);
    return results[0].NewUsers;
  } catch (error) {
    console.error("Error fetching new users:", error);
    throw error;
  }
}

async function fetchReturningUsers(appId) {
  const returningUsersSql = `
    SELECT COUNT(*) AS ReturningUsers
    FROM (
      SELECT userId
      FROM sessions
      WHERE appId = ?
      GROUP BY userId
      HAVING COUNT(sessionId) > 1
    ) AS ReturningUsersSubquery;
  `;

  try {
    const [results] = await pool.query(returningUsersSql, [appId]);
    return results[0].ReturningUsers;
  } catch (error) {
    console.error("Error fetching returning users:", error);
    throw error;
  }
}

//engament
async function fetchUserLoyalty(appId) {
  const userLoyaltySql = `
    SELECT
      CASE
        WHEN sessionCount >= 5 THEN 'fortement engagés'
        WHEN sessionCount >= 3 THEN 'modérément engagés'
        ELSE 'peu engagés'
      END AS EngagementLevel,
      COUNT(*) AS UserCount
    FROM (
      SELECT userId, COUNT(sessionId) AS sessionCount
      FROM sessions
      WHERE appId = ?
      GROUP BY userId
    ) AS UserEngagement
    GROUP BY EngagementLevel;
  `;

  try {
    const results = await pool.query(userLoyaltySql, [appId]);
    let loyaltySummary = results[0].reduce((acc, row) => {
      acc[row.EngagementLevel] = row.UserCount;
      return acc;
    }, {});

    return loyaltySummary;
  } catch (error) {
    console.error("Error fetching user loyalty:", error);
    throw error;
  }
}

exports.getReturningUsers = async (req, res) => {
  const appId = req.query.appId;
  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  try {
    const returningUsers = await fetchReturningUsers(appId);
    res.json({ ReturningUsers: returningUsers });
  } catch (error) {
    console.error("Error in getReturningUsers:", error);
    res.status(500).json({ error: "Error fetching returning users data" });
  }
};

exports.getUserLoyalty = async (req, res) => {
  const appId = req.query.appId;
  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  try {
    const userLoyalty = await fetchUserLoyalty(appId);
    res.json({ UserLoyalty: userLoyalty });
  } catch (error) {
    console.error("Error in getUserLoyalty:", error);
    res.status(500).json({ error: "Error fetching user loyalty data" });
  }
};

//////geo

async function fetchGeographicDistribution(appId) {
  const geoDistributionSql = `
    SELECT country, city, COUNT(*) AS UserCount
    FROM users
    WHERE appId = ? AND country IS NOT NULL AND city IS NOT NULL
    GROUP BY country, city
    ORDER BY UserCount DESC
    
  `;

  try {
    const results = await pool.query(geoDistributionSql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error fetching geographic distribution:", error);
    throw error;
  }
}

exports.getGeographicDistribution = async (req, res) => {
  const appId = req.query.appId;
  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const geographicDistribution = await fetchGeographicDistribution(appId);
    res.json({ GeographicDistribution: geographicDistribution });
  } catch (error) {
    console.error("Error in getGeographicDistribution:", error);
    res
      .status(500)
      .json({ error: "Error fetching geographic distribution data" });
  }
};

//////device

async function fetchDeviceAndBrowserUsage(appId) {
  const deviceUsageSql = `
    SELECT device, os, browser, COUNT(*) AS UserCount
    FROM users
    WHERE appId = ?
    GROUP BY device, os, browser
    ORDER BY UserCount DESC;
  `;

  try {
    const results = await pool.query(deviceUsageSql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error fetching device and browser usage:", error);
    throw error;
  }
}

// Inside visitorsController.js

exports.getDeviceAndBrowserUsage = async (req, res) => {
  const appId = req.query.appId;
  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const deviceAndBrowserUsage = await fetchDeviceAndBrowserUsage(appId);
    res.json({ DeviceAndBrowserUsage: deviceAndBrowserUsage });
  } catch (error) {
    console.error("Error in getDeviceAndBrowserUsage:", error);
    res
      .status(500)
      .json({ error: "Error fetching device and browser usage data" });
  }
};

/////// languge

async function fetchLanguagePreferences(appId) {
  const languagePreferenceSql = `
    SELECT language, COUNT(*) AS UserCount
    FROM users
    WHERE appId = ? AND language IS NOT NULL
    GROUP BY language
    ORDER BY UserCount DESC;
  `;

  try {
    const results = await pool.query(languagePreferenceSql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error fetching language preferences:", error);
    throw error;
  }
}

// Inside visitorsController.js

exports.getLanguagePreferences = async (req, res) => {
  const appId = req.query.appId;
  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const languages = await fetchLanguagePreferences(appId);
    res.json({ Languages: languages });
  } catch (error) {
    console.error("Error in getLanguagePreferences:", error);
    res.status(500).json({ error: "Error fetching language preferences data" });
  }
};
