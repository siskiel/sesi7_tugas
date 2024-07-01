const { Pool } = require("pg");
// Koneksi Ke Postgre
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "12345",
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
