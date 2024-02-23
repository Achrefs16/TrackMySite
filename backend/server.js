const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const analyticsRoutes = require("./routes/analyticsRoutes");
const collectorRoutes = require("./routes/collectorRoutes");
const overviewAnalyticsRoutes = require("./routes/overviewAnalyticsRoutes");
const { isAuthenticated } = require("./middlewares/isAuthenticated");
const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.send("Express server with WebSocket");
});
app.use(isAuthenticated);
app.use("", isAuthenticated, collectorRoutes);
app.use("", overviewAnalyticsRoutes);
app.use("/", analyticsRoutes);
server.listen(5173, () => {
  console.log("Server started on http://localhost:5173");
});
