const UserHistoryModel = require('../models/userHistoryModel');
const UserSessionModel = require('../models/userSessionModel');
const UserModel = require('../models/userModel');


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

const getAttendance = async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        const sessions = await UserSessionModel.getAllSessions();

        const today = new Date().toDateString();

        const attendance = users.map(user => {
            const userSessionsToday = sessions.filter(s =>
                s.user_id === user.id &&
                new Date(s.login_time).toDateString() === today
            ).sort((a, b) => new Date(a.login_time) - new Date(b.login_time));

            return {
                user_id: user.id,
                user_name: user.username || user.name,
                status: userSessionsToday.length > 0 ? 'Present' : 'Absent',
                first_login: userSessionsToday.length > 0 ? userSessionsToday[0].login_time : null,
                date: today
            };
        });

        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUserHistory,
    getUserSessions,
    getAttendance
};

