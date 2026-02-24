import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Search } from 'lucide-react';

const CompanyList = () => {
    const navigate = useNavigate();
    const [selectedRow, setSelectedRow] = useState(0);
    const selectedRowRef = useRef(0);

    // Keep ref in sync with state for the event listener
    useEffect(() => {
        selectedRowRef.current = selectedRow;
    }, [selectedRow]);

    const columns = [
        "COMPANY NAME", "CODE", "F-DATE", "L-DATE", "ADDRESS 1", "ADDRESS 2", "COMP", "DRIVE", "REGD NO"
    ];

    const data = [
        { id: 1, name: "AMAN KUMAR", code: "s.amku_26", fdate: "2025-04-01", ldate: "2026-03-31", addr1: "RAMPUR", addr2: "ODISHA", comp: "MAIN", drive: "C:", regd: "REG123" },
        { id: 2, name: "INDIAN MEDICAL STORE", code: "I24", fdate: "2024-04-01", ldate: "2025-03-31", addr1: "AT/PO JAJPUR ROAD", addr2: "ODISHA", comp: "BRANCH", drive: "D:", regd: "REG456" },
        { id: 3, name: "HERITAGE HEALTHCARE HOSPITAL", code: "H24", fdate: "2024-04-01", ldate: "2025-03-31", addr1: "CHANDINI CHOWK", addr2: "CUTTACK", comp: "MAIN", drive: "E:", regd: "REG789" },
        { id: 4, name: "JYOTI MEDICAL STORE", code: "J25", fdate: "2025-04-01", ldate: "2026-03-31", addr1: "NIMASAHI", addr2: "BUXIBAZAR", comp: "BRANCH", drive: "F:", regd: "REG101" },
        { id: 5, name: "PANDA PHARMACEUTICALS", code: "P25", fdate: "2025-04-01", ldate: "2026-03-31", addr1: "KHADIANGA", addr2: "ODISHA", comp: "MAIN", drive: "G:", regd: "REG202" },
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedRow(prev => Math.min(prev + 1, data.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedRow(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const currentData = data[selectedRowRef.current];
                if (currentData) {
                    navigate(`/dashboard/${currentData.id}`, { state: { fromLogin: true } });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [data, navigate]);

    const buttons = [
        { label: "ADD" },
        { label: "MODIFY" },
        { label: "VIEW" },
        { label: "DELETE" },
        { label: "PRINT" },
        { label: "HIDE" },
        { label: "FIND" },
        { label: "SELECT", onClick: () => navigate(`/dashboard/${data[selectedRow]?.id || 1}`, { state: { fromLogin: true } }) },
        { label: "IMPORT" },
        { label: "EXIT", onClick: () => navigate('/') },
    ];

    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* Table Frame */}
            <div className="w-full max-w-[950px] border-[3px] border-[#004d40] bg-[#004d40] flex flex-col shadow-2xl overflow-hidden rounded-md">

                {/* Top Header Bar - Re-designed Search Bar */}
                <div className="flex items-center px-4 py-2 bg-[#004d40] border-b border-[#00695c]">
                    <div className="flex items-center flex-1 max-w-xs gap-2 bg-[#00332e] rounded-md px-3 py-1.5 border border-[#00695c] shadow-inner">
                        <Search size={14} className="text-[#a7ffeb]" />
                        <input
                            type="text"
                            placeholder="SEARCH COMPANY..."
                            className="bg-transparent border-none outline-none text-[12px] text-white font-bold w-full placeholder:text-[#00695c]"
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <div
                            onClick={() => navigate('/company-registration')}
                            className="w-7 h-7 rounded bg-[#00332e] border border-[#00695c] flex items-center justify-center hover:bg-[#004d40] transition-colors cursor-pointer text-[#a7ffeb]"
                        >
                            <Plus size={16} />
                        </div>
                        <div
                            onClick={() => navigate('/')}
                            className="w-7 h-7 rounded bg-[#00332e] border border-[#00695c] flex items-center justify-center hover:bg-red-900 transition-colors cursor-pointer text-[#a7ffeb]"
                        >
                            <X size={16} />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col p-1 bg-white flex-1 overflow-hidden">

                    {/* Table Area - With Full Border Grid */}
                    <div className="overflow-x-auto border border-[#004d40] bg-white min-h-[300px] scrollbar-thin scrollbar-thumb-teal-700 scrollbar-track-gray-200">
                        <table className="w-full border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="sticky top-0 z-10">
                                    {columns.map((col, idx) => (
                                        <th key={idx} className="bg-[#004d40] border border-[#00695c] px-3 py-2 text-left text-[13px] font-extrabold text-[#e0f2f1] tracking-wider uppercase whitespace-nowrap">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, idx) => (
                                    <tr
                                        key={row.id}
                                        onClick={() => setSelectedRow(idx)}
                                        onDoubleClick={() => navigate(`/dashboard/${row.id}`, { state: { fromLogin: true } })}
                                        className={`
                                            cursor-pointer transition-colors duration-200 border-b border-gray-100
                                            ${selectedRow === idx ? 'bg-yellow-300 text-black font-bold' : 'bg-white text-gray-700 font-medium'}
                                        `}
                                    >
                                        <td className="px-3 py-2 text-[14px] whitespace-nowrap border border-gray-200">{row.name}</td>
                                        <td className="px-3 py-2 text-[14px] font-mono whitespace-nowrap border border-gray-200">{row.code}</td>
                                        <td className="px-3 py-2 text-[14px] whitespace-nowrap border border-gray-200">{row.fdate}</td>
                                        <td className="px-3 py-2 text-[14px] whitespace-nowrap border border-gray-200">{row.ldate}</td>
                                        <td className="px-3 py-2 text-[14px] uppercase whitespace-nowrap border border-gray-200">{row.addr1}</td>
                                        <td className="px-3 py-2 text-[14px] uppercase whitespace-nowrap border border-gray-200">{row.addr2}</td>
                                        <td className="px-3 py-2 text-[14px] uppercase whitespace-nowrap border border-gray-200">{row.comp}</td>
                                        <td className="px-3 py-2 text-[14px] font-mono text-amber-800 whitespace-nowrap border border-gray-200">{row.drive}</td>
                                        <td className="px-3 py-2 text-[14px] font-mono whitespace-nowrap border border-gray-200">{row.regd}</td>
                                    </tr>
                                ))}
                                {/* Empty space with grid lines */}
                                {[...Array(Math.max(0, 10 - data.length))].map((_, i) => (
                                    <tr key={`empty-${i}`} className="h-[32px]">
                                        {[...Array(columns.length)].map((_, j) => (
                                            <td key={`empty-cell-${j}`} className="border border-gray-100"></td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Area - Monochromatic Teal Buttons */}
                    <div className="bg-[#004d40] flex gap-1 p-2 mt-1 overflow-x-auto select-none no-scrollbar">
                        {buttons.map((btn, idx) => (
                            <button
                                key={idx}
                                onClick={btn.label === 'ADD' ? () => navigate('/company-registration') : (btn.onClick || (() => { }))}
                                className="flex-1 min-w-[60px] h-8 bg-[#004d40] hover:bg-[#00332e] text-white text-[12px] font-bold tracking-wider border border-[#00695c] rounded-md flex items-center justify-center transition-all active:brightness-90 shadow-sm"
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyList;
