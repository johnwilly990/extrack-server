const { validationResult, body } = require("express-validator");

// Middleware for registration to check if all required fields are the correct format
module.exports = registerValidation = async (req, res, next) => {
  body("username").isEmail().normalizeEmail();
  body("password").isLength({
    min: 8,
  });
  body("first_name").isString();
  body("last_name").isString();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

// Middleware for login to check if all required fields are the correct format
module.exports = loginValidation = async (req, res, next) => {
  body("username").isEmail().normalizeEmail();
  body("password").isLength({
    min: 8,
  });

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};
