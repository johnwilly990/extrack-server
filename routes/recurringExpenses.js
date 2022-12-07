const express = require("express");
const router = express.Router();
const recurringController = require("../controllers/recurringController");

router.post("/add", recurringController.addEntry);
router.put("/update", recurringController.updateEntry);
router.delete("/delete/:id", recurringController.deleteEntry);

module.exports = router;
