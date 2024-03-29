const pool = require("../db/database");
const { hashPassword, comparePassword } = require("../helpers/hashing");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!email || !name || !password) {
      return res.json({
        error: "Tous les champs (email, nom, mot de passe) sont requis",
      });
    }
    if (password.length < 6) {
      return res.json({
        error: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Check if the email already exists
    const [users] = await pool.query("SELECT * FROM owners WHERE email = ?", [
      email,
    ]);
    console.log(users[0]);
    if (users.length > 0) {
      return res.json({
        error: "L'email est déjà pris",
      });
    }

    // Check password length

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user into the database
    const result = await pool.query(
      "INSERT INTO owners (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    if (result[0].affectedRows > 0) {
      // Assuming your table has an 'id' column that auto increments and is the primary key
      const [newUser] = await pool.query("SELECT * FROM owners WHERE id = ?", [
        result[0].insertId,
      ]);
      const token = jwt.sign(
        {
          id: newUser[0].id,
          name: newUser[0].name,
          email: newUser[0].email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" } // Optional: Set an expiration
      );
      res.status(201).json({ token: token, success: "inscription réussi" });
    } else {
      throw new Error("User registration failed");
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        error: "Username and password are required",
      });
    }

    if (password.length < 6) {
      return res.json({
        error: "Password should be at least 6 characters long",
      });
    }

    // Assuming pool is your mysql2/promise connection pool
    const [users] = await pool.query("SELECT * FROM owners WHERE email = ?", [
      email,
    ]);

    if (users.length > 0) {
      const user = users[0]; // Correctly reference the user
      const match = await comparePassword(password, user.password);

      if (match) {
        const token = jwt.sign(
          { id: user.id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "24h" } // Optional: Set an expiration
        );
        return res.status(201).json({ token: token, success: "success" });
      } else {
        return res.json({
          error: "Le mot de passe est incorrect",
        });
      }
    } else {
      return res.json({
        error: "L'e-mail est incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred during the login process",
    });
  }
};
const getProfile = async (req, res) => {
  console.log(req.user);
  try {
    const userId = req.user.id;

    const [users] = await pool.query(
      "SELECT name, email FROM owners WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id; // Again, assuming this is set by your authentication middleware

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Optional: Validate and hash the new password if it's being updated
    let hashedPassword;
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }
      hashedPassword = await hashPassword(password);
    }

    // Update user profile in the database
    await pool.query(
      "UPDATE owners SET name = ?, email = ?" +
        (hashedPassword ? ", password = ?" : "") +
        " WHERE id = ?",
      hashedPassword
        ? [name, email, hashedPassword, userId]
        : [name, email, userId]
    );

    res.json({ success: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
};
