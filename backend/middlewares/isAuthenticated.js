const pool = require("../db/database");
exports.isAuthenticated = async (req, res, next) => {
  // Assuming the appId is sent in the headers, but adjust according to your app's design
  const appId = req.headers["appid"];

  if (!appId) {
    return res.status(403).json({ message: "No appId provided" });
  }

  try {
    // Query your database to check if the appId exists
    const query = `SELECT * FROM websites WHERE appId = ?`; // Adjust the table and column names as necessary
    const [rows] = await pool.query(query, [appId]);

    if (rows.length > 0) {
      // If the appId exists in the database
      return next();
    } else {
      // If the appId does not exist

      return res.status(401).json({
        status: "error",
        message: "Unauthorized: appId does not exist",
      });
    }
  } catch (error) {
    console.error("Error verifying appId:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
