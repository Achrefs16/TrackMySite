const pool = require("../db/database");
exports.getEngagedUsers = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  const sql = `
    SELECT 
      userId,
      COUNT(*) AS InteractionCount
    FROM events
    WHERE appId = ?
    GROUP BY userId
    HAVING InteractionCount > 10
    ORDER BY InteractionCount DESC;
  `;

  // Use the `appId` as a parameter in the query
  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};

exports.getUserJourny = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT Journey, COUNT(*) AS Occurrences FROM ( SELECT sessionId, GROUP_CONCAT(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) ORDER BY timestamp SEPARATOR ' -> ') AS Journey FROM events WHERE appId = ? GROUP BY sessionId ) AS SessionJourneys GROUP BY Journey ORDER BY Occurrences DESC LIMIT 10;`;
  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};
exports.getLastPage = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) AS LastPage,
  COUNT(*) AS DropOffs
FROM (
  SELECT 
    sessionId, 
    eventData,
    RANK() OVER (PARTITION BY sessionId ORDER BY timestamp DESC) AS rn
  FROM events
  WHERE appId = ? AND event = 'page-view'
) AS LastEvents
WHERE rn = 1
GROUP BY LastPage
ORDER BY DropOffs DESC;`;
  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};

exports.getEntryPage = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) AS EntryPage,
  COUNT(*) AS Entries
FROM (
  SELECT 
    sessionId, 
    eventData,
    RANK() OVER (PARTITION BY sessionId ORDER BY timestamp ASC) AS rn
  FROM events
  WHERE appId = ? AND event = 'page-view'
) AS FirstEvents
WHERE rn = 1
GROUP BY EntryPage
ORDER BY Entries DESC;
`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};

exports.ViewsPerPage = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT pageUrl, COUNT(*) AS PageViews
FROM events
WHERE event = 'page-view' AND appId = ?
GROUP BY pageUrl
ORDER BY PageViews DESC;`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};
exports.avessionDuration = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  CONCAT(
    FLOOR(AVG(sessionEndTime - startTime) / 60), ' minutes ', 
    AVG(sessionEndTime - startTime) % 60, ' seconds'
  ) AS AvgSessionDuration
FROM (
  SELECT 
    e.sessionId, 
    s.startTime, 
    MAX(e.timestamp) AS sessionEndTime
  FROM events e
  JOIN sessions s ON e.sessionId = s.sessionId
  WHERE e.appId = ?
  GROUP BY e.sessionId
) AS SessionDurations;


`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};

exports.UserEngagement = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  pageUrl, 
  AVG(JSON_EXTRACT(eventData, '$.timespent')) AS AvgTimeSpent, 
  AVG(JSON_EXTRACT(eventData, '$.scrollPercentage')) AS AvgScrollDepth
FROM events
WHERE event = 'page-view' AND appId = ?
GROUP BY pageUrl
ORDER BY AvgTimeSpent DESC, AvgScrollDepth DESC;

`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};

exports.DeviceBrowser = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  browser, 
  device, 
  COUNT(*) AS UserCount
FROM user
WHERE appId = ?
GROUP BY browser, device
ORDER BY UserCount DESC;


`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};

exports.TotalEvents = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  event, 
  COUNT(*) AS EventCount
FROM events
WHERE appId = ?
GROUP BY event
ORDER BY EventCount DESC;
`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};

exports.TotalEperPage = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  event, 
  COUNT(*) AS EventCount
FROM events
WHERE appId = ?
GROUP BY event
ORDER BY EventCount DESC;
`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};
exports.SginPerDay = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  DATE(FROM_UNIXTIME(timestamp / 1000)) AS SignUpDate, 
  COUNT(DISTINCT userId) AS NewUsers
FROM events
WHERE event = 'SignUp' And appId = ?
GROUP BY SignUpDate
ORDER BY SignUpDate;
`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};
exports.totalesingup = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  COUNT(DISTINCT userId) AS TotalSignUps
FROM events
WHERE 
  event = 'SignUp'
  AND appId = ?;
`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};

exports.DailyActiveUsers = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  DATE(FROM_UNIXTIME(timestamp / 1000)) AS ActivityDate, 
  COUNT(DISTINCT userId) AS DailyActiveUsers
FROM events
WHERE appId = ? 
GROUP BY ActivityDate
ORDER BY ActivityDate;
`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};
exports.Subbyplan = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  eventData->>'$.subscriptionPlan' AS Plan, 
  COUNT(*) AS Subscriptions
FROM events
WHERE event = 'Subscribe'
GROUP BY Plan
ORDER BY Subscriptions DESC;
`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};

exports.Unsubreasn = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  eventData->>'$.reason' AS Reason, 
  COUNT(*) AS UnsubscribeCount
FROM events
WHERE event = 'Unsubscribe'
GROUP BY Reason
ORDER BY UnsubscribeCount DESC;

`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};
exports.refdom = async (req, res) => {
  const appId = req.query.appId;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  const sql = `SELECT 
  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.referrer')) AS Referrer,
  COUNT(*) AS Referrals
FROM events
WHERE appId = ? AND event ='page-view' AND JSON_EXTRACT(eventData, '$.referrer') IS NOT NULL
GROUP BY Referrer
ORDER BY Referrals DESC
LIMIT 10;
`;

  try {
    console.log(sql, [appId]);
    const [results] = await pool.query(sql, [appId]);
    res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error executing query" });
  }
};
