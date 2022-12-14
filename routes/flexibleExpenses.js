const express = require("express");
const router = express.Router();
const flexibleController = require("../controllers/flexibleController");

router
  .route("/")
  .post(flexibleController.addEntry)
  .get(flexibleController.getAllEntries);

router.put("/:id", flexibleController.updateEntry);

module.exports = router;
