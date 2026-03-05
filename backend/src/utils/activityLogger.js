const UserHistoryModel = require('../models/userHistoryModel');

/**
 * Utility to log user activity
 * @param {Object} req - Express request object (expects req.user to be populated by authMiddleware)
 * @param {string} action - The action performed (e.g., 'CREATE_PARTY', 'DELETE_DEPT')
 * @param {string} details - Human-readable details of the action
 */
const logActivity = async (req, action, details) => {
    try {
        if (!req.user) {
            console.warn(`Attempted to log action ${action} without user context`);
            return;
        }

        await UserHistoryModel.logAction(
            req.user.id,
            req.user.name || 'Unknown User', // Fallback if name not in token
            action,
            details,
            req.ip
        );
    } catch (error) {
        console.error('Logging Utility Error:', error);
    }
};

module.exports = logActivity;
