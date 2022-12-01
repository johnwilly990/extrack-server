const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);
const { v4: uuid } = require("uuid");

exports.getAll = (_req, res) => {
  db("users")
    .select(
      "id",
      "username",
      "first_name",
      "last_name",
      "income_amount",
      "budget_amount",
      "recurring_amount",
      "saving_amount",
      "investment_amount",
      "flexible_expense_amount"
    )
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json({ message: err }));
};
