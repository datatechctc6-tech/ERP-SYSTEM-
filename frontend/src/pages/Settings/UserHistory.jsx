import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, History, User, XCircle, Calendar, Shield, Activity, MapPin, Clock, LogIn, LogOut } from 'lucide-react';
import './UserHistory.css';

const UserHistory = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('activity'); // 'activity' or 'hours'
    const [searchTerm, setSearchTerm] = useState('');
    const [history, setHistory] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tick, setTick] = useState(0); // For live timer re-renders
    const searchInputRef = useRef(null);


    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/user-history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Error fetching user history:', error);
        }
    };

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/user-sessions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSessions(data);
            }
        } catch (error) {
            console.error('Error fetching user sessions:', error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchHistory(), fetchSessions()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        const tickInterval = setInterval(() => setTick(t => t + 1), 1000);
        return () => {
            clearInterval(interval);
            clearInterval(tickInterval);
        };
    }, []);


    useEffect(() => {
        if (searchInputRef.current && !loading) {
            searchInputRef.current.focus();
        }
    }, [loading]);

    const filteredHistory = history.filter(item => {
        const search = searchTerm.toLowerCase();
        return (
            (item.user_name || '').toLowerCase().includes(search) ||
            (item.action || '').toLowerCase().includes(search) ||
            (item.details || '').toLowerCase().includes(search)
        );
    });

    const filteredSessions = sessions.filter(item => {
        const search = searchTerm.toLowerCase();
        return (item.user_name || '').toLowerCase().includes(search);
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'Active Now';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '---';
        const options = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return date.toLocaleDateString('en-IN', options);
    };

    const calculateDuration = (login, logout) => {
        const start = new Date(login);
        const end = logout ? new Date(logout) : new Date();
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return '---';
        const diffMs = end - start;
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);

        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(diffHrs)}:${pad(diffMins)}:${pad(diffSecs)}`;
    };


    const getActionClass = (action) => {
        if (action.includes('LOGIN')) return 'bg-green-100 text-green-700';
        if (action.includes('CREATE')) return 'bg-blue-100 text-blue-700';
        if (action.includes('UPDATE')) return 'bg-yellow-100 text-yellow-700';
        if (action.includes('DELETE')) return 'bg-red-100 text-red-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="userhistory-page h-[calc(100vh-80px)] w-full bg-[#f0f4f4] flex overflow-hidden">

            <div className="w-full h-full bg-white border-[2px] border-[#004d40] shadow-2xl rounded-lg overflow-hidden flex flex-col">

                {/* Header */}
                <div className="uh-header bg-white border-b border-gray-200 px-4 py-1.5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="uh-icon-box bg-[#004d40] p-2 rounded-lg text-white">
                            <History size={20} />
                        </div>
                        <div>
                            <h1 className="uh-page-title text-lg font-black text-[#004d40] uppercase tracking-wider">Security & Audit Log</h1>
                            <div className="flex gap-4 mt-0.5">
                                <button
                                    onClick={() => setActiveTab('activity')}
                                    className={`text-[10px] font-black uppercase tracking-widest pb-1 transition-all ${activeTab === 'activity' ? 'text-[#004d40] border-b-2 border-[#004d40]' : 'text-gray-400'}`}
                                >
                                    Activity History
                                </button>
                                <button
                                    onClick={() => setActiveTab('hours')}
                                    className={`text-[10px] font-black uppercase tracking-widest pb-1 transition-all ${activeTab === 'hours' ? 'text-[#004d40] border-b-2 border-[#004d40]' : 'text-gray-400'}`}
                                >
                                    Work Hours
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                ref={searchInputRef}
                                placeholder="Search by name or action..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="uh-search-input pl-10 pr-4 py-2 bg-[#f8fafc] border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#004d40] focus:bg-yellow-100 focus:text-black w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="px-4 py-3 bg-gray-50 flex gap-4 border-b border-gray-200">
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex-1 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total Hours Today</p>
                            <p className="text-lg font-black text-slate-800">
                                {sessions.filter(s => {
                                    const sessionDate = new Date(s.login_time).toDateString();
                                    const today = new Date().toDateString();
                                    return sessionDate === today;
                                }).reduce((acc, s) => {
                                    if (!s.logout_time) return acc;
                                    const diff = new Date(s.logout_time) - new Date(s.login_time);
                                    return acc + diff;
                                }, 0) / 3600000 < 1 ? 'Under 1h' : `${Math.floor(sessions.filter(s => new Date(s.login_time).toDateString() === new Date().toDateString()).reduce((acc, s) => acc + (s.logout_time ? new Date(s.logout_time) - new Date(s.login_time) : 0), 0) / 3600000)}h ${Math.floor((sessions.filter(s => new Date(s.login_time).toDateString() === new Date().toDateString()).reduce((acc, s) => acc + (s.logout_time ? new Date(s.logout_time) - new Date(s.login_time) : 0), 0) % 3600000) / 60000)}m`}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex-1 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Activity size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total Activities</p>
                            <p className="text-lg font-black text-slate-800">{history.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex-1 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Active Users</p>
                            <p className="text-lg font-black text-slate-800">{[...new Set(sessions.filter(s => !s.logout_time).map(s => s.user_id))].length}</p>
                        </div>
                    </div>
                </div>

                {/* Table Container */}

                <div className="flex-1 overflow-auto p-1">
                    <div className="bg-white rounded shadow-sm border border-gray-300 overflow-hidden min-h-full">
                        {activeTab === 'activity' ? (
                            <table className="w-full text-left border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-[#004d40] text-white z-10">
                                        <th className="uh-th px-3 py-2 font-black uppercase tracking-widest border border-[#00332e] sticky top-0 bg-[#004d40]">User</th>
                                        <th className="uh-th px-3 py-2 font-black uppercase tracking-widest border border-[#00332e] sticky top-0 bg-[#004d40]">Action</th>
                                        <th className="uh-th px-3 py-2 font-black uppercase tracking-widest border border-[#00332e] sticky top-0 bg-[#004d40]">Details</th>
                                        <th className="uh-th px-3 py-2 font-black uppercase tracking-widest border border-[#00332e] sticky top-0 bg-[#004d40]">IP Address</th>
                                        <th className="uh-th px-3 py-2 font-black uppercase tracking-widest border border-[#00332e] sticky top-0 bg-[#004d40]">Timestamp</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-bold">Loading...</td></tr>
                                    ) : filteredHistory.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="uh-td px-3 py-2 border border-gray-200 font-bold text-[12px]">{item.user_name}</td>
                                            <td className="uh-td px-3 py-2 border border-gray-200">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${getActionClass(item.action)}`}>
                                                    {item.action}
                                                </span>
                                            </td>
                                            <td className="uh-td px-3 py-2 text-[12px] text-gray-600 border border-gray-200">{item.details}</td>
                                            <td className="uh-td px-3 py-2 text-[12px] text-gray-500 border border-gray-200 uppercase">{item.ip_address}</td>
                                            <td className="uh-td px-3 py-2 text-[11px] font-bold text-gray-400 border border-gray-200 whitespace-nowrap">{formatDate(item.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-[#004d40] text-white z-10">
                                        <th className="uh-th px-3 py-2 font-black uppercase tracking-widest border border-[#00332e] sticky top-0 bg-[#004d40]">User</th>
                                        <th className="uh-th px-3 py-2 font-black uppercase tracking-widest border border-[#00332e] sticky top-0 bg-[#004d40]">Login Time</th>
                                        <th className="uh-th px-3 py-2 font-black uppercase tracking-widest border border-[#00332e] sticky top-0 bg-[#004d40]">Logout Time</th>
                                        <th className="uh-th px-3 py-2 font-black uppercase tracking-widest border border-[#00332e] sticky top-0 bg-[#004d40]">Final Work Hours</th>
                                        <th className="uh-th px-3 py-2 font-black uppercase tracking-widest border border-[#00332e] sticky top-0 bg-[#004d40]">Live Session Duration</th>
                                    </tr>
                                </thead>


                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center py-10 text-gray-400 font-bold">Loading...</td></tr>
                                    ) : filteredSessions.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="uh-td px-3 py-2 border border-gray-200 font-bold text-[13px]">{item.user_name}</td>
                                            <td className="uh-td px-3 py-2 border border-gray-200">
                                                <div className="flex items-center gap-2 text-[#00695c] font-bold text-[11px]">
                                                    <LogIn size={14} /> {formatDate(item.login_time)}
                                                </div>
                                            </td>
                                            <td className="uh-td px-3 py-2 border border-gray-200">
                                                <div className="flex items-center gap-2 text-rose-600 font-bold text-[11px]">
                                                    <LogOut size={14} /> {formatDate(item.logout_time)}
                                                </div>
                                            </td>
                                            <td className="uh-td px-3 py-2 border border-gray-200">
                                                <div className="flex items-center gap-2 bg-[#004d40]/10 text-[#004d40] px-3 py-1 rounded w-fit font-black text-[12px]">
                                                    <Clock size={14} /> {item.logout_time ? calculateDuration(item.login_time, item.logout_time) : '---'}
                                                </div>
                                            </td>
                                            <td className="uh-td px-3 py-2 border border-gray-200">
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded w-fit font-black text-[12px] ${!item.logout_time ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                                                    <Activity size={14} /> {calculateDuration(item.login_time, item.logout_time)}
                                                </div>
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        )}

                        {!loading && ((activeTab === 'activity' && filteredHistory.length === 0) || (activeTab === 'hours' && filteredSessions.length === 0)) && (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                                <History size={48} strokeWidth={1} className="mb-4 opacity-20" />
                                <p className="uh-empty-text text-sm font-medium uppercase tracking-widest">No records found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="uh-footer bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-end flex-shrink-0">
                    <button
                        onClick={() => navigate('/dashboard/1')}
                        className="uh-footer-btn bg-[#004d40] hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-95 group"
                    >
                        <XCircle size={18} className="group-hover:rotate-90 transition-transform" />
                        <span className="uh-btn-text text-sm font-black uppercase tracking-widest">Close Page</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserHistory;
