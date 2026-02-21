import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from './LayoutContext';
import {
    LayoutDashboard,
    Database,
    RefreshCcw,
    Settings,
    ChevronDown,
    ChevronRight,
    Package,
    Users,
    FileText,
    ShoppingCart,
    CreditCard,
    ArrowLeftRight,
    Circle
} from 'lucide-react';

const NavItem = ({ item, isSidebarOpen, openMenus, toggleMenu, handleNavigate, depth = 0 }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = openMenus.includes(item.label);
    const indentClass = depth > 0 ? `ml-${Math.min(depth * 3, 9)}` : '';

    return (
        <div className="w-full">
            <button
                onClick={() => hasSubItems ? toggleMenu(item.label) : handleNavigate(item.path)}
                className={`
                    group relative w-full flex items-center justify-between p-2 rounded-lg transition-all
                    ${item.id === 'dashboard' ? 'bg-[#004d40] text-white shadow-lg' : 'text-white hover:bg-[#004d404d] hover:text-white'}
                    ${!isSidebarOpen && 'justify-center'}
                    ${depth > 0 ? 'h-9' : 'h-11'}
                `}
            >
                {/* Branch line for sub-items */}
                {isSidebarOpen && depth > 0 && (
                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1 h-[1px] bg-[#ffffff33]" />
                )}

                <div className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0 text-white">
                        {item.icon || <Circle size={depth > 1 ? 4 : 6} fill="currentColor" className="opacity-70" />}
                    </span>
                    {isSidebarOpen && (
                        <span className={`
                            truncate tracking-wider transition-colors
                            ${depth === 0 ? 'text-[13px] font-black uppercase' : 'text-[12px] font-medium text-white'}
                        `}>
                            {item.label}
                        </span>
                    )}
                </div>
                {isSidebarOpen && hasSubItems && (
                    <span className="text-[#80cbc4] group-hover:text-white transition-colors">
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}
            </button>

            {isSidebarOpen && hasSubItems && isOpen && (
                <div className={`
                    mt-1 space-y-0.5 animate-fadeIn border-l border-[#ffffff33] transition-all ml-[22px] pl-1
                    ${depth > 0 ? 'ml-[14px]' : ''}
                `}>
                    {item.subItems.map((sub, idx) => (
                        <NavItem
                            key={idx}
                            item={sub}
                            isSidebarOpen={isSidebarOpen}
                            openMenus={openMenus}
                            toggleMenu={toggleMenu}
                            handleNavigate={handleNavigate}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Sidebar = () => {
    const { isSidebarOpen, setHover } = useLayout();
    const navigate = useNavigate();
    const [openMenus, setOpenMenus] = useState([]);

    // Close all submenus when sidebar is collapsed
    useEffect(() => {
        if (!isSidebarOpen) {
            setOpenMenus([]);
        }
    }, [isSidebarOpen]);

    const toggleMenu = (name) => {
        setOpenMenus(prev =>
            prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
        );
    };

    const handleNavigate = (path) => {
        if (path) navigate(path);
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        {
            id: 'master',
            label: 'Master',
            icon: <Database size={20} />,
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
                        { label: 'Department', icon: <RefreshCcw size={16} />, path: '/department' }
                    ]
                }
            ]
        },
        {
            id: 'transaction',
            label: 'Transaction',
            icon: <RefreshCcw size={20} />,
            subItems: [
                { label: 'ACCOUNT VOUCHER CREATION', icon: <FileText size={16} />, path: '/account-voucher-creation' },
                // { label: 'Sales Entry', icon: <ShoppingCart size={16} /> },
                // { label: 'Purchase Entry', icon: <CreditCard size={16} /> },
                // { label: 'Transfer Stock', icon: <ArrowLeftRight size={16} /> },
            ]
        },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    return (
        <aside
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`
                fixed left-0 top-14 bottom-0 bg-[#00332e] border-r border-[#004d40] shadow-xl z-40 transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'w-64' : 'w-16'}
            `}
        >
            <div className="flex flex-col h-full py-4">
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <NavItem
                            key={item.id}
                            item={item}
                            isSidebarOpen={isSidebarOpen}
                            openMenus={openMenus}
                            toggleMenu={toggleMenu}
                            handleNavigate={handleNavigate}
                        />
                    ))}
                </nav>

                <div className="px-4 mt-auto border-t border-[#004d40] pt-4">
                    <div className={`bg-[#004d4033] rounded-xl p-3 border border-[#004d40] ${!isSidebarOpen && 'hidden'}`}>
                        <p className="text-[10px] text-[#00695c] font-black uppercase mb-1">System Version</p>
                        <p className="text-[11px] font-bold text-[#80cbc4]">V2.0.4.8 Platinum</p>
                    </div>
                    {!isSidebarOpen && (
                        <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-[#004d4033] flex items-center justify-center text-[#00695c] font-black text-xs">V2</div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

