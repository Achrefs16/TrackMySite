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

const getWebsite = async (req, res) => {
  const userId = req.user.id; // Assume userID is available from the request object
  const appId = req.params.id; // Assuming appId is passed as a URL parameter

  try {
    // Query the database for the website belonging to the user with the specified appId
    const result = await pool.query(
      "SELECT * FROM websites WHERE ownerId = ? AND appId = ?",
      [userId, appId]
    );

    // If the website is found, return it
    if (result.length > 0) {
      // Adjusted for a common query result structure
      return res.json({
        success: true,
        website: result[0], // Assuming the first result is what you're interested in
      });
    } else {
      // If no website is found, return a message indicating so
      return res
        .status(404)
        .json({ error: "No website found for the specified user and appId." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the website." });
  }
};
const updateWebsite = async (req, res) => {
  const userId = req.user.id; // Assume userID is available from the request object's user property
  const appId = req.params.id;
  const { name, url, category } = req.body; // Extract updated website details from request body

  // Ensure all required fields are provided
  if (!name || !url || !category) {
    return res.status(400).json({
      error: "Please provide name, url, and category for the website.",
    });
  }

  try {
    // Query to update the website details for the given appId and userId
    const result = await pool.query(
      "UPDATE websites SET name = ?, url = ?, category = ? WHERE  appId = ?",
      [name, url, category, appId]
    );

    // Check if the update was successful
    if (result[0].affectedRows > 0) {
      return res.json({
        success: true,
        message: "Website updated successfully.",
      });
    } else {
      // No rows were affected, indicating the website was not found or belongs to another user
      return res
        .status(404)
        .json({ error: "Website not found or belongs to another user." });
    }
  } catch (error) {
    console.error("Error updating website:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the website." });
  }
};

const deleteWebsite = async (req, res) => {
  const userId = req.user.id;
  const appId = req.params.id;

  // Get a connection from the pool
  const connection = await pool.getConnection();

  try {
    // Start a transaction
    await connection.beginTransaction();

    // Perform deletion operations
    await connection.query("DELETE FROM events WHERE appId = ?", [appId]);
    await connection.query("DELETE FROM sessions WHERE appId = ?", [appId]);
    // Add more deletion queries as needed

    // Finally, delete the website itself
    const [result] = await connection.query(
      "DELETE FROM websites WHERE ownerId = ? AND appId = ?",
      [userId, appId]
    );

    // If the delete operation was successful, commit the transaction
    if (result.affectedRows > 0) {
      await connection.commit();
      res.json({
        success: true,
        message: "Website and all related data deleted successfully.",
      });
    } else {
      // No rows affected, rollback and respond with error
      await connection.rollback();
      res
        .status(404)
        .json({ error: "Website not found or does not belong to the user." });
    }
  } catch (error) {
    // Error occurred, rollback the transaction
    await connection.rollback();
    console.error("Error deleting website and related data:", error);
    res.status(500).json({
      error: "An error occurred while deleting the website and related data.",
    });
  } finally {
    // Release the connection back to the pool
    if (connection) connection.release();
  }
};
module.exports = {
  addwebsite,
  getWebsites,
  getWebsite,
  updateWebsite,
  deleteWebsite,
};
