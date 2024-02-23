const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5001;

app.use(bodyParser.json());
// CORS configuration
const corsOptions = {
  origin: "*",
};

// Use CORS middleware
app.use(cors(corsOptions));

// Sample route
app.get("/", (req, res) => {
  res.send("Hello, this is your Express server!");
});

app.post("/user-data", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("User Data :", Data);
  res.json("ok");
});
app.post("/page-view", (req, res) => {
  const Data = req.body;

  console.log("Page view:", Data);
  res.json("ok");
});
app.post("/page-info", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("page info:", Data);
  res.json("ok");
});
app.post("/form-info", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("form info", Data);
  res.json("ok");
});
app.post("/download", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("download", Data);
  res.json("ok");
});
app.post("/video-play", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("video-play", Data);
  res.json("ok");
});
app.post("/visibility", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("visibility:", Data);
  res.json("ok");
});
app.post("/clipboard-copy", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("clipboard:", Data);
  res.json("ok");
});
app.post("/click-event", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("click-event:", Data);
  res.json("ok");
});
app.post("/custom-event", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("Data:", Data);
  res.json("ok");
});

app.post("/query-search", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("query", Data);
  res.json("ok");
});
app.post("/view-product", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("add-cart", Data);
  res.json("ok");
});
app.post("/purchase-info", (req, res) => {
  const Data = req.body;
  // Handle the page view data as needed
  console.log("query", Data);
  res.json("ok");
});
// Start the server()
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
