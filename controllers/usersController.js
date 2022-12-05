const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);
const jwt = require("jsonwebtoken");
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
    const token = jwt.sign({ id: user.id }, SECRET_KEY);

    // Sends back success message and JWT token
    return res.status(200).json({
      message: "User logged in successfully",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

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
    const bearerTokenArray = req.headers.authorization.split(" ");

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
      delete user.id;
      delete user.created_at;
      delete user.updated_at;

      return res.json(user);
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
