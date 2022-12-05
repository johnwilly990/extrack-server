const { validationResult, body, check } = require("express-validator");

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
