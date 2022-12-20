exports.up = function (knex) {
  return knex.schema
    .createTable("flexible_entries", (table) => {
      table.uuid("id").primary();
      table
        .uuid("user_id")
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("item_name").notNullable();
      table.integer("amount").notNullable();
      table.string("category").notNullable();
      table.timestamps(true, true);
    })
    .createTable("recurring_entries", (table) => {
      table.uuid("id").primary();
      table
        .uuid("user_id")
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("item_name").notNullable();
      table.integer("amount").notNullable();
      table.string("category").notNullable();
      table.timestamps(true, true);
    })
    .createTable("investments_entries", (table) => {
      table.uuid("id").primary();
      table
        .uuid("user_id")
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("item_name").notNullable();
      table.integer("amount").notNullable();
      table.string("category").notNullable();
      table.timestamps(true, true);
    })
    .createTable("savings_entries", (table) => {
      table.uuid("id").primary();
      table
        .uuid("user_id")
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("item_name").notNullable();
      table.integer("amount").notNullable();
      table.string("category").notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("flexible_entries")
    .dropTable("recurring_entries")
    .dropTable("investments_entries")
    .dropTable("savings_entries");
};
