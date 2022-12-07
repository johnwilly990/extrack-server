const express = require("express");
const router = express.Router();
const recurringController = require("../controllers/recurringController");

router.post("/add", recurringController.addEntry);
router.put("/update", recurringController.updateEntry);

module.exports = router;
