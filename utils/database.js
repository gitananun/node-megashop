const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-tutorial", "root", "rootroot", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
