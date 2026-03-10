import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Database,
    RefreshCcw,
    Settings,
    ChevronDown,
    ChevronRight,
    Users,
    FileText,
    Circle,
    UserPlus,
    Shield,
    List,
    KeyRound,
    History,
    BarChart3
} from 'lucide-react';

const TopNavItem = ({ item, handleNavigate, depth = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const hoverRef = useRef(null);
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Close menu when clicking outside (or on mouse leave for desktop)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (hoverRef.current && !hoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClick = () => {
        if (hasSubItems) {
            setIsOpen(!isOpen);
        } else {
            handleNavigate(item.path);
            setIsOpen(false);
        }
    };

    return (
        <div
            ref={hoverRef}
            className={`relative group ${depth === 0 ? 'h-full flex flex-col justify-center' : 'w-full flex flex-col'}`}
        >
            <button
                onClick={handleClick}
                className={`
                    flex items-center justify-between gap-2 rounded-lg transition-all whitespace-nowrap
                    ${depth === 0 ? 'px-3 py-1.5 text-sm font-bold ' : `w-full px-4 py-2.5 hover:bg-[#004d4008] `}
                    ${depth > 1 ? 'pl-10 relative' : ''}
                    ${item.id === 'dashboard' && depth === 0 ? 'bg-white text-[#004d40] shadow-md' : depth === 0 ? 'text-[#a7ffeb] hover:bg-[#00332e] hover:text-white' : 'text-gray-700'}
                    ${depth > 0 && isOpen && hasSubItems ? 'text-[#004d40] font-bold' : ''}
                `}
            >
                {/* Visual Connector for Sub Level */}
                {depth > 1 && (
                    <div className="absolute left-[22px] top-0 bottom-0 w-[1px] bg-[#004d40] opacity-20"></div>
                )}
                {depth > 1 && (
                    <div className="absolute left-[22px] top-1/2 w-2 h-[1px] bg-[#004d40] opacity-20"></div>
                )}

                <div className="flex items-center gap-2">
                    <span className={`
                        ${item.id === 'dashboard' && depth === 0 ? 'text-[#004d40]' : depth === 0 ? 'text-[#a7ffeb]' : 'text-[#00695c]'}
                        ${depth > 1 ? 'z-10 bg-[#f4f7f6]' : ''}
                    `}>
                        {item.icon || <Circle size={depth > 1 ? 5 : 8} fill={depth > 1 ? "currentColor" : "none"} />}
                    </span>
                    <span className={`
                        ${depth === 0 ? 'uppercase tracking-wider' : 'font-medium'}
                        ${depth > 1 ? 'text-[12px] text-gray-600' : 'text-[13px]'}
                    `}>
                        {item.label}
                    </span>
                </div>
                {hasSubItems && (
                    <span className={`ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${depth === 0 ? 'opacity-70 text-[#a7ffeb] group-hover:text-white' : 'opacity-70'}`}>
                        {depth === 0 ? <ChevronDown size={14} /> : <ChevronDown size={14} />}
                    </span>
                )}
            </button>

            {/* Sub-Items Container */}
            {hasSubItems && (
                <div
                    className={
                        depth === 0
                            ? `absolute z-50 py-2 min-w-[220px] transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.2)] border border-[#004d40]/10 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible pointer-events-none -translate-y-4'} top-[48px] left-0`
                            : `overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100 bg-[#f4f7f6]' : 'max-h-0 opacity-0'}`
                    }
                >
                    <div className={depth > 0 ? "py-1 flex flex-col border-y border-[#004d40]/5" : ""}>
                        {item.subItems?.map((sub, idx) => (
                            <TopNavItem
                                key={idx}
                                item={sub}
                                handleNavigate={handleNavigate}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const TopNav = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        if (path) navigate(path);
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/1 ' },
        {
            id: 'master',
            label: 'Master',
            icon: <Database size={18} />,
            subItems: [
                {
                    label: 'Account master',
                    icon: <Users size={16} />,
                    subItems: [
                        { label: 'Party', icon: <Circle size={8} />, path: '/party' }
                    ]
                },
                {
                    label: 'Other master',
                    icon: <Settings size={16} />,
                    subItems: [
                        { label: 'Department', icon: <RefreshCcw size={16} />, path: '/department' },
                        { label: 'Work', icon: <FileText size={16} />, path: '/work' },
                        { label: 'Zone', icon: <Circle size={16} />, path: '/zone' },
                        { label: 'Panchayat', icon: <Circle size={16} />, path: '/panchayat' }
                    ]
                }
            ]
        },
        {
            id: 'transaction',
            label: 'Transaction',
            icon: <RefreshCcw size={18} />,
            subItems: [
                { label: 'ACCOUNT VOUCHER CREATION', icon: <FileText size={16} />, path: '/account-voucher-creation' },
            ]
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: <BarChart3 size={18} />,
            path: '/reports',
            subItems: [
                { label: 'Transaction Summary', icon: <FileText size={16} />, path: '/reports' }
            ]
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: <Settings size={18} />,
            subItems: [
                { label: 'User Create', icon: <UserPlus size={16} />, path: '/settings/user-create' },
                { label: 'Role Assign', icon: <Shield size={16} />, path: '/settings/role-assign' },
                { label: 'User List', icon: <List size={16} />, path: '/settings/user-list' },
                { label: 'Admin Pin', icon: <KeyRound size={16} />, path: '/settings/admin-pin' },
                { label: 'User History', icon: <History size={16} />, path: '/settings/user-history' }
            ]
        },
    ];

    return (
        <div className="flex-1 flex items-center gap-2 h-full px-2">
            {menuItems.map((item) => (
                <TopNavItem
                    key={item.id}
                    item={item}
                    handleNavigate={handleNavigate}
                />
            ))}
        </div>
    );
};

export default TopNav;
