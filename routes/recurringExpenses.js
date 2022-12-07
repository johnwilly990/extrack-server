const express = require("express");
const router = express.Router();
const recurringController = require("../controllers/recurringController");

router
  .route("/")
  .post(recurringController.addEntry)
  .put(recurringController.updateEntry)
  .get(recurringController.getAllEntries);
router.delete("/:id", recurringController.deleteEntry);

module.exports = router;
