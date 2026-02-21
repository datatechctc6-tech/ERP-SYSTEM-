import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useLayout } from './LayoutContext';

const Header = () => {
    const { toggleSidebar, isPinned } = useLayout();

    return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#004d40] text-white flex items-center px-4 z-50 shadow-md">
            <button
                onClick={toggleSidebar}
                className={`p-2 hover:bg-[#00332e] rounded-lg transition-colors mr-3 ${isPinned ? 'bg-[#00332e] text-[#a7ffeb]' : ''}`}
            >
                <Menu size={20} />
            </button>

            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-[#004d40] font-black italic text-xs">DT</span>
                </div>
                <h1 className="text-xl font-black tracking-tighter uppercase hidden sm:block">
                    DATATECH ERP <span className="text-[#a7ffeb]">System</span>
                </h1>
            </div>

            <div className="ml-auto flex items-center gap-3">
                <button className="p-2 hover:bg-[#00332e] rounded-lg transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#004d40]"></span>
                </button>
                <div className="h-8 w-[1px] bg-[#00695c] mx-1"></div>
                <div className="flex items-center gap-2 pl-2">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] text-[#80cbc4] font-bold uppercase leading-none mb-0.5">Administrator</p>
                        <p className="text-sm font-black leading-none">Super User</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#00332e] border border-[#00695c] flex items-center justify-center text-[#a7ffeb]">
                        <User size={18} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
