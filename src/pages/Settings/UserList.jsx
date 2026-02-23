import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, X, Search, RotateCcw, Trash2, Key, User, Calendar, ShieldCheck, Eye, EyeOff, ChevronRight, Activity, Mail, Phone, Info } from 'lucide-react';

const UserList = () => {
    const navigate = useNavigate();

    // Mock user data
    const [userList, setUserList] = useState([
        { id: 1, username: 'admin', pin: '1234', createdAt: '15 Jan 2024', role: 'Super Admin', color: 'bg-indigo-600', email: 'admin@system.com', phone: '+91 98765 43210' },
        { id: 2, username: 'operator_sales', pin: '5566', createdAt: '10 Feb 2024', role: 'Sales Operator', color: 'bg-emerald-600', email: 'sales@system.com', phone: '+91 98765 43211' },
        { id: 3, username: 'manager_rk', pin: '9001', createdAt: '20 Feb 2024', role: 'Store Manager', color: 'bg-amber-600', email: 'rk_mgr@system.com', phone: '+91 98765 43212' },
        { id: 4, username: 'cashier_01', pin: '4321', createdAt: '22 Feb 2024', role: 'Cashier', color: 'bg-rose-600', email: 'cashier@system.com', phone: '+91 98765 43213' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(1);
    const [showPin, setShowPin] = useState(false);

    // Filtered users for the sidebar
    const filteredUsers = userList.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get the currently selected user object
    const selectedUser = userList.find(u => u.id === selectedUserId) || userList[0];

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
        <div className="h-full w-full bg-[#f8fafc] flex overflow-hidden gap-3">

            {/* Sidebar: Master List */}
            <div className="w-[320px] bg-white border border-slate-200 shadow-xl rounded-2xl flex flex-col overflow-hidden flex-shrink-0">
                {/* Sidebar Header */}
                <div className="bg-slate-50 px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#004d40] p-2 rounded-lg text-white shadow-md shadow-[#004d40]/20">
                            <Users size={18} />
                        </div>
                        <h1 className="text-sm font-black tracking-widest uppercase text-slate-700">User Accounts</h1>
                    </div>
                    {/* Search Bar */}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={14} />
                        </span>
                        <input
                            type="text"
                            placeholder="Quick search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 focus:border-[#004d40] focus:ring-2 focus:ring-[#004d40]/10 outline-none text-[12px] font-bold text-slate-700 transition-all placeholder:text-slate-300 placeholder:font-normal rounded-xl shadow-sm"
                        />
                    </div>
                </div>

                {/* User List Scrollable Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
                    {filteredUsers.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => {
                                        setSelectedUserId(user.id);
                                        setShowPin(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative border ${selectedUserId === user.id
                                            ? 'bg-white border-[#004d40] shadow-sm ml-1 w-[calc(100%-4px)]'
                                            : 'bg-transparent border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xs'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex-shrink-0 ${user.color} text-white flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-105 transition-transform`}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col items-start overflow-hidden">
                                        <span className={`text-[12px] font-black truncate ${selectedUserId === user.id ? 'text-[#004d40]' : 'text-slate-700'}`}>
                                            {user.username}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                            {user.role}
                                        </span>
                                    </div>
                                    {selectedUserId === user.id && (
                                        <div className="ml-auto text-[#004d40]">
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
                <div className="p-3 border-t border-slate-100 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Total: {filteredUsers.length} Users Listed
                </div>
            </div>

            {/* Detail Panel: User Details */}
            <div className="flex-1 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden flex flex-col">

                {/* Detail Header */}
                <div className="h-14 bg-[#004d40] px-6 flex items-center justify-between flex-shrink-0 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
                    <div className="flex items-center gap-2 relative z-10">
                        <Activity size={18} className="text-[#a7ffeb]" />
                        <h2 className="text-xs font-black tracking-widest uppercase text-white">Management Console</h2>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/1')}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white group relative z-10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {selectedUser ? (
                    <div className="flex-1 overflow-y-auto p-3">
                        <div className="max-w-3xl mx-auto space-y-6">

                            {/* Profile Highlight */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-slate-100 pb-1">
                                <div className={`w-20 h-20 rounded-3xl ${selectedUser.color} text-white flex items-center justify-center text-4xl font-black shadow-2xl shadow-${selectedUser.color.split('-')[1]}-200/50`}>
                                    {selectedUser.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 text-center sm:text-left pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 justify-center sm:justify-start">
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedUser.username}</h3>
                                        <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 w-fit self-center sm:self-auto">
                                            {selectedUser.role}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Mail size={14} className="text-[#004d40]" />
                                            <span className="text-[12px] font-bold">{selectedUser.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={14} className="text-[#004d40]" />
                                            <span className="text-[12px] font-bold">{selectedUser.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-[#004d40]" />
                                            <span className="text-[12px] font-bold uppercase tracking-tight">Admin since {selectedUser.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Access Credentials */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-[#004d40]/20 transition-all group">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Key size={16} className="text-[#004d40]" />
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Security Access Pin</h4>
                                    </div>
                                    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 group-hover:shadow-md transition-shadow">
                                        <span className={`text-xl font-black tracking-[0.4em] font-mono leading-none pt-1 ${showPin ? 'text-[#004d40]' : 'text-slate-300 blur-[2px]'}`}>
                                            {showPin ? selectedUser.pin : '••••'}
                                        </span>
                                        <button
                                            onClick={() => setShowPin(!showPin)}
                                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#004d40] transition-all"
                                        >
                                            {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="mt-3 text-[10px] text-slate-400 font-bold leading-relaxed px-1">
                                        * Use this 4-digit PIN for privileged operations and system overrides. Keep it confidential.
                                    </p>
                                </div>

                                <div className="bg-[#e0f2f1]/30 border border-[#b2dfdb]/50 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShieldCheck size={16} className="text-[#004d40]" />
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00695c]">Account Status</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-[11px] font-bold">
                                            <span className="text-slate-500">Account Verified</span>
                                            <span className="text-emerald-600">Yes</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] font-bold">
                                            <span className="text-slate-500">Last Login Attempt</span>
                                            <span className="text-slate-700">Today, 11:45 AM</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] font-bold">
                                            <span className="text-slate-500">Login Security</span>
                                            <span className="text-[#004d40]">Standard PIN</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Management Actions */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <RotateCcw size={16} className="text-slate-500" />
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Admin Actions</h4>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => handleResetPin(selectedUser)}
                                        className="h-10 px-6 bg-slate-100 hover:bg-[#004d40] text-slate-700 hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all text-[11px] font-black uppercase tracking-widest shadow-sm active:scale-95"
                                    >
                                        <RotateCcw size={14} />
                                        Reset PIN PIN
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedUser)}
                                        className="h-10 px-6 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 rounded-xl flex items-center justify-center gap-2 transition-all text-[11px] font-black uppercase tracking-widest shadow-sm active:scale-95"
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
                <div className="bg-slate-50 px-8 py-3 border-t border-slate-100 flex items-center justify-end flex-shrink-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Confidential Data - Authorization Required
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserList;
