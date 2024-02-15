const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mysql = require("mysql2/promise");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "trackmysite",
});

const JournyQuery = `SELECT Journey, COUNT(*) AS Occurrences FROM ( SELECT sessionId, GROUP_CONCAT(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) ORDER BY timestamp SEPARATOR ' -> ') AS Journey FROM events WHERE appId = '12345678911111' GROUP BY sessionId ) AS SessionJourneys GROUP BY Journey ORDER BY Occurrences DESC;`;
const lastPageQuery = `SELECT 
  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) AS LastPage,
  COUNT(*) AS DropOffs
FROM (
  SELECT 
    sessionId, 
    eventData,
    RANK() OVER (PARTITION BY sessionId ORDER BY timestamp DESC) AS rn
  FROM events
  WHERE appId = '12345678911111' AND event = 'page-view'
) AS LastEvents
WHERE rn = 1
GROUP BY LastPage
ORDER BY DropOffs DESC;
`;
const entryPageQuery = `SELECT 
  JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.PageName')) AS EntryPage,
  COUNT(*) AS Entries
FROM (
  SELECT 
    sessionId, 
    eventData,
    RANK() OVER (PARTITION BY sessionId ORDER BY timestamp ASC) AS rn
  FROM events
  WHERE appId = '12345678911111' AND event = 'page-view'
) AS FirstEvents
WHERE rn = 1
GROUP BY EntryPage
ORDER BY Entries DESC;
`;
async function insertEventData(data) {
  console.log(data.userId);
  try {
    const query = `INSERT INTO events (appId,userId, sessionId,  pageUrl,event, eventData, timestamp) VALUES (?, ?, ?, ?, ?, ?,?)`;
    const [result] = await db.execute(query, [
      data.appId,
      data.userId,
      data.sessionId,
      data.pageUrl,
      data.event,
      JSON.stringify(data.eventData), // Storing the whole event object as JSON in eventData
      data.timestamp,
    ]);
    console.log(`Event inserted with ID: ${result.insertId}`);
  } catch (error) {
    console.error("Error inserting event data:", error);
  }
}
async function insertUserData(data) {
  try {
    console.log(data.browser);
    const query = `INSERT INTO user (userId, appId, browser,  browserVersion,device, os, language,timestamp) VALUES (?, ?, ?, ?, ?, ?,?, ?)`;
    const [result] = await db.execute(query, [
      data.userId,
      data.appId,
      data.browser,
      data.browserVersion,
      data.device,
      data.os,
      data.language, // Storing the whole event object as JSON in eventData
      data.timestamp,
    ]);
    console.log(`Event inserted with ID: ${result.insertId}`);
  } catch (error) {
    console.error("Error inserting event data:", error);
  }
}
async function insertSessionData(data) {
  try {
    const query = `INSERT INTO sessions (appId, userId, sessionId, startTime) VALUES (?, ?, ?, ?)`;
    const [result] = await db.execute(query, [
      data.appId,
      data.userId,
      data.session_id, // Make sure the column name matches your database schema
      data.start_time,
    ]);
    console.log(`Session inserted with ID: ${result.insertId}`);
  } catch (error) {
    console.error("Error inserting session data:", error);
  }
}

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket.");

  ws.on("message", async (message) => {
    console.log(`Received message: ${message}`);

    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case "event":
          await insertEventData(data);
          break;
        case "user":
          await insertUserData(data);
          break;
        case "session":
          await insertSessionData(data);
          break;
        default:
          console.error("Unknown data type:", data.type);
      }

      ws.send(
        JSON.stringify({
          status: "success",
          message: "Data received and processed",
        })
      );
    } catch (error) {
      console.error("Failed to process message:", error);
      ws.send(
        JSON.stringify({ status: "error", message: "Error processing data" })
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Express server with WebSocket");
});

server.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
