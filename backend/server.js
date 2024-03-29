const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const pool = require("./db/database");
const collectorRoutes = require("./routes/collectorRoutes");
const overviewAnalyticsRoutes = require("./routes/overviewAnalyticsRoutes");
const segmentRoures = require("./routes/segmentRoures");
const acquiqitionRoutes = require("./routes/acquiqitionRoutes");
const behaivorRoutes = require("./routes/behaivorRoutes");
const commerceRoutes = require("./routes/commerceRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const visitorsRoutes = require("./routes/visitorsRoutes");
const websitesRoutes = require("./routes/websitesRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const { isAuthenticated } = require("./middlewares/isAuthenticated");
const { isUserAuthenticated } = require("./middlewares/isUserAuthenticated");
const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.send("Express server with WebSocket");
});
app.use("/auth", userAuthRoutes);
app.use("", overviewAnalyticsRoutes);
app.use("", acquiqitionRoutes);
app.use("", behaivorRoutes);
app.use("", commerceRoutes);
app.use("", eventsRoutes);
app.use("", subscriptionRoutes);
app.use("", visitorsRoutes);
app.use("", websitesRoutes);
app.use("", segmentRoures);
app.use("/appId", async (req, res) => {
  const appId = req.body.appId;
  if (!appId) {
    return res.status(403).json({ message: "No appId provided" });
  }

  try {
    // Query your database to check if the appId exists
    const query = `SELECT * FROM websites WHERE appId = ?`; // Adjust the table and column names as necessary
    const [rows] = await pool.query(query, [appId]);

    if (rows.length > 0) {
      const data = {
        status: "success",
      };

      // Send back a successful response with the data
      res.status(200).json(data);
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
});
app.use("", isAuthenticated, collectorRoutes);

server.listen(5173, () => {
  console.log("Server started on http://localhost:5173");
});
