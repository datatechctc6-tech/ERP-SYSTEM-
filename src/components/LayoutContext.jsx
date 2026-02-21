import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [isPinned, setIsPinned] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleSidebar = () => setIsPinned(prev => !prev);
    const setHover = (value) => setIsHovered(value);

    const isSidebarOpen = isPinned || isHovered;

    return (
        <LayoutContext.Provider value={{ isSidebarOpen, isPinned, toggleSidebar, setHover }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => useContext(LayoutContext);
