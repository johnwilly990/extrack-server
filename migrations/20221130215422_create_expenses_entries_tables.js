exports.up = function (knex) {
  return knex.schema
    .createTable("flexible_expenses_entries", (table) => {
      table.uuid("id").primary();
      table
        .uuid("user_id")
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("item_name").notNullable();
      table.double("amount").notNullable();
      table.string("category").notNullable();
      table.timestamps(true, true);
    })
    .createTable("recurring_expenses_entries", (table) => {
      table.uuid("id").primary();
      table
        .uuid("user_id")
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("item_name").notNullable();
      table.double("amount").notNullable();
      table.string("category").notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("flexible_expenses_entries")
    .dropTable("flexible_expenses_entries");
};
