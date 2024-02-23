// behaviorAnalyticsController.js

const pool = require("../db/database"); // Assuming a database connection is set up

// Function to fetch page view counts
async function fetchPageViews(appId) {
  const pageViewsSql = `
    SELECT pageUrl, COUNT(*) AS PageViews
    FROM events
    WHERE appId = ? AND event = 'page-view'
    GROUP BY pageUrl
    ORDER BY PageViews DESC;
  `;

  try {
    const results = await pool.query(pageViewsSql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error fetching page views:", error);
    throw error;
  }
}

// Function to fetch average session duration
async function fetchAverageSessionDuration(appId) {
  const sessionDurationSql = `
    SELECT AVG(sessionDuration) AS AvgSessionDuration
    FROM (
      SELECT MAX(timestamp) - MIN(timestamp) AS sessionDuration
      FROM events
      WHERE appId = ?
      GROUP BY sessionId
    ) AS SessionDurations;
  `;

  try {
    const [results] = await pool.query(sessionDurationSql, [appId]);
    // Convert the average session duration from milliseconds to seconds for readability
    const avgSessionDurationInSeconds = results[0].AvgSessionDuration / 1000;
    return avgSessionDurationInSeconds.toFixed(2); // Format the result to 2 decimal places
  } catch (error) {
    console.error("Error fetching revised average session duration:", error);
    throw error;
  }
}

// Route handler to get page views
exports.getPageViews = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const pageViews = await fetchPageViews(appId);
    res.json({ PageViews: pageViews });
  } catch (error) {
    console.error("Error in getPageViews:", error);
    res.status(500).json({ error: "Error fetching page views data" });
  }
};

// Route handler to get average session duration
exports.getAverageSessionDuration = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const avgSessionDuration = await fetchAverageSessionDuration(appId);
    res.json({ AvgSessionDuration: avgSessionDuration });
  } catch (error) {
    console.error("Error in getAverageSessionDuration:", error);
    res
      .status(500)
      .json({ error: "Error fetching average session duration data" });
  }
};

//////user journyu
async function fetchUserJourneys(appId) {
  const sql = `
    SELECT Journey, COUNT(*) AS Occurrences 
    FROM ( 
      SELECT sessionId, GROUP_CONCAT(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) ORDER BY timestamp SEPARATOR ' -> ') AS Journey 
      FROM events 
      WHERE appId = ? 
      GROUP BY sessionId 
    ) AS SessionJourneys 
    GROUP BY Journey 
    ORDER BY Occurrences DESC 
    LIMIT 10;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    // Convert the Journey string back into an array
    const journeysAsArray = results[0].map((row) => ({
      ...row,
      Journey: row.Journey.split(" -> "),
    }));
    return journeysAsArray;
  } catch (error) {
    console.error("Error fetching user journeys as array:", error);
    throw error;
  }
}

// Route handler to get user journeys
exports.getUserJourneys = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const userJourneys = await fetchUserJourneys(appId);
    res.json({ UserJourneys: userJourneys });
  } catch (error) {
    console.error("Error in getUserJourneys:", error);
    res.status(500).json({ error: "Error fetching user journeys data" });
  }
};
////last pageee

async function fetchLastPageSessionCounts(appId) {
  const lastPageSessionCountsSql = `
    SELECT LastPage, COUNT(*) AS SessionCount
    FROM (
      SELECT sessionId, JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) AS LastPage,
             RANK() OVER (PARTITION BY sessionId ORDER BY timestamp DESC) AS rn
      FROM events
      WHERE appId = ? AND event = 'page-view'
    ) AS LastEvents
    WHERE rn = 1
    GROUP BY LastPage
    ORDER BY SessionCount DESC;
  `;

  try {
    const results = await pool.query(lastPageSessionCountsSql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error fetching last page session counts:", error);
    throw error;
  }
}

// Inside behaviorAnalyticsController.js

exports.getLastPageSessionCounts = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const lastPageSessionCounts = await fetchLastPageSessionCounts(appId);
    res.json({ LastPageSessionCounts: lastPageSessionCounts });
  } catch (error) {
    console.error("Error in getLastPageSessionCounts:", error);
    res
      .status(500)
      .json({ error: "Error fetching last page session counts data" });
  }
};
async function fetchEntryPageSessionCounts(appId) {
  const entryPageSessionCountsSql = `
    SELECT EntryPage, COUNT(*) AS SessionCount
    FROM (
      SELECT sessionId, JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) AS EntryPage,
             RANK() OVER (PARTITION BY sessionId ORDER BY timestamp ASC) AS rn
      FROM events
      WHERE appId = ? AND event = 'page-view'
    ) AS FirstEvents
    WHERE rn = 1
    GROUP BY EntryPage
    ORDER BY SessionCount DESC;
  `;

  try {
    const results = await pool.query(entryPageSessionCountsSql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error fetching entry page session counts:", error);
    throw error;
  }
}
exports.getEntryPageSessionCounts = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const entryPageSessionCounts = await fetchEntryPageSessionCounts(appId);
    res.json({ EntryPageSessionCounts: entryPageSessionCounts });
  } catch (error) {
    console.error("Error in getEntryPageSessionCounts:", error);
    res
      .status(500)
      .json({ error: "Error fetching entry page session counts data" });
  }
};
/////bounce rate

async function fetchBounceRateByEntryPage(appId) {
  const bounceRateSql = `
    SELECT EntryPage, 
           COUNT(*) AS TotalSessions,
           SUM(CASE WHEN PageViews = 1 THEN 1 ELSE 0 END) AS SinglePageSessions,
           (SUM(CASE WHEN PageViews = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS BounceRate
    FROM (
      SELECT sessionId, 
             JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) AS EntryPage,
             COUNT(sessionId) AS PageViews
      FROM events
      WHERE appId = ? AND event = 'page-view'
      GROUP BY sessionId
    ) AS SessionData
    GROUP BY EntryPage
    ORDER BY BounceRate DESC;
  `;

  try {
    const results = await pool.query(bounceRateSql, [appId]);
    return results[0].map((row) => ({
      EntryPage: row.EntryPage,
      TotalSessions: row.TotalSessions,
      SinglePageSessions: row.SinglePageSessions,
      BounceRate: row.BounceRate.toFixed(2) + "%",
    }));
  } catch (error) {
    console.error("Error fetching bounce rate by entry page:", error);
    throw error;
  }
}
// Inside behaviorAnalyticsController.js

exports.getBounceRateByEntryPage = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const bounceRateByEntryPage = await fetchBounceRateByEntryPage(appId);
    res.json({ BounceRateByEntryPage: bounceRateByEntryPage });
  } catch (error) {
    console.error("Error in getBounceRateByEntryPage:", error);
    res
      .status(500)
      .json({ error: "Error fetching bounce rate by entry page data" });
  }
};

async function PageEngagement(appId) {
  const engagementMetricsSql = `
    SELECT 
      JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) AS PageName,
      AVG(JSON_EXTRACT(eventData, '$.timespent')) AS AvgTimeSpent,
      AVG(JSON_EXTRACT(eventData, '$.scrollPercentage')) AS AvgScrollDepth,
      COUNT(*) AS PageViews
    FROM events
    WHERE appId = ? AND event = 'page-leave' AND JSON_EXTRACT(eventData, '$.PageName') IS NOT NULL
    GROUP BY PageName
    ORDER BY AvgTimeSpent DESC, AvgScrollDepth DESC;
  `;

  try {
    const results = await pool.query(engagementMetricsSql, [appId]);
    return results[0].map((row) => ({
      PageName: row.PageName,
      AvgTimeSpent: parseFloat(row.AvgTimeSpent).toFixed(2) + " seconds",
      AvgScrollDepth: parseFloat(row.AvgScrollDepth).toFixed(2) + "%",
      PageViews: row.PageViews,
    }));
  } catch (error) {
    console.error("Error fetching page engagement :", error);
    throw error;
  }
}
// Inside behaviorAnalyticsController.js

exports.getPageEngagement = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const pageEngagementMetrics = await PageEngagement(appId);
    res.json({ PageEngagementMetrics: pageEngagementMetrics });
  } catch (error) {
    console.error("Error in getPageEngagement:", error);
    res.status(500).json({
      error: "Error fetching page engagement metrics data with scroll depth",
    });
  }
};
