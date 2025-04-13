const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Payment = sequelize.define('Payment', {
  employerId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  workerId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'pending' },
}, { timestamps: true });

Payment.belongsTo(User, { as: 'employer', foreignKey: 'employerId' });
Payment.belongsTo(User, { as: 'worker', foreignKey: 'workerId' });
User.hasMany(Payment, { as: 'sentPayments', foreignKey: 'employerId' });
User.hasMany(Payment, { as: 'receivedPayments', foreignKey: 'workerId' });

module.exports = Payment;