const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const knex = require("knex");
const jwt = require("jsonwebtoken");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);
const { SECRET_KEY } = process.env;

// Encrypts password 10 times
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Controller for registering new user
exports.userSignUp = async (req, res) => {
  try {
    const { username, password, first_name, last_name } = req.body;

    // Validation for empty input fields
    if (
      username === "" ||
      password === "" ||
      first_name === "" ||
      last_name === ""
    ) {
      return res.status(400).json({
        message: "All fields are required",
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

    // Retrieves username from db that matches username inputted by user
    const usernameValidation = await db("users").where({
      username: newUser.username,
    });

    // Validation to insert new user into db; if username already exists, do not insert to db
    if (usernameValidation.length === 0) {
      await db("users").insert(newUser);

      // Returns success
      return res.status(200).json({
        success: true,
        message: "Sign up successful",
      });
    } else {
      // Returns error as username already exists
      return res.status(400).json({
        message: "Username already exists",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// Controller for logging in
exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation for empty input fields
    if (username === "" || password === "") {
      return res.status(400).json({
        message: "Please enter username and/or password",
      });
    }

    // Validating username
    const users = await db("users").where({ username: username });
    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    // Validating password
    const user = users[0];
    // Compares user inputted password to password stored in db
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    // Creating JWT token
    const token = jwt.sign({ username: user.id }, SECRET_KEY);

    // Sends back success message and JWT token
    return res.status(200).json({
      message: "User logged in successfully",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
