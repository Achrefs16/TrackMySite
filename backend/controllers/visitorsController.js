const pool = require("../db/database");

exports.getTotalVisitors = async (req, res) => {
  const { appId } = req.query;
  const { interval } = req.params; // e.g., 'day', 'week', 'month'

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
      break;
    case "week":
      condition = `YEARWEEK(FROM_UNIXTIME(timestamp / 1000), 1) = YEARWEEK(CURRENT_DATE, 1)`;
      breakdownGroupBy = `DATE(FROM_UNIXTIME(timestamp / 1000))`;
      break;
    case "month":
      condition = `YEAR(FROM_UNIXTIME(timestamp / 1000)) = YEAR(CURRENT_DATE) AND MONTH(FROM_UNIXTIME(timestamp / 1000)) = MONTH(CURRENT_DATE)`;
      breakdownGroupBy = `DATE(FROM_UNIXTIME(timestamp / 1000))`;
      break;
    case "quarter":
      condition = `YEAR(FROM_UNIXTIME(timestamp / 1000)) = YEAR(CURRENT_DATE) AND QUARTER(FROM_UNIXTIME(timestamp / 1000)) = QUARTER(CURRENT_DATE)`;
      breakdownGroupBy = `MONTH(FROM_UNIXTIME(timestamp / 1000))`;
      break;
    case "halfYear":
      const halfYearCondition =
        new Date().getMonth() < 6
          ? "MONTH(FROM_UNIXTIME(timestamp / 1000)) <= 6"
          : "MONTH(FROM_UNIXTIME(timestamp / 1000)) > 6";
      condition = `YEAR(FROM_UNIXTIME(timestamp / 1000)) = YEAR(CURRENT_DATE) AND ${halfYearCondition}`;
      breakdownGroupBy = `MONTH(FROM_UNIXTIME(timestamp / 1000))`;
      break;
    case "year":
      condition = `YEAR(FROM_UNIXTIME(timestamp / 1000)) = YEAR(CURRENT_DATE)`;
      breakdownGroupBy = `MONTH(FROM_UNIXTIME(timestamp / 1000))`;
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
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const newUsers = await fetchNewUsersLastWeek(appId);
    res.json({ NewUsersLastWeek: newUsers });
  } catch (error) {
    console.error("Error in getNewUsersLastWeek:", error);
    res.status(500).json({ error: "Error fetching new users data" });
  }
};
async function fetchNewUsersWeek(appId) {
  const newUsersSql = `
    SELECT COUNT(*) AS NewUsers
    FROM users
    WHERE appId = ? AND timestamp >= UNIX_TIMESTAMP(DATE_SUB(CURDATE(), INTERVAL 1 WEEK));
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
        WHEN sessionCount >= 5 THEN 'Highly Engaged'
        WHEN sessionCount >= 2 THEN 'Moderately Engaged'
        ELSE 'Low Engagement'
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
  const { appId } = req.query;
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
  const { appId } = req.query;
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
    ORDER BY UserCount DESC;
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
  const { appId } = req.query;
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
  const { appId } = req.query;
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
  const { appId } = req.query;
  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const languagePreferences = await fetchLanguagePreferences(appId);
    res.json({ LanguagePreferences: languagePreferences });
  } catch (error) {
    console.error("Error in getLanguagePreferences:", error);
    res.status(500).json({ error: "Error fetching language preferences data" });
  }
};
