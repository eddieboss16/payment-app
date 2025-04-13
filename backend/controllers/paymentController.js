const { sequelize } = require('../config/database');
const Payment = require('../models/payment');
const Transaction = require('../models/transaction');
const User = require('../models/user');

const paymentController = {
  createPayment: async (req, res) => {
    const { workerId, amount } = req.body;
    try {
      const employer = await User.findByPk(req.user.id);
      if (employer.role !== 'employer') return res.status(403).json({ message: 'Only employers can create payments' });
      if (employer.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
      const worker = await User.findByPk(workerId);
      if (!worker || worker.role !== 'worker') return res.status(404).json({ message: 'Worker not found' });

      await sequelize.transaction(async (t) => {
        const payment = await Payment.create({
          employerId: employer.id,
          workerId: worker.id,
          amount,
          status: 'completed',
        }, { transaction: t });

        await Transaction.create({
          userId: employer.id,
          type: 'payment_sent',
          amount: -amount,
          paymentId: payment.id,
        }, { transaction: t });

        await Transaction.create({
          userId: worker.id,
          type: 'payment_received',
          amount,
          paymentId: payment.id,
        }, { transaction: t });

        await User.update(
          { balance: sequelize.literal(`balance - ${amount}`) },
          { where: { id: employer.id }, transaction: t }
        );

        await User.update(
          { balance: sequelize.literal(`balance + ${amount}`) },
          { where: { id: worker.id }, transaction: t }
        );
      });

      res.status(201).json({ message: 'Payment successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Other CRUD operations
};

module.exports = paymentController;