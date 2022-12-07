const knex = require("knex");
const knexConfig = require("../knexfile").development;
const db = knex(knexConfig);
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
