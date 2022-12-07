const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

exports.addEntry = async (res, req) => {};
exports.updateEntry = async (res, req) => {};

// Get all flexible expense entries
exports.getAllEntries = (res, req) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];
  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const users = await db("flexible_expenses_entries")
      .where({
        user_id: decoded.id,
      })
      .select("id", "item_name", "amount", "category");

    if (users.length === 0) {
      return res.status(400).json({ message: "No flexible expenses found" });
    }

    return res.status(200).json(users);
  });
};
