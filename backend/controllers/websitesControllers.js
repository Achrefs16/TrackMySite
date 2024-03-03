const pool = require("../db/database");
const { v4: uuidv4 } = require("uuid");

function generateWebsiteId() {
  return uuidv4().replace(/-/g, "").slice(0, 11);
}

const addwebsite = async (req, res) => {
  const { name, url, category } = req.body;

  // Check for required fields
  if (!name || !url || !category) {
    return res
      .status(400)
      .json({ error: "All fields (name, url, category) are required" });
  }

  try {
    // Verify if the URL already exists
    const existingSite = await pool.query(
      "SELECT * FROM websites WHERE url = ?",
      [url]
    );

    // If a website with the URL already exists, return an error
    if (existingSite[0].length > 0) {
      return res
        .status(409)
        .json({ error: "A website with the given URL already exists." });
    }

    const Id = generateWebsiteId(); // Generate a unique website ID
    const userId = req.user.id; // Assume userID is available from the request object

    // Insert the new website into the database
    const result = await pool.query(
      "INSERT INTO websites (appId, name, url, category, ownerId) VALUES (?, ?, ?, ?, ?)",
      [Id, name, url, category, userId]
    );

    // Respond with the inserted website details or a success message
    res.json({
      success: true,
      message: "Website added successfully",
      appId: Id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the website" });
  }
};

const getWebsites = async (req, res) => {
  const userId = req.user.id; // Assume userID is available from the request object

  try {
    // Query the database for all websites belonging to the user
    const result = await pool.query(
      "SELECT * FROM websites WHERE ownerId = ?",
      [userId]
    );

    // If websites are found, return them
    if (result[0].length > 0) {
      return res.json({
        success: true,
        websites: result[0],
      });
    } else {
      // If no websites are found, return a message indicating so
      return res.status(404).json({ error: "No websites found for the user." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the websites" });
  }
};

module.exports = {
  addwebsite,
  getWebsites,
};
