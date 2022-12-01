exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.string("username").notNullable();
    table.string("password").notNullable();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.integer("income_amount").notNullable();
    table.integer("budget_amount").notNullable();
    table.integer("recurring_amount").notNullable();
    table.integer("saving_amount").notNullable();
    table.integer("investment_amount").notNullable();
    table.integer("flexible_expense_amount").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
