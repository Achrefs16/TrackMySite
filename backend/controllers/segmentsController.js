const {
  PurchasersByCityInCountry,
  PurchasersByLocation,
  CityByContentTypeEngagement,
  CountryBySubscriptionPlan,
  CityBySubscriptionPlan,
} = require("../helpers/segment");

exports.getPurchasersByCity = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const PurchasersByCity = await PurchasersByCityInCountry(appId);
    res.json(PurchasersByCity);
  } catch (error) {
    console.error("Error in getPurchasersByCity:", error);
    res.status(500).json({ error: "Error fetching getPurchasersByCity data" });
  }
};

exports.getPurchasersByLocation = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const PurchasersLocation = await PurchasersByLocation(appId);
    res.json(PurchasersLocation);
  } catch (error) {
    console.error("Error in getPurchasersByLocation:", error);
    res.status(500).json({ error: "Error fetching PurchasersByLocation data" });
  }
};

exports.getCityByContentTypeEngagement = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const data = await CityByContentTypeEngagement(appId);
    res.json(data);
  } catch (error) {
    console.error("Error in CityByContentTypeEngagement:", error);
    res
      .status(500)
      .json({ error: "Error fetching CityByContentTypeEngagement data" });
  }
};

exports.getCountryBySubscriptionPlan = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const data = await CountryBySubscriptionPlan(appId);
    res.json(data);
  } catch (error) {
    console.error("Error in CountryBySubscriptionPlan:", error);
    res
      .status(500)
      .json({ error: "Error fetching CountryBySubscriptionPlan data" });
  }
};
exports.getCityBySubscriptionPlan = async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }

  try {
    const data = await CityBySubscriptionPlan(appId);
    res.json(data);
  } catch (error) {
    console.error("Error in CityBySubscriptionPlan:", error);
    res
      .status(500)
      .json({ error: "Error fetching CityBySubscriptionPlan data" });
  }
};
