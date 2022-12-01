const bcrypt = require("bcrypt");
const seedData = require("../seed_data/usersData.json");

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const usersData = seedData.map((user) => ({
  ...user,
  password: hashPassword("password"),
}));

exports.seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert(usersData);
};
