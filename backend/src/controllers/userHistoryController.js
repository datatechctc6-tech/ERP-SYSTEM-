const UserHistoryModel = require('../models/userHistoryModel');
const UserSessionModel = require('../models/userSessionModel');


const getUserHistory = async (req, res) => {
    try {
        const history = await UserHistoryModel.getAllHistory();
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching user history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserSessions = async (req, res) => {
    try {
        const sessions = await UserSessionModel.getAllSessions();
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching user sessions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUserHistory,
    getUserSessions
};

