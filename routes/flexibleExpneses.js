const express = require("express");
const router = express.Router();
const flexibleController = require("../controllers/flexibleController");

router
  .route("/")
  .post(flexibleController.addEntry)
  .put(flexibleController.updateEntry)
  .get(flexibleController.getAllEntries);

module.exports = router;
