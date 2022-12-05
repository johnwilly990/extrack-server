const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const signUpValidation = require("../middlewares/userValidation");
const loginValidation = require("../middlewares/userValidation");

router.post("/register", signUpValidation, usersController.userSignUp);

router.post("/login", loginValidation, usersController.userLogin);

module.exports = router;
