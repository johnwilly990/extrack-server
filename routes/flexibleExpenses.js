const express = require("express");
const router = express.Router();
const flexibleController = require("../controllers/flexibleController");
const authorize = require("../middlewares/auth");

router
  .route("/")
  .post(authorize, flexibleController.addEntry)
  .get(authorize, flexibleController.getAllEntries);

router
  .route("/:id")
  .put(authorize, flexibleController.updateEntry)
  .delete(authorize, flexibleController.deleteEntry);

module.exports = router;
