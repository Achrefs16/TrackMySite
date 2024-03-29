const pool = require("../db/database");
exports.appIdVerfication = async (req, res) => {
  const { appId } = req.headers["appid"];
  // If the appId is found in the validAppIds array
  res.json({ status: "success", message: "AppId exists.", appId });
};
exports.insertEventData = async (data) => {
  try {
    const query = `INSERT INTO events (appId,userId, sessionId,  pageUrl,event, eventData, timestamp) VALUES (?, ?, ?, ?, ?, ?,?)`;
    const [result] = await pool.query(query, [
      data.appId,
      data.userId,
      data.sessionId,
      data.pageUrl,
      data.event,
      JSON.stringify(data.eventData), // Storing the whole event object as JSON in eventData
      data.timestamp,
    ]);
    console.log(`Event inserted with ID: ${data.event} `);
  } catch (error) {
    console.error("Error inserting event data:", error);
  }
};
// Assume pool is already defined and configured to connect to your MySQL database
// Assume getCountryCityFromCoordinates is defined elsewhere and returns { country, city } based on given coordinates

exports.insertUserData = async (data) => {
  try {
    const que = `SELECT * FROM users WHERE userId = ?`;
    const [rows] = await pool.query(que, [data.userId]);

    if (rows.length > 0) {
      console.log("exist");
      return { status: "exists", message: "User already exists" };
    } else {
      const { latitude, longitude } = data;
      const { country, city } = await getCountryCityFromCoordinates(
        latitude,
        longitude
      );

      const query = `INSERT INTO users (userId, appId, browser, device, os, country, city, language, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [
        data.userId,
        data.appId,
        data.browser,
        data.device,
        data.os,
        country || "Unknown",
        city || "Unknown",
        data.language,
        data.timestamp,
      ];

      const [result] = await pool.query(query, params);

      console.log(`User inserted with ID: ${result.insertId}`);
      return {
        status: "success",
        message: `User inserted with ID: ${result.insertId}`,
      };
    }
  } catch (error) {
    console.error("Error in insertUserData:", error);
    // Depending on your error handling strategy, you might want to throw the error or return a specific error object
    throw new Error("Error processing your request.");
  }
};

async function getCountryCityFromCoordinates(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "pfe" },
    });
    const data = await response.json();

    const country = data.address.country;
    const city = data.address.city || data.address.town || data.address.village;

    return { country, city };
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null;
  }
}
exports.insertSessionData = async (data) => {
  try {
    // First, check if the session already exists
    const checkQuery = `SELECT * FROM sessions WHERE sessionId = ?`;
    const [existingSession] = await pool.query(checkQuery, [data.session_id]);

    if (existingSession.length > 0) {
      // Session already exists
      console.log(`Session already exists with ID: ${data.session_id}`);
      return { status: "exists", message: "Session already exists" };
    } else {
      // If the session does not exist, insert the new session
      const insertQuery = `INSERT INTO sessions (appId, userId, sessionId, timestamp) VALUES (?, ?, ?, ?)`;
      const params = [
        data.appId,
        data.userId,
        data.session_id, // Make sure this matches your actual column name
        data.start_time, // Make sure this matches your actual column name
      ];

      const [result] = await pool.query(insertQuery, params);
      console.log(`Session inserted with ID: ${result.insertId}`);
      return {
        status: "success",
        message: `Session inserted with ID: ${result.insertId}`,
      };
    }
  } catch (error) {
    console.error("Error in insertSessionData:", error);
    // Depending on your error handling strategy, you might want to either throw the error or return a specific error object
    throw new Error("Error processing your request.");
  }
};
