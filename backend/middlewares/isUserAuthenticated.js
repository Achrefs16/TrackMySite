const jwt = require("jsonwebtoken");

const isUserAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Assuming Bearer token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Add the user payload to the request object
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};
module.exports = {
  isUserAuthenticated,
};
