import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, X, Search, RotateCcw, Trash2, Key, User, Calendar, ShieldCheck, Eye, EyeOff, ChevronRight, Activity, Mail, Phone, Info } from 'lucide-react';
import './UserList.css';

const UserList = () => {
    const navigate = useNavigate();

    const [userList, setUserList] = useState([]);

    // Fetch users from backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/users");
                const data = await response.json();

                // Process the data to add colors and ensure default values
                const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-blue-600', 'bg-purple-600'];
                const processedUsers = data.map((user, index) => ({
                    id: user.id,
                    username: user.username || user.name || 'Unknown',
                    pin: '****', // not returned by API
                    createdAt: 'Recently', // Placeholder
                    role: user.role || 'User',
                    color: colors[index % colors.length],
                    email: user.email || 'N/A',
                    phone: user.phone || 'N/A'
                }));

                setUserList(processedUsers);
                if (processedUsers.length > 0) {
                    setSelectedUserId(processedUsers[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(1);
    const [showPin, setShowPin] = useState(false);

    const searchRef = useRef(null);

    useEffect(() => {
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, [selectedUserId]); // refocused when user changes or on mount

    // Filtered users for the sidebar
    const filteredUsers = userList.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get the currently selected user object
    const selectedUser = userList.find(u => u.id === selectedUserId) ||
        userList[0];

    const handleResetPin = (user) => {
        if (window.confirm(`Are you sure you want to reset PIN for "${user.username}"?`)) {
            alert(`PIN reset request sent for ${user.username}.`);
        }
    };

    const handleDelete = (user) => {
        if (window.confirm(`DANGEROUS: Are you sure you want to delete user "${user.username}"? This cannot be undone.`)) {
            const newList = userList.filter(u => u.id !== user.id);
            setUserList(newList);
            if (newList.length > 0) {
                setSelectedUserId(newList[0].id);
            }
            alert(`User "${user.username}" deleted successfully.`);
        }
    };

    return (
        <div className="user-list-page h-full w-full bg-[#f8fafc] flex overflow-hidden">

            {/* Sidebar: Master List */}
            <div className="ul-sidebar w-[320px] bg-white border border-slate-200 shadow-xl rounded-2xl flex flex-col overflow-hidden flex-shrink-0">
                {/* Sidebar Header */}
                <div className="ul-sidebar-header bg-slate-50 px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="ul-sidebar-icon bg-[#004d40] p-2 rounded-lg text-white shadow-md shadow-[#004d40]/20">
                            <Users size={18} />
                        </div>
                        <h1 className="ul-sidebar-title text-sm font-black tracking-widest uppercase text-slate-700">User Accounts</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="ul-search-container relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={14} />
                        </span>
                        <input
                            type="text"
                            placeholder="Quick search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            ref={searchRef}
                            autoFocus
                            className="ul-search-input w-full pl-9 pr-3 py-2 bg-[#cff2f3e1] border border-slate-200 focus:border-[#004d40] focus:ring-2 focus:ring-[#004d40]/10 focus:bg-[#cff2f3e1] focus:text-black outline-none text-[12px] font-bold text-slate-700 transition-all placeholder:text-slate-500 placeholder:font-normal rounded-xl shadow-sm"
                        />
                    </div>
                </div>

                {/* User List Scrollable Area */}
                <div className="ul-user-list-area flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
                    {filteredUsers.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => {
                                        setSelectedUserId(user.id);
                                        setShowPin(false);
                                    }}
                                    className={`ul-user-item w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative border ${selectedUserId === user.id
                                        ? 'bg-white border-[#004d40] shadow-sm ml-1 w-[calc(100%-4px)]'
                                        : 'bg-transparent border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xs'
                                        }`}
                                >
                                    <div className={`ul-user-avatar w-10 h-10 rounded-lg flex-shrink-0 ${user.color} text-white flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-105 transition-transform`}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col items-start overflow-hidden">
                                        <span className={`ul-user-name text-[12px] font-black truncate ${selectedUserId === user.id ? 'text-[#004d40]' : 'text-slate-700'}`}>
                                            {user.username}
                                        </span>
                                        <span className="ul-user-role text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                            {user.role}
                                        </span>
                                    </div>
                                    {selectedUserId === user.id && (
                                        <div className="ul-user-selector ml-auto text-[#004d40]">
                                            <ChevronRight size={16} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center gap-3 opacity-30 grayscale scale-75">
                            <Users size={48} />
                            <p className="text-[10px] font-black uppercase tracking-widest">No users found</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Footer */}
                <div className="ul-sidebar-footer p-3 border-t border-slate-100 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Total: {filteredUsers.length} Users Listed
                </div>
            </div>

            {/* Detail Panel: User Details */}
            <div className="ul-detail-panel flex-1 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden flex flex-col">

                {/* Detail Header */}
                <div className="ul-detail-header h-14 bg-[#004d40] px-6 flex items-center justify-between flex-shrink-0 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
                    <div className="flex items-center gap-2 relative z-10">
                        <Activity size={18} className="ul-detail-icon text-[#a7ffeb]" />
                        <h2 className="ul-detail-title text-xs font-black tracking-widest uppercase text-white">Management Console</h2>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/1')}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white group relative z-10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {selectedUser ? (
                    <div className="ul-detail-content flex-1 overflow-y-auto p-3">
                        <div className="max-w-3xl mx-auto space-y-6">

                            {/* Profile Highlight */}
                            <div className="ul-profile-highlight flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-slate-100 pb-1">
                                <div className={`ul-profile-avatar w-20 h-20 rounded-3xl ${selectedUser.color} text-white flex items-center justify-center text-4xl font-black shadow-2xl shadow-${selectedUser.color.split('-')[1]}-200/50`}>
                                    {selectedUser.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 text-center sm:text-left pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 justify-center sm:justify-start">
                                        <h3 className="ul-profile-name text-2xl font-black text-slate-800 tracking-tight">{selectedUser.username}</h3>
                                        <div className="ul-profile-badge px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 w-fit self-center sm:self-auto">
                                            {selectedUser.role}
                                        </div>
                                    </div>
                                    <div className="ul-profile-details flex flex-wrap justify-center sm:justify-start gap-4 text-slate-400">
                                        <div className="ul-profile-detail flex items-center gap-1.5">
                                            <Mail size={14} className="text-[#004d40]" />
                                            <span className="text-[12px] font-bold">{selectedUser.email}</span>
                                        </div>
                                        <div className="ul-profile-detail flex items-center gap-1.5">
                                            <Phone size={14} className="text-[#004d40]" />
                                            <span className="text-[12px] font-bold">{selectedUser.phone}</span>
                                        </div>
                                        <div className="ul-profile-detail flex items-center gap-1.5">
                                            <Calendar size={14} className="text-[#004d40]" />
                                            <span className="text-[12px] font-bold uppercase tracking-tight">Admin since {selectedUser.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Access Credentials */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="ul-access-card bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-[#004d40]/20 transition-all group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Key size={16} className="text-[#004d40]" />
                                        <h4 className="ul-access-label text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Security Access Pin</h4>
                                    </div>
                                    <div className="ul-access-value-box flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 group-hover:shadow-md transition-shadow">
                                        <span className={`ul-access-value text-xl font-black tracking-[0.4em] font-mono leading-none pt-1 ${showPin ? 'text-[#004d40]' : 'text-slate-300 blur-[2px]'}`}>
                                            {showPin ? selectedUser.pin : '••••'}
                                        </span>
                                        <button
                                            onClick={() => setShowPin(!showPin)}
                                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#004d40] transition-all"
                                        >
                                            {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="ul-access-info mt-3 text-[10px] text-slate-400 font-bold leading-relaxed px-1">
                                        * Use this 4-digit PIN for privileged operations and system overrides. Keep it confidential.
                                    </p>
                                </div>

                                <div className="ul-status-card bg-[#e0f2f1]/30 border border-[#b2dfdb]/50 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShieldCheck size={16} className="text-[#004d40]" />
                                        <h4 className="ul-status-label text-[11px] font-black uppercase tracking-[0.2em] text-[#00695c]">Account Status</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="ul-status-row flex items-center justify-between text-[11px] font-bold">
                                            <span className="text-slate-500">Account Verified</span>
                                            <span className="text-emerald-600">Yes</span>
                                        </div>
                                        <div className="ul-status-row flex items-center justify-between text-[11px] font-bold">
                                            <span className="text-slate-500">Last Login Attempt</span>
                                            <span className="text-slate-700">Today, 11:45 AM</span>
                                        </div>
                                        <div className="ul-status-row flex items-center justify-between text-[11px] font-bold">
                                            <span className="text-slate-500">Login Security</span>
                                            <span className="text-[#004d40]">Standard PIN</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Management Actions */}
                            <div className="ul-action-card bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <RotateCcw size={16} className="text-slate-500" />
                                    <h4 className="ul-action-label text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Admin Actions</h4>
                                </div>
                                <div className="ul-actions-flex flex flex-wrap gap-4">
                                    <button
                                        onClick={() => handleResetPin(selectedUser)}
                                        className="ul-action-btn h-10 px-6 bg-[#004d40] hover:bg-[#00332e] text-white rounded-xl flex items-center justify-center gap-2 transition-all text-[11px] font-black uppercase tracking-widest shadow-sm active:scale-95"
                                    >
                                        <RotateCcw size={14} />
                                        Reset PIN
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedUser)}
                                        className="ul-action-btn h-10 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2 transition-all text-[11px] font-black uppercase tracking-widest shadow-sm active:scale-95"
                                    >
                                        <Trash2 size={14} />
                                        Terminate Account
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-4">
                        <Info size={64} strokeWidth={1} />
                        <p className="text-[11px] font-black uppercase tracking-widest">Select an account to view details</p>
                    </div>
                )}

                {/* Detail Panel Footer */}
                <div className="ul-detail-footer bg-slate-50 px-8 py-3 border-t border-slate-100 flex items-center justify-end flex-shrink-0">
                    <span className="ul-footer-text text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Confidential Data - Authorization Required
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserList;
