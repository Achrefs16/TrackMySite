// Unified Analytics Function
const pool = require("../db/database");
exports.analyzeEventByType = async (appId, eventType) => {
  switch (eventType) {
    case "file-download":
      return await analyzeFileDownloads(appId);
    case "video-play":
      return await analyzeVideoInteractions(appId);
    case "form-submit":
      return await analyzeFormSubmissions(appId);
    case "click":
      return await analyzeClickEvents(appId);
    case "query-search":
      return await analyzeSearchQueryEvents(appId);
    case "clipboard-copy":
      return await analyzeClipboardCopyEvents(appId);
    case "visibility":
      return await analyzeVisibilityEvents(appId);
    case "custom-event":
      return await analyzeCustomEvents(appId);
    default:
      throw new Error(`Unsupported event type: ${eventType}`);
  }
};

async function analyzeClipboardCopyEvents(appId) {
  const sql = `
    SELECT 
       event,
    pageUrl,
      eventData,
   
      COUNT(*) AS Count
    FROM events
    WHERE appId = ? AND event = 'clipboard-copy' 
    GROUP BY eventData
    ORDER BY Count DESC;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error analyzing clipboard copy events:", error);
    throw error;
  }
}

async function analyzeSearchQueryEvents(appId) {
  const sql = `
    SELECT 
     event,
      pageUrl,
     eventData,
      COUNT(*) AS Count
    FROM events
    WHERE appId = ? AND event = 'query-search'
    GROUP BY eventData
    ORDER BY Count DESC;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error analyzing search query events:", error);
    throw error;
  }
}
async function analyzeClickEvents(appId) {
  const sql = `
    SELECT 
     event,
      pageUrl,
      eventData,
      COUNT(*) AS Count
    FROM events
    WHERE appId = ? AND event = 'click'
    GROUP BY eventData
    ORDER BY Count DESC;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error analyzing click events:", error);
    throw error;
  }
}
async function analyzeFormSubmissions(appId) {
  const sql = `
    SELECT 
     event,
      pageUrl,
      eventData,
      COUNT(*) AS Count
    FROM events
    WHERE appId = ? AND event = 'form-submit'
    GROUP BY eventData
    ORDER BY Count DESC;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error analyzing form submissions:", error);
    throw error;
  }
}
async function analyzeVideoInteractions(appId) {
  const sql = `
    SELECT 
     event,
      pageUrl,
      eventData,
      COUNT(*) AS Count,
      AVG(JSON_EXTRACT(eventData, '$.videoDuration')) AS AvgDuration
    FROM events
    WHERE appId = ? AND event = 'video-play'
    GROUP BY eventData
    ORDER BY Count DESC;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    return results[0].map((row) => ({
      ...row,
      AvgDuration: parseFloat(row.AvgDuration).toFixed(2),
    }));
  } catch (error) {
    console.error("Error analyzing video interactions:", error);
    throw error;
  }
}
async function analyzeFileDownloads(appId) {
  const sql = `
    SELECT 
     event,
      pageUrl,
      eventData,
      COUNT(*) AS Count
    FROM events
    WHERE appId = ? AND event = 'file-download'
    GROUP BY eventData
    ORDER BY Count DESC;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error analyzing file downloads:", error);
    throw error;
  }
}
async function analyzeCustomEvents(appId) {
  const sql = `
 SELECT
  event,
  pageUrl,
  eventData,
  COUNT(*) AS Count
FROM events
WHERE appId = ? AND
     JSON_EXTRACT(eventData, '$.custom-event') IS NOT NULL

ORDER BY Count DESC;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    // Additional processing might be required to parse and aggregate eventData.
    return results[0];
  } catch (error) {
    console.error("Error analyzing custom events:", error);
    throw error;
  }
}

async function analyzeVisibilityEvents(appId) {
  const sql = `
    SELECT 
     event,
    pageUrl,
      eventData,
      COUNT(*) AS Count
    FROM events
    WHERE appId = ? AND event = 'visibility' 
    GROUP BY eventData
    ORDER BY Count DESC;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error analyzing clipboard copy events:", error);
    throw error;
  }
}
