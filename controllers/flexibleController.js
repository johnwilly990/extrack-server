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
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      // New object to be added into db
      const newEntry = {
        id: uuid(),
        user_id: decoded.id,
        item_name: item_name,
        amount: amount,
        category: category,
      };

      // Inserts new entry to db
      await db("flexible_entries").insert(newEntry);

      // Sums all recurring expenses of same user ID
      const sumRecurringArr = await db("flexible_entries")
        .where("user_id", decoded.id)
        .sum("amount");

      // Retrieves sum value
      const sumOfReccuring = Object.values(sumRecurringArr[0])[0];

      // Updates Users table with summed value
      await db("users")
        .where({ id: decoded.id })
        .update({ flexible_expense_amount: sumOfReccuring });

      return res.status(201).json({ message: "New entry successfully added" });
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// Update flexible expense entry
exports.updateEntry = async (req, res) => {
  try {
    const { item_name, amount, user_id, category } = req.body;
    const { id } = req.params;
    const { authorization } = req.headers;

    // Validate empty fields and negative or 0 values
    if (item_name === "" || category === "" || user_id === "" || amount <= 0) {
      return res.status(400).json({
        message: "All fields required/Please enter correct numerical amount",
      });
    }

    // Verify valid token
    const token = authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      // New object to be added into db
      const entry = {
        user_id: decoded.id,
        item_name: item_name,
        amount: amount,
        category: category,
      };

      // Inserts new entry to db
      await db("flexible_entries").where({ id: id }).update(entry);

      // Sums all recurring expenses of same user ID
      const sumRecurringArr = await db("flexible_entries")
        .where("user_id", decoded.id)
        .sum("amount");

      // Retrieves sum value
      const sumOfReccuring = Object.values(sumRecurringArr[0])[0];

      // Updates Users table with summed value
      await db("users")
        .where({ id: decoded.id })
        .update({ flexible_expense_amount: sumOfReccuring });

      // Sums budget
      const budgetArr = await db("users")
        .where({ id: decoded.id })
        .select(
          "income_amount",
          "recurring_amount",
          "saving_amount",
          "flexible_expense_amount",
          "investment_amount"
        );

      // Selects first index
      const budget = budgetArr[0];

      // Calculates budget
      const sum =
        budget.income_amount -
        budget.recurring_amount -
        budget.saving_amount -
        budget.investment_amount -
        budget.flexible_expense_amount;

      // Updates budget_amount in table
      await db("users")
        .where({ id: decoded.id })
        .update({ budget_amount: sum });

      return res.status(200).json({ message: "Entry successfully updated" });
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// Get all flexible expense entries
exports.getAllEntries = (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];
  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const users = await db("flexible_entries")
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
