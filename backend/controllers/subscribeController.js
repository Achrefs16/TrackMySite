const {
  fetchSubscriptionData,
  fetchUnsubscribeData,
  fetchTotalConversion,
} = require("../helpers/subscribe");

exports.getSubscriptionData = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const subscriptionData = await fetchSubscriptionData(appId);
    res.json({ SubscriptionData: subscriptionData });
  } catch (error) {
    console.error("Error in getSubscriptionData:", error);
    res.status(500).json({ error: "Error fetching subscription data" });
  }
};
exports.getUnsubscribeData = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const unsubscribeData = await fetchUnsubscribeData(appId);
    res.json({ UnsubscribeData: unsubscribeData });
  } catch (error) {
    console.error("Error in getUnsubscribeData:", error);
    res.status(500).json({ error: "Error fetching unsubscribe data" });
  }
};

exports.getfetchTotalConversion = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const Conversion = await fetchTotalConversion(appId);
    res.json({ Conversion });
  } catch (error) {
    console.error("Error in fetchTotalConversion:", error);
    res.status(500).json({ error: "Error fetching fetchTotalConversion data" });
  }
};
