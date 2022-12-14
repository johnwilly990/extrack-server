const express = require("express");
const router = express.Router();
const recurringController = require("../controllers/recurringController");

router
  .route("/")
  .post(recurringController.addEntry)
  .get(recurringController.getAllEntries);
router
  .route("/:id")
  .delete(recurringController.deleteEntry)
  .put(recurringController.updateEntry);

module.exports = router;
