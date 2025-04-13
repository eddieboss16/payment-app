const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Worker = sequelize.define('Worker', {
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' }, unique: true },
  bio: { type: DataTypes.TEXT },
  hourlyRate: { type: DataTypes.DECIMAL(10, 2) },
  skills: { type: DataTypes.STRING },
}, { timestamps: true });

Worker.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Worker, { foreignKey: 'userId' });

module.exports = Worker;