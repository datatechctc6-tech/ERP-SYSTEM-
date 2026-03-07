const UserHistoryModel = require('../models/userHistoryModel');
const UserSessionModel = require('../models/userSessionModel');
const UserAttendanceModel = require('../models/userAttendanceModel');
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
        const allAttendanceRecords = await UserAttendanceModel.getAllAttendance();

        const todayStr = new Date().toDateString();
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        // Calculate total days elapsed in the current month up to today
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endDay = new Date(); // Today
        let totalElapsedDays = 0;
        let d = new Date(startOfMonth);
        while (d <= endDay) {
            totalElapsedDays++;
            d.setDate(d.getDate() + 1);
        }

        // Calculate total days elapsed in the current year up to today
        const startOfYear = new Date(currentYear, 0, 1);
        let totalElapsedDaysYear = 0;
        let dYear = new Date(startOfYear);
        while (dYear <= endDay) {
            totalElapsedDaysYear++;
            dYear.setDate(dYear.getDate() + 1);
        }

        const attendance = users.map(user => {
            // Sessions for the current user in the current month
            const userSessionsThisMonth = sessions.filter(s => {
                const sDate = new Date(s.login_time);
                return s.user_id === user.id && sDate.getFullYear() === currentYear && sDate.getMonth() === currentMonth;
            });

            // Calculate unique days worked this month
            const uniqueDaysWorked = new Set(
                userSessionsThisMonth.map(s => new Date(s.login_time).toDateString())
            ).size;

            const leaveThisMonth = totalElapsedDays - uniqueDaysWorked;

            // Sessions for the current user in the current year
            const userSessionsThisYear = sessions.filter(s => {
                const sDate = new Date(s.login_time);
                return s.user_id === user.id && sDate.getFullYear() === currentYear;
            });

            // Calculate unique days worked this year
            const uniqueDaysWorkedYear = new Set(
                userSessionsThisYear.map(s => new Date(s.login_time).toDateString())
            ).size;

            const leaveThisYear = totalElapsedDaysYear - uniqueDaysWorkedYear;

            // Get Today's attendance record from DB
            const userAttendanceToday = allAttendanceRecords.find(a => 
                a.user_id === user.id && new Date(a.date).toDateString() === todayStr
            );

            return {
                user_id: user.id,
                user_name: user.username || user.name,
                status: userAttendanceToday ? userAttendanceToday.status : 'Absent',
                first_login: userAttendanceToday ? userAttendanceToday.first_login : null,
                last_logout: userAttendanceToday ? userAttendanceToday.last_logout : null,
                total_work_ms: userAttendanceToday ? (userAttendanceToday.total_work_ms * 1000) : 0, // DB stores in seconds/milliseconds equivalent, adjust to ms if needed. (Our update query did MICROSECONDS/1000 which is milliseconds)
                worked_days_month: uniqueDaysWorked,
                leave_month: leaveThisMonth > 0 ? leaveThisMonth : 0,
                worked_days_year: uniqueDaysWorkedYear,
                leave_year: leaveThisYear > 0 ? leaveThisYear : 0,
                date: todayStr
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

