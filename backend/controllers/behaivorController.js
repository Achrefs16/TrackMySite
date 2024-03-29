const {
  AvgEventsPage,
  PageEngagement,
  BounceRate,
  EntryPage,
  LastPage,
  UserJourneys,
  AvgSessionDuration,

  PageViews,
} = require("../helpers/behaivor");

exports.getPageViews = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const pageViews = await PageViews(appId);
    res.json({ PageViews: pageViews });
  } catch (error) {
    console.error("Error in getPageViews:", error);
    res.status(500).json({ error: "Error fetching page views data" });
  }
};

// Route handler to get average session duration
exports.getAvgSessionDuration = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const avgSessionDuration = await AvgSessionDuration(appId);
    res.json({ AvgSessionDuration: avgSessionDuration });
  } catch (error) {
    console.error("Error in getAverageSessionDuration:", error);
    res
      .status(500)
      .json({ error: "Error fetching average session duration data" });
  }
};

//////user journyu

// Route handler to get user journeys
exports.getUserJourneys = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const userJourneys = await UserJourneys(appId);
    res.json({ UserJourneys: userJourneys });
  } catch (error) {
    console.error("Error in getUserJourneys:", error);
    res.status(500).json({ error: "Error fetching user journeys data" });
  }
};
////last pageee

// Inside behaviorAnalyticsController.js

exports.getLastPage = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const lastPageSessionCounts = await LastPage(appId);
    res.json({ LastPageSessionCounts: lastPageSessionCounts });
  } catch (error) {
    console.error("Error in getLastPageSessionCounts:", error);
    res
      .status(500)
      .json({ error: "Error fetching last page session counts data" });
  }
};

exports.getEntryPage = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const entryPageSessionCounts = await EntryPage(appId);
    res.json({ EntryPageSessionCounts: entryPageSessionCounts });
  } catch (error) {
    console.error("Error in getEntryPageSessionCounts:", error);
    res
      .status(500)
      .json({ error: "Error fetching entry page session counts data" });
  }
};
/////bounce rate

// Inside behaviorAnalyticsController.js

exports.getBounceRate = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const bounceRate = await BounceRate(appId);
    res.json(bounceRate);
  } catch (error) {
    console.error("Error in getBounceRate:", error);
    res
      .status(500)
      .json({ error: "Error fetching bounce rate by entry page data" });
  }
};

// Inside behaviorAnalyticsController.js

exports.getPageEngagement = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const pageEngagement = await PageEngagement(appId);
    res.json({ PageEngagementMetrics: pageEngagement });
  } catch (error) {
    console.error("Error in getPageEngagement:", error);
    res.status(500).json({
      error: "Error fetching page engagement metrics data with scroll depth",
    });
  }
};

exports.getAvgEventsPage = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const AvgEventPage = await AvgEventsPage(appId);
    res.json(AvgEventPage);
  } catch (error) {
    console.error("Error in getPageEngagement:", error);
    res.status(500).json({
      error: "Error fetching page engagement metrics data with scroll depth",
    });
  }
};
