const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const pool = require("./db/database");
const cron = require("node-cron");

const collectorRoutes = require("./routes/collectorRoutes");
const overviewAnalyticsRoutes = require("./routes/overviewAnalyticsRoutes");
const segmentRoures = require("./routes/segmentRoures");
const acquiqitionRoutes = require("./routes/acquiqitionRoutes");
const behaivorRoutes = require("./routes/behaivorRoutes");
const commerceRoutes = require("./routes/commerceRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const visitorsRoutes = require("./routes/visitorsRoutes");
const websitesRoutes = require("./routes/websitesRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.send("Express server with WebSocket");
});
app.use("/auth", userAuthRoutes);
app.get("/notifications", async (req, res) => {
  const { appId } = req.query; // Get appId from URL parameters
  console.log("hee");
  try {
    const notifications = await fetchNotificationsForAppId(appId);
    res.json(notifications); // Send notifications back as JSON
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Error fetching notifications");
  }
});
app.use("", overviewAnalyticsRoutes);
app.use("", acquiqitionRoutes);
app.use("", behaivorRoutes);
app.use("", commerceRoutes);
app.use("", eventsRoutes);
app.use("", subscriptionRoutes);
app.use("", visitorsRoutes);
app.use("", websitesRoutes);
app.use("", segmentRoures);

app.use("", collectorRoutes);

server.listen(5173, () => {
  console.log("Server started on http://localhost:5173");
});

cron.schedule("0 9 * * *", async () => {
  // Step 1: Fetch all appIds that need notifications
  const appIds = await getAppIds(); // Implement this to fetch relevant appIds

  // Step 2: Loop through each appId and process metrics and notifications
  for (const appId of appIds) {
    try {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      // Fetch metrics for today and yesterday
      const todayMetrics = await fetchMetricsForDate(today, appId);

      // Compare metrics and generate a notification message

      const visitorMessage = generateVisitorNotification(todayMetrics.visitors);
      if (visitorMessage) await storeNotification(appId, visitorMessage);

      // Store engagement notification
      const engagementMessage = generateEngagementNotification(
        todayMetrics.engagement
      );
      if (engagementMessage) await storeNotification(appId, engagementMessage);

      // Store the notification in the database
    } catch (error) {
      console.error(`Error processing metrics for appId ${appId}:`, error);
    }
  }
});
async function storeNotification(appId, message) {
  try {
    const sql = `INSERT INTO notifications (appId, message, status, creation_date) VALUES (?, ?, 'new', NOW())`;
    await pool.query(sql, [appId, message]);
  } catch (error) {
    console.log(error);
  }
}
async function fetchMetricsForDate(date, appId) {
  const dateString = date.toISOString().split("T")[0]; // Convert date to "YYYY-MM-DD" format

  // Query for counting unique visitors
  const visitorsSql = `
        SELECT COUNT(DISTINCT userId) AS Visitors
        FROM sessions
        WHERE appId = ? AND FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(NOW(), INTERVAL 1 DAY) ;`;

  // Query for calculating average session duration
  const engagementSql = `
       SELECT AVG(sessionDuration) AS Engagement
FROM (
    SELECT (MAX(FROM_UNIXTIME(timestamp / 1000)) - MIN(FROM_UNIXTIME(timestamp / 1000)))
     AS sessionDuration
    FROM events
    WHERE appId = ? AND FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    GROUP BY sessionId
) AS SessionDurations;
`;

  try {
    const visitorsResult = await pool.query(visitorsSql, [appId, dateString]);
    const engagementResult = await pool.query(engagementSql, [
      appId,
      dateString,
    ]);

    // Assuming each query successfully returns a row
    const visitors = visitorsResult[0][0].Visitors;
    const engagement = engagementResult[0][0].Engagement || 0; // Default to 0 if null
    console.log(engagement);
    return { visitors, engagement };
  } catch (error) {
    console.error(
      `Error fetching metrics for appId ${appId} on date ${dateString}:`,
      error
    );
    throw error;
  }
}

function generateVisitorNotification(visitors) {
  return `👥 Visiteurs au cours des dernières 24 heures : ${visitors}. Continuez à faire du bon travail en attirant l'attention de votre public !`;
}
function generateEngagementNotification(engagement) {
  const engagementNumber = Number(engagement);
  // Assuming engagement is measured in minutes
  return `⏳ Engagement moyen au cours des dernières 24 heures : ${engagementNumber.toFixed(
    2
  )} 
  minutes. Votre contenu est captivant !`;
}

async function getAppIds() {
  const sql = `
    SELECT DISTINCT appId 
    FROM sessions 
    WHERE FROM_UNIXTIME(timestamp / 1000) >= DATE_SUB(NOW(), INTERVAL 1 DAY);`;
  const [rows] = await pool.query(sql);

  return rows.map((row) => row.appId);
}

async function fetchNotificationsForAppId(appId) {
  const sql = `
    SELECT notification_id, message, status, creation_date
    FROM notifications
    WHERE appId = ?
    ORDER BY creation_date DESC`; // Assuming you want the newest notifications first

  const [rows] = await pool.query(sql, [appId]);
  return rows;
}

app.post("/notifications/update-status", async (req, res) => {
  const { notificationIds } = req.body;

  try {
    // Assuming you have a function to authenticate and authorize the user

    // Update the status of the notifications in the database
    const sql = `UPDATE notifications SET status = "open" WHERE notification_id IN (?)`;
    await pool.query(sql, [notificationIds]);

    res.send("Notification status updated successfully");
  } catch (error) {
    console.error("Error updating notification status:", error);
    res.status(500).send("Error updating notification status");
  }
});
