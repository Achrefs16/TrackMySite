const pool = require("../db/database");
async function AcquisitionSources(appId) {
  const acquisitionSql = `
    SELECT 
      COALESCE(JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.referrer')), 'Direct / None') AS Referrer,
      COUNT(DISTINCT sessionId) AS NewUserSessions
    FROM events
    WHERE appId = ? AND event = 'page-view'
    GROUP BY Referrer
    ORDER BY NewUserSessions DESC
    LIMIT 10;
  `;

  try {
    const results = await pool.query(acquisitionSql, [appId]);
    return results[0].map((row) => ({
      Referrer: row.Referrer,
      NewUserSessions: row.NewUserSessions,
    }));
  } catch (error) {
    console.error("Error analyzing top ten acquisition sources:", error);
    throw error;
  }
}

exports.getnAcquisitionSources = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const acquisitionData = await AcquisitionSources(appId);
    res.json({ TopTenAcquisitionSources: acquisitionData });
  } catch (error) {
    console.error("Error in getTopTenAcquisitionSources:", error);
    res
      .status(500)
      .json({ error: "Error fetching top ten acquisition sources" });
  }
};

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
    res.json({ AcquisitionSources: data });
  } catch (error) {
    console.error("Error in getAcquisitionSources:", error);
    res.status(500).json({ error: "Error fetching acquisition sources" });
  }
};
