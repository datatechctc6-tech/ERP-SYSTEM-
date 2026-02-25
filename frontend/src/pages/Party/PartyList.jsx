import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, MapPin, Phone, User, MoreVertical, XCircle } from 'lucide-react';
import './PartyList.css';

const PartyList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchInputRef = useRef(null);

    // Always keep focus on the search bar
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }

        const handleFocusOut = () => {
            setTimeout(() => {
                if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 0);
        };

        document.addEventListener('click', handleFocusOut);
        document.addEventListener('focusin', handleFocusOut);

        return () => {
            document.removeEventListener('click', handleFocusOut);
            document.removeEventListener('focusin', handleFocusOut);
        };
    }, []);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setSelectedIndex(0); // Reset selection on search
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(filteredParties.length - 1, prev + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'Enter') {
            // Optional: Action on Enter (e.g., edit or select)
            if (filteredParties[selectedIndex]) {
                console.log('Selected:', filteredParties[selectedIndex]);
            }
        }
    };

    // Mock data for demonstration
    const parties = [
        { id: 1, name: 'Sample Party 1', address: 'Bhubaneswar, Odisha', mobile: '9876543210' },
        { id: 2, name: 'Sample Party 2', address: 'Cuttack, Odisha', mobile: '9123456789' },
        { id: 3, name: 'Sample Party 3', address: 'Rourkela, Odisha', mobile: '8877665544' },
    ];

    const filteredParties = parties.filter(party =>
        party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        party.mobile.includes(searchTerm)
    );

    return (
        <div className="partylist-page h-full w-full bg-[#f0f4f4] flex overflow-hidden">
            <div className="w-full h-full bg-white border-[2px] border-[#004d40] shadow-2xl rounded-lg overflow-hidden flex flex-col">

                {/* Page Header */}
                <div className="pl-header bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="pl-icon-box bg-[#004d40] p-2 rounded-lg text-white">
                            <User size={20} />
                        </div>
                        <div>
                            <h1 className="pl-page-title text-lg font-black text-[#004d40] uppercase tracking-wider">Party Management</h1>
                            <p className="pl-page-subtitle text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Manage your business partners and accounts</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                ref={searchInputRef}
                                placeholder="Search by name or mobile..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="pl-search-input pl-10 pr-4 py-2 bg-[#f8fafc] border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#004d40] focus:bg-yellow-100 focus:text-black focus:placeholder:text-black w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="flex-1 overflow-auto p-2">
                    <div className="bg-white rounded shadow-sm border border-gray-300 overflow-hidden">
                        <table className="w-full text-left border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-[#004d40] text-white">
                                    <th className="pl-th px-3 py-2 text-[11px] font-black uppercase tracking-widest border border-[#00332e]">Party Name</th>
                                    <th className="pl-th px-3 py-2 text-[11px] font-black uppercase tracking-widest border border-[#00332e]">Address</th>
                                    <th className="pl-th px-3 py-2 text-[11px] font-black uppercase tracking-widest border border-[#00332e]">Mobile</th>
                                    <th className="pl-th px-3 py-2 text-[11px] font-black uppercase tracking-widest border border-[#00332e] text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredParties.map((party, index) => (
                                    <tr
                                        key={party.id}
                                        className={`transition-colors ${index === selectedIndex
                                            ? 'bg-yellow-100 border-y-2 z-10 relative'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <td className="pl-td px-3 py-2 border border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <div className="pl-avatar w-6 h-6 rounded-full bg-[#004d401a] flex items-center justify-center text-[#004d40] font-bold text-[10px] uppercase">
                                                    {party.name.charAt(0)}
                                                </div>
                                                <span className="pl-td-name text-[12px] font-bold text-gray-800">{party.name}</span>
                                            </div>
                                        </td>
                                        <td className="pl-td px-3 py-2 pl-td-text text-[11px] text-gray-600 font-medium border border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={12} className="text-gray-400" />
                                                {party.address}
                                            </div>
                                        </td>
                                        <td className="pl-td px-3 py-2 pl-td-text text-[11px] text-gray-600 font-bold border border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <Phone size={12} className="text-gray-400" />
                                                {party.mobile}
                                            </div>
                                        </td>
                                        <td className="pl-td px-3 py-2 border border-gray-200">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => navigate(`/party/edit/${party.id}`, { state: { party } })} className="p-1 text-blue-600 hover:bg-blue-50 rounded border border-blue-100 transition-colors" title="Edit">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button className="p-1 text-red-600 hover:bg-red-50 rounded border border-red-100 transition-colors" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                                {/* <button className="p-1 text-gray-600 hover:bg-gray-50 rounded border border-gray-100 transition-colors">
                                                    <MoreVertical size={14} />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredParties.length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                                <User size={48} strokeWidth={1} className="mb-4 opacity-20" />
                                <p className="pl-empty-text text-sm font-medium">No parties found matching your search</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer / Create Action */}
                <div className="pl-footer bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={() => navigate('/dashboard/1')}
                        className="pl-footer-btn bg-[#004d40] hover:bg-red-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-95 group"
                    >
                        <XCircle size={18} className="group-hover:rotate-90 transition-transform" />
                        <span className="pl-btn-text text-sm font-black uppercase tracking-widest">Close</span>
                    </button>
                    <button
                        onClick={() => navigate('/party/create')}
                        className="pl-footer-btn bg-[#004d40] hover:bg-[#00332e] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-95 group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        <span className="pl-btn-text text-sm font-black uppercase tracking-widest">Create</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartyList;
