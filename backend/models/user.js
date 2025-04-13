const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  role: { type: DataTypes.ENUM('employer', 'worker'), allowNull: false },
  balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
}, { timestamps: true });

module.exports = User;