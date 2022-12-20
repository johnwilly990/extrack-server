const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

module.exports = (req, res, next) => {
  // Get instance of bearer token
  const bearerToken = req.headers.authorization;

  // If token does not exist
  if (!bearerToken)
    return res
      .status(401)
      .json({ error: "Bearer token is required in authorization header" });

  // Converts header into array ["Bearer", "Token"]
  const splitToken = bearerToken.split(" ");

  // If array doesn't have 2 elements
  if (splitToken.length !== 2)
    return res.status(400).json({ error: "Invalid bearer token" });

  // Get just token ["Token"]
  const token = splitToken[1];

  // Verifies token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    // If no token
    if (err) return res.status(403).json({ error: "Invalid JWT token" });

    // Assigns userId to user_id coming from JWT token
    req.userId = decoded.user_id;
    console.log(decoded.user_id);

    // Once verified, moves on
    next();
  });
};
