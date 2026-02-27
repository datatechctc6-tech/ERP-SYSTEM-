const transactionService = require('../services/transaction.service');

exports.getDashboardStats = async (req, res) => {
    try {
        const data = await transactionService.getDashboardStats();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const data = await transactionService.getAllTransactions();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await transactionService.getTransactionById(id);

        if (!data) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error fetching transaction ${req.params.id}:`, error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const data = await transactionService.createTransaction(req.body);
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const success = await transactionService.updateTransaction(id, req.body);

        if (!success) {
            return res.status(404).json({ error: 'Transaction not found or no changes made' });
        }

        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error) {
        console.error(`Error updating transaction ${req.params.id}:`, error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await transactionService.deleteTransaction(id);

        if (!success) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error(`Error deleting transaction ${req.params.id}:`, error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};
