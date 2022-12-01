const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

exports.getAll = async (_req, res) => {
  try {
    const response = await db("users").select(
      "id",
      "username",
      "first_name",
      "last_name",
      "income_amount",
      "budget_amount",
      "recurring_amount",
      "saving_amount",
      "investment_amount",
      "flexible_expense_amount"
    );

    if (!response.length) {
      return res.status(404).json({ message: "no reponse found" });
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Controller for registering new user
exports.userSignUp = async (req, res) => {
  try {
    const { username, password, first_name, last_name } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // New users object
    const newUser = {
      id: uuid(),
      username: username,
      password: hashPassword(password),
      first_name: first_name,
      last_name: last_name,
      income_amount: 0,
      budget_amount: 0,
      recurring_amount: 0,
      saving_amount: 0,
      investment_amount: 0,
      flexible_expense_amount: 0,
    };

    // Retrieves username of db that matches username inputted by user
    const usernameValidation = await db("users").where({
      username: newUser.username,
    });

    // Validation to insert new user into db; if username already exits, do not insert to db
    if (usernameValidation.length === 0) await db("users").insert(newUser);

    // Repsonse sent back upon success
    res.status(200).json({
      success: true,
      message: "Sign up successful",
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//c0595d8bdd466bd6e6bf226169d51ea582e51954a26ec1b517465362e6b4f9cf
