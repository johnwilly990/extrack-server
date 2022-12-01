require("dotenv").config();
const { DB_LOCAL_NAME, DB_LOCAL_USER, DB_LOCAL_PASS, DB_LOCAL_HOST } =
  process.env;

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: DB_LOCAL_HOST,
      user: DB_LOCAL_USER,
      password: DB_LOCAL_PASS,
      database: DB_LOCAL_NAME,
      charset: "utf8",
      dateStrings: true,
    },
  },

  production: {},
};
