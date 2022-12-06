const express = require("express");
const router = express.Router();
const recurringController = require("../controllers/recurringController");

router.post("/add", recurringController.addEntry);

module.exports = router;
