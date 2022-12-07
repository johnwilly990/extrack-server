const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

// Add flexible expense entry
exports.addEntry = async (req, res) => {
  try {
    const { item_name, amount, category, user_id } = req.body;
    const { authorization } = req.headers;

    // Validate empty fields and negative or 0 values
    if (item_name === "" || category === "" || user_id === "" || amount <= 0) {
      return res.status(400).json({
        message: "All fields required/Please enter correct numerical amount",
      });
    }

    // Verify valid token
    const token = authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY, async (err, _decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      // New object to be added into db
      const newEntry = {
        id: uuid(),
        user_id: user_id,
        item_name: item_name,
        amount: amount,
        category: category,
      };

      // Inserts new entry to db
      await db("flexible_expenses_entries").insert(newEntry);

      // Sums all recurring expenses of same user ID
      const sumRecurringArr = await db("flexible_expenses_entries")
        .select("user_id")
        .sum("amount")
        .groupBy("user_id");

      // Returns object with matching user Id
      const correspondingId = sumRecurringArr.find(
        (sum) => sum.user_id === newEntry.user_id
      );

      // Retrieves sum value
      const sumOfReccuring = Object.values(correspondingId)[1];

      // Updates Users table with summed value
      await db("users")
        .where({ id: user_id })
        .update({ flexible_expense_amount: sumOfReccuring });

      return res.status(201).json({ message: "New entry successfully added" });
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

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
