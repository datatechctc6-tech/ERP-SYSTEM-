import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, LogOut, ChevronDown, CheckCircle } from 'lucide-react';
import { useLayout } from './LayoutContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { toggleSidebar, isPinned } = useLayout();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Clear session if any
        localStorage.clear();
        sessionStorage.clear();
        // Redirect to login
        navigate('/login', { replace: true });
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#004d40] text-white flex items-center px-4 z-50 shadow-md">
            <button
                onClick={toggleSidebar}
                className={`p-2 hover:bg-[#00332e] rounded-lg transition-colors mr-3 ${isPinned ? 'bg-[#00332e] text-[#a7ffeb]' : ''}`}
            >
                <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-[#004d40] font-black italic text-xs">DT</span>
                </div>
                <h1 className="text-2xl font-black  uppercase hidden sm:block">
                    DATATECH ERP <span className="text-[#a7ffeb]">System</span>
                </h1>
            </div>

            <div className="ml-auto flex items-center gap-3">
                <button className="p-2 hover:bg-[#00332e] rounded-lg transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#004d40]"></span>
                </button>

                <div className="h-8 w-[1px] bg-[#00695c] mx-1"></div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl transition-all ${isMenuOpen ? 'bg-[#00332e] shadow-inner' : 'hover:bg-[#00332e]'}`}
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-[9px] text-[#80cbc4] font-light uppercase leading-none mb-0.5 tracking-tighter">Administrator</p>
                            <p className="text-[13px] font-normal leading-none">Super User</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-[#004d40] border-2 border-[#a7ffeb]/20 flex items-center justify-center text-[#a7ffeb] shadow-lg group">
                            <User size={18} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <ChevronDown size={14} className={`text-[#80cbc4] transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (    
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform origin-top-right transition-all">
                            <div className="bg-slate-50 p-4 border-b border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Signed in as</p>
                                <p className="text-sm font-black text-[#004d40]">admin@datatech.com</p>
                                <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-600 font-bold uppercase">
                                    <CheckCircle size={12} /> Account Active
                                </div>
                            </div>
                            <div className="p-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
                                        <LogOut size={16} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black">Logout System</p>
                                        <p className="text-[9px] font-bold text-rose-400 uppercase">Exit Secure Session</p>
                                    </div>
                                </button>
                            </div>
                            {/* <div className="bg-slate-50 px-4 py-2 border-t border-slate-100">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.1em] text-center">Version 2.4.0 • Secure Auth</p>
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
