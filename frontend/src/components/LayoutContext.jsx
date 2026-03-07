import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [isPinned, setIsPinned] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isTopNav, setIsTopNav] = useState(false); // Controls Top Navigation mode

    const toggleSidebar = () => setIsPinned(prev => !prev);
    const setHover = (value) => setIsHovered(value);
    const toggleNavMode = () => setIsTopNav(prev => !prev); // Toggle function

    const isSidebarOpen = isPinned || isHovered;

    return (
        <LayoutContext.Provider value={{ isSidebarOpen, isPinned, toggleSidebar, setHover, isTopNav, toggleNavMode }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => useContext(LayoutContext);
