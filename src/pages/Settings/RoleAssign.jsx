import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, X, User, Check, RefreshCw, Database, RefreshCcw, ChevronRight } from 'lucide-react';

const RoleAssign = () => {
    const navigate = useNavigate();

    // Mock Users
    const [users] = useState([
        { id: 1, username: 'admin' },
        { id: 2, username: 'operator1' },
        { id: 3, username: 'manager1' },
    ]);

    const [selectedUser, setSelectedUser] = useState('');
    const [activeCategory, setActiveCategory] = useState(null); // 'master' or 'transaction'
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    // Menu Structure based on Sidebar
    const menuData = {
        master: [
            {
                id: 'acc_master',
                label: 'Account master',
                items: [
                    { id: 'party', label: 'Party' }
                ]
            },
            {
                id: 'oth_master',
                label: 'Other master',
                items: [
                    { id: 'dept', label: 'Department' }
                ]
            }
        ],
        transaction: [
            {
                id: 'acc_voucher',
                label: 'Account Voucher',
                items: [
                    { id: 'acc_voucher_create', label: 'Account Voucher Creation' }
                ]
            }
        ]
    };

    // Table State: permissions[itemId] = { read, create, edit, delete }
    const [permissions, setPermissions] = useState({});

    const handleTogglePermission = (itemId, type) => {
        setPermissions(prev => {
            const current = prev[itemId] || { read: false, create: false, edit: false, delete: false };
            return {
                ...prev,
                [itemId]: { ...current, [type]: !current[type] }
            };
        });
    };

    const handleSelectAllRow = (itemId) => {
        setPermissions(prev => {
            const current = prev[itemId] || { read: false, create: false, edit: false, delete: false };
            const allSelected = current.read && current.create && current.edit && current.delete;
            return {
                ...prev,
                [itemId]: {
                    read: !allSelected,
                    create: !allSelected,
                    edit: !allSelected,
                    delete: !allSelected
                }
            };
        });
    };

    const handleClear = () => {
        setSelectedUser('');
        setActiveCategory(null);
        setActiveSubMenu(null);
        setPermissions({});
    };

    const handleAssign = () => {
        if (!selectedUser) {
            alert('Please select a user');
            return;
        }
        console.log('Assigning Permissions:', { user: selectedUser, permissions });
        alert(`Permissions assigned to ${selectedUser} successfully!`);
    };

    return (
        <div className="h-full w-full bg-[#f0f4f4] flex overflow-hidden">
            <div className="w-full h-full bg-white border-[2px] border-[#004d40] shadow-2xl rounded-lg overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-[#004d40] px-4 py-2 text-white flex items-center justify-between h-12 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-[#a7ffeb]" />
                        <h1 className="text-sm font-black tracking-widest uppercase">Role Assign</h1>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/1')}
                        className="w-8 h-8 rounded-full hover:bg-black/20 flex items-center justify-center transition-colors text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col p-6 overflow-hidden">
                    {/* User Selection */}
                    <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-md border border-gray-200 shadow-sm">
                        <label className="flex items-center gap-2 text-[12px] font-black text-[#004d40] uppercase tracking-tight">
                            <User size={16} className="text-[#00695c]" />
                            Select User:
                        </label>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="bg-white border border-gray-300 focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none px-4 py-1.5 text-[13px] font-bold text-gray-800 transition-all rounded shadow-sm cursor-pointer min-w-[200px]"
                        >
                            <option value="">-- Choose User --</option>
                            {users.map(u => (
                                <option key={u.id} value={u.username}>{u.username}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 flex gap-6 overflow-hidden">
                        {/* Category Selection (Master/Transaction) */}
                        <div className="w-48 flex flex-col gap-3">
                            <button
                                onClick={() => { setActiveCategory('master'); setActiveSubMenu(null); }}
                                className={`h-12 flex items-center justify-between px-4 rounded-lg font-black uppercase tracking-wider text-[12px] transition-all shadow-md group ${activeCategory === 'master'
                                    ? 'bg-[#004d40] text-white'
                                    : 'bg-white text-[#004d40] border-2 border-[#004d40] hover:bg-[#e0f2f1]'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Database size={18} />
                                    Master
                                </div>
                                <ChevronRight size={16} className={`transition-transform ${activeCategory === 'master' ? 'rotate-90' : ''}`} />
                            </button>

                            <button
                                onClick={() => { setActiveCategory('transaction'); setActiveSubMenu(null); }}
                                className={`h-12 flex items-center justify-between px-4 rounded-lg font-black uppercase tracking-wider text-[12px] transition-all shadow-md group ${activeCategory === 'transaction'
                                    ? 'bg-[#004d40] text-white'
                                    : 'bg-white text-[#004d40] border-2 border-[#004d40] hover:bg-[#e0f2f1]'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <RefreshCcw size={18} />
                                    Transaction
                                </div>
                                <ChevronRight size={16} className={`transition-transform ${activeCategory === 'transaction' ? 'rotate-90' : ''}`} />
                            </button>
                        </div>

                        {/* Sub-menu Selection */}
                        {activeCategory && (
                            <div className="w-56 flex flex-col gap-2">
                                <h3 className="text-[11px] font-black text-[#00695c] uppercase tracking-widest px-2 mb-1">Sub Menus</h3>
                                {menuData[activeCategory].map(sub => (
                                    <button
                                        key={sub.id}
                                        onClick={() => setActiveSubMenu(sub)}
                                        className={`h-10 px-4 rounded text-left font-bold text-[12px] transition-all border-l-4 ${activeSubMenu?.id === sub.id
                                            ? 'bg-white border-[#004d40] text-[#004d40] shadow-sm ml-2'
                                            : 'border-transparent text-gray-500 hover:text-[#004d40] hover:bg-white/50'
                                            }`}
                                    >
                                        {sub.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Permissions Table */}
                        <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-inner">
                            {activeSubMenu ? (
                                <>
                                    <div className="bg-[#00695c] px-4 py-2 text-white text-[12px] font-black uppercase tracking-wider">
                                        Permissions for {activeSubMenu.label}
                                    </div>
                                    <div className="flex-1 overflow-auto">
                                        <table className="w-full border-collapse">
                                            <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
                                                <tr className="border-b border-gray-300">
                                                    <th className="text-left px-4 py-3 text-[11px] font-black uppercase text-gray-600 w-1/3">Menu</th>
                                                    <th className="px-4 py-3 text-[11px] font-black uppercase text-gray-600">Read</th>
                                                    <th className="px-4 py-3 text-[11px] font-black uppercase text-gray-600">Create</th>
                                                    <th className="px-4 py-3 text-[11px] font-black uppercase text-gray-600">Edit</th>
                                                    <th className="px-4 py-3 text-[11px] font-black uppercase text-gray-600">Delete</th>
                                                    <th className="px-4 py-3 text-[11px] font-black uppercase text-[#004d40]">Select All</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activeSubMenu.items.map(item => {
                                                    const itemPerms = permissions[item.id] || { read: false, create: false, edit: false, delete: false };
                                                    const isAllRow = itemPerms.read && itemPerms.create && itemPerms.edit && itemPerms.delete;

                                                    return (
                                                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                            <td className="px-4 py-3 text-[13px] font-bold text-gray-700">{item.label}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={itemPerms.read}
                                                                    onChange={() => handleTogglePermission(item.id, 'read')}
                                                                    className="w-4 h-4 accent-[#004d40] cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={itemPerms.create}
                                                                    onChange={() => handleTogglePermission(item.id, 'create')}
                                                                    className="w-4 h-4 accent-[#004d40] cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={itemPerms.edit}
                                                                    onChange={() => handleTogglePermission(item.id, 'edit')}
                                                                    className="w-4 h-4 accent-[#004d40] cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={itemPerms.delete}
                                                                    onChange={() => handleTogglePermission(item.id, 'delete')}
                                                                    className="w-4 h-4 accent-[#004d40] cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isAllRow}
                                                                    onChange={() => handleSelectAllRow(item.id)}
                                                                    className="w-4 h-4 accent-[#ef5350] border-2 border-red-500 rounded cursor-pointer ring-2 ring-red-50 ring-offset-0"
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 grayscale opacity-50">
                                    <Shield size={48} strokeWidth={1} />
                                    <p className="text-[12px] font-bold uppercase tracking-widest">Select Category and Sub-Menu</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleAssign}
                            className="h-10 px-8 bg-[#004d40] hover:bg-[#00332e] text-white rounded-md flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                        >
                            <Check size={18} />
                            <span className="text-[13px] font-black uppercase tracking-widest">Create</span>
                        </button>
                        <button
                            onClick={handleClear}
                            className="h-10 px-8 bg-white border border-gray-300 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                        >
                            <RefreshCw size={18} />
                            <span className="text-[13px] font-black uppercase tracking-widest">Clear</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleAssign;
