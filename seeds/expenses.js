const flexibleExpensesData = require("../seed_data/flexibleExpenses.json");
const recurringExpensesData = require("../seed_data/recurringExpenses.json");

exports.seed = async function (knex) {
  await knex("flexible_expenses_entries").del();
  await knex("flexible_expenses_entries").insert(flexibleExpensesData);
  await knex("recurring_expenses_entries").del();
  await knex("recurring_expenses_entries").insert(recurringExpensesData);
};
