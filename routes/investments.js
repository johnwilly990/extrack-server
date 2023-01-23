const express = require("express");
const router = express.Router();
const investmentsController = require("../controllers/investmentsController");
const authorize = require("../middlewares/auth");

router
  .route("/")
  .post(authorize, investmentsController.addEntry)
  .get(authorize, investmentsController.getAllEntries);
router
  .route("/:id")
  .delete(authorize, investmentsController.deleteEntry)
  .put(authorize, investmentsController.updateEntry);

module.exports = router;
