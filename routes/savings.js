const express = require("express");
const router = express.Router();
const savingsController = require("../controllers/savingsController");
const authorize = require("../middlewares/auth");

router
  .route("/")
  .post(authorize, savingsController.addEntry)
  .get(authorize, savingsController.getAllEntries);
router
  .route("/:id")
  .delete(authorize, savingsController.deleteEntry)
  .put(authorize, savingsController.updateEntry);

module.exports = router;
