const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const collectorRoutes = require("./routes/collectorRoutes");
const overviewAnalyticsRoutes = require("./routes/overviewAnalyticsRoutes");
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
app.use("", acquiqitionRoutes);
app.use("", behaivorRoutes);
app.use("", commerceRoutes);
app.use("", eventsRoutes);
app.use("", subscriptionRoutes);
app.use("", visitorsRoutes);
app.use("", websitesRoutes);

app.use("/coloctor", isAuthenticated, collectorRoutes);

server.listen(5173, () => {
  console.log("Server started on http://localhost:5173");
});
