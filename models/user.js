const { Sequelize } = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define("user", {
  name: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  email: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = User;
