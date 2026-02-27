const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// Read
router.get('/dashboard-stats', transactionController.getDashboardStats);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);

// Create
router.post('/', transactionController.createTransaction);

// Update
router.put('/:id', transactionController.updateTransaction);

// Delete
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
