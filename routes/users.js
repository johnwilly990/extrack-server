const express = require("express");
const router = express.Router();
const credentialsController = require("../controllers/credentialsController");
const usersController = require("../controllers/usersController");
const signUpValidation = require("../middlewares/userValidation");
const loginValidation = require("../middlewares/userValidation");

// Credential endpoints
router.post("/register", signUpValidation, credentialsController.userSignUp);
router.post("/login", loginValidation, credentialsController.userLogin);

// User endpoints
router
  .route("/profile")
  .get(usersController.getUserProfile)
  .put(usersController.updateUserFunds);

module.exports = router;
