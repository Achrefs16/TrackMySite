const pool = require("../db/database");

async function analyzeAllSessions(appId) {
  const sql = `
    SELECT 
      COALESCE(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.referrer')), 'Direct / None') AS Referrer,
      COUNT(DISTINCT sessionId) AS SessionCount
    FROM events
    WHERE appId = ? AND event = 'page-view'
    GROUP BY Referrer
    ORDER BY SessionCount DESC
    LIMIT 10;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    return results[0].map((row) => ({
      Referrer: row.Referrer,
      SessionCount: row.SessionCount,
    }));
  } catch (error) {
    console.error("Error in analyzeAllSessions:", error);
    throw error;
  }
}

exports.getAcquisitionSources = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const data = await analyzeAllSessions(appId);
    res.json(data);
  } catch (error) {
    console.error("Error in getAcquisitionSources:", error);
    res.status(500).json({ error: "Error fetching acquisition sources" });
  }
};
