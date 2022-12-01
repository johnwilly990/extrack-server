const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const usersController = require("../controllers/usersController");

// router.route("/").get(usersController.getAll);

router.route("/register").post(
  body("username").isEmail().normalizeEmail(),
  body("password").isLength({
    min: 8,
  }),
  body("first_name").isString(),
  body("last_name").isString(),
  usersController.userSignUp
);

module.exports = router;
