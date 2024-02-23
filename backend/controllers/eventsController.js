// Unified Analytics Function
async function analyzeEventByType(appId, eventType) {
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
    default:
      throw new Error(`Unsupported event type: ${eventType}`);
  }
}

async function analyzeClipboardCopyEvents(appId) {
  const sql = `
    SELECT 
      JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.elementId')) AS ElementId,
      COUNT(*) AS CopyCount
    FROM events
    WHERE appId = ? AND event = 'clipboard-copy' AND JSON_EXTRACT(eventData, '$.elementId') IS NOT NULL
    GROUP BY ElementId
    ORDER BY CopyCount DESC;
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
      JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.query')) AS SearchQuery,
      COUNT(*) AS QueryCount
    FROM events
    WHERE appId = ? AND event = 'query-search' AND JSON_EXTRACT(eventData, '$.query') IS NOT NULL
    GROUP BY SearchQuery
    ORDER BY QueryCount DESC;
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
      JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.elementId')) AS ElementId,
      COUNT(*) AS ClickCount
    FROM events
    WHERE appId = ? AND event = 'click' AND JSON_EXTRACT(eventData, '$.elementId') IS NOT NULL
    GROUP BY ElementId
    ORDER BY ClickCount DESC;
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
      JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.formId')) AS FormId,
      COUNT(*) AS SubmissionCount
    FROM events
    WHERE appId = ? AND event = 'form-submit'
    GROUP BY FormId
    ORDER BY SubmissionCount DESC;
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
      JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.videoId')) AS VideoId,
      COUNT(*) AS PlayCount,
      AVG(JSON_EXTRACT(eventData, '$.videoDuration')) AS AvgDuration
    FROM events
    WHERE appId = ? AND event = 'video-play'
    GROUP BY VideoId
    ORDER BY PlayCount DESC;
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
      JSON_UNQUOTE(JSON_EXTRACT(eventData, '$.fileName')) AS FileName,
      COUNT(*) AS DownloadCount
    FROM events
    WHERE appId = ? AND event = 'file-download'
    GROUP BY FileName
    ORDER BY DownloadCount DESC;
  `;

  try {
    const results = await pool.query(sql, [appId]);
    return results[0];
  } catch (error) {
    console.error("Error analyzing file downloads:", error);
    throw error;
  }
}
