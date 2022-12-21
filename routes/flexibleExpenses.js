const express = require("express");
const router = express.Router();
const flexibleController = require("../controllers/flexibleController");
const authorize = require("../middlewares/auth");

router
  .route("/")
  .post(authorize, flexibleController.addEntry)
  .get(authorize, flexibleController.getAllEntries);

router.put("/:id", authorize, flexibleController.updateEntry);

module.exports = router;
