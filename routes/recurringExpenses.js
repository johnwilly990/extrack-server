const express = require("express");
const router = express.Router();
const recurringController = require("../controllers/recurringController");
const authorize = require("../middlewares/auth");

router
  .route("/")
  .post(authorize, recurringController.addEntry)
  .get(authorize, recurringController.getAllEntries);
router
  .route("/:id")
  .delete(authorize, recurringController.deleteEntry)
  .put(authorize, recurringController.updateEntry);

module.exports = router;
