const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

// Controller for user profile
exports.getUserProfile = async (req, res) => {
  try {
    const { authorization } = req.headers;

    // Validation to see if token exists
    if (!authorization) {
      return res.status(400).json({
        message: "Bearer token required",
      });
    }

    // Splits header into an array ["bearer", "token"]
    const bearerTokenArray = authorization.split(" ");

    // If header isn't valid, return error
    if (bearerTokenArray.length !== 2) {
      return res.status(400).json({
        message: "Bearer token required",
      });
    }

    // Get token value
    const token = bearerTokenArray[1];

    // Verify valid token
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      // Validates if token is valid or not
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      // Get array profile by ID
      const users = await db("users").where({ id: decoded.id });

      // Validation for empty array
      if (users.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Sets user to first index of array
      const user = users[0];

      // Deletes properties from object we don't want to show on user profile
      delete user.password;
      delete user.created_at;
      delete user.updated_at;

      return res.json(user);
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// Controller for updating user funds
exports.updateUserFunds = async (req, res) => {
  try {
    const { income_amount, saving_amount, investment_amount } = req.body;
    const { authorization } = req.headers;

    // Validation to check for empty fields and data types
    if (
      Object.keys(req.body).length < 3 ||
      typeof income_amount === "string" ||
      typeof saving_amount === "string" ||
      typeof investment_amount === "string" ||
      income_amount < 0 ||
      saving_amount < 0 ||
      investment_amount < 0
    ) {
      return res
        .status(400)
        .send("Please input a valid numerical value for all fields");
    }

    // Verify token
    const token = authorization.split(" ")[1];
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      // Request body object
      const updatedValues = {
        income_amount: income_amount,
        saving_amount: saving_amount,
        investment_amount: investment_amount,
      };

      // Puts body into db
      await db("users").where({ id: decoded.id }).update(updatedValues);

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

      // Returns successful response
      return res.status(200).json({
        message: "User funds successfully updated",
      });
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
