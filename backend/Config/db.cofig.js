const pgp = require("pg-promise")({
  capSQL: true
});

const connection = {
  host: "localhost",
  port: 5432,
  database: "star_bakery_2",
  user: "postgres",
  password: "Aditya2894",
};

const db = pgp(connection);

module.exports = db;
