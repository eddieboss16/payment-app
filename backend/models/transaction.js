const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Payment = require('./payment');

const Transaction = sequelize.define('Transaction', {
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  type: { type: DataTypes.ENUM('deposit', 'withdrawal', 'payment_sent', 'payment_received'), allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentId: { type: DataTypes.INTEGER, references: { model: Payment, key: 'id' }, allowNull: true },
  status: { type: DataTypes.ENUM('completed', 'failed'), defaultValue: 'completed' },
}, { timestamps: true });

Transaction.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(Payment, { foreignKey: 'paymentId' });
Payment.hasMany(Transaction, { foreignKey: 'paymentId' });

module.exports = Transaction;