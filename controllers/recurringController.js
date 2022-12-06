const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);

exports.addEntry = async (req, res) => {};
