import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { LayoutProvider, useLayout } from './LayoutContext';

const LayoutContent = () => {
    const { isSidebarOpen, isTopNav } = useLayout();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className={`flex flex-1 pt-14`}>
                {!isTopNav && <Sidebar />}
                <main className={`
                    flex-1 transition-all duration-300 ease-in-out p-3 overflow-x-hidden
                    ${!isTopNav ? (isSidebarOpen ? 'ml-64' : 'ml-16') : ''}
                `}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const MainLayout = () => {
    return (
        <LayoutProvider>
            <LayoutContent />
        </LayoutProvider>
    );
};

export default MainLayout;
