import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Search, Edit2, Trash2 } from 'lucide-react';

const ZoneList = () => {
    const navigate = useNavigate();
    const [isAddMode, setIsAddMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [formData, setFormData] = useState({
        id: '',
        zone_name: '',
        desc: '',
        zone_code: ''
    });

    const searchInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const descInputRef = useRef(null);
    const saveBtnRef = useRef(null);

    useEffect(() => {
        if (!isAddMode && searchInputRef.current) {
            searchInputRef.current.focus();
        } else if (isAddMode && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [isAddMode]);

    const [zones, setZones] = useState([]);
    const [editId, setEditId] = useState(null);

    const fetchZones = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/zones', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setZones(data);
            }
        } catch (err) {
            console.error('Error fetching zones:', err);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    const filteredZones = zones.filter(z =>
        (z.ZONE_NAME || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (z.ZONE_CODE || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setSelectedIndex(0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(filteredZones.length - 1, prev + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(0, prev - 1));
        }
    };

    const handleAction = (type) => {
        if (type === 'ADD') {
            setFormData({
                id: '',
                zone_name: '',
                desc: '',
                zone_code: ''
            });
            setEditId(null);
            setIsAddMode(true);
        } else if (type === 'EXIT' || type === 'CLOSE') {
            if (isAddMode) {
                setIsAddMode(false);
                setEditId(null);
                setSearchTerm('');
            } else {
                navigate(-1);
            }
        }
    };

    const handleSave = async () => {
        if (!formData.zone_name) {
            toast.error('Please enter Zone No');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const url = editId ? `http://localhost:5000/api/zones/${editId}` : 'http://localhost:5000/api/zones';
            const method = editId ? 'PUT' : 'POST';

            const payload = {
                ZONE_NAME: formData.zone_name,
                DESCRIPTION: formData.desc
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(editId ? 'Zone updated successfully!' : 'Zone created successfully!');
                fetchZones();
                setFormData({ id: '', zone_name: '', desc: '', zone_code: '' });
                setIsAddMode(false);
                setEditId(null);
                setSearchTerm('');
            } else {
                toast.error(data.error || 'Failed to save zone');
            }
        } catch (err) {
            console.error(err);
            toast.error('Server error. Backend is not responding.');
        }
    };

    const handleEdit = (z) => {
        setFormData({
            ...formData,
            zone_name: z.ZONE_NAME,
            desc: z.DESCRIPTION,
            zone_code: z.ZONE_CODE
        });
        setEditId(z.ID || z.SL_NO);
        setIsAddMode(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this zone?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/zones/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchZones();
            } else {
                toast.error('Failed to delete zone');
            }
        } catch (err) {
            console.error('Error deleting zone:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
            <Toaster position="top-right" />
            <div className={`bg-white border-2 border-[#00695c] shadow-2xl rounded-lg overflow-hidden flex flex-col transition-all duration-300 ${isAddMode ? 'w-[750px]' : 'w-[650px]'}`}>

                {/* Header */}
                <div className="bg-[#00695c] px-4 py-2 flex items-center justify-between text-white">
                    <span className="text-sm font-bold uppercase tracking-wider">
                        {isAddMode ? 'ADD ZONE' : 'SELECT ZONE'}
                    </span>
                    <button onClick={() => handleAction('EXIT')} className="hover:bg-[#004d40] p-1 rounded transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                </div>

                <div className="p-1 bg-white">
                    {/* Add Mode Form Section */}
                    {isAddMode && (
                        <div className="bg-white p-4 border border-[#b2dfdb] mb-1 animate-fadeIn">
                            <h2 className="text-center font-serif text-lg font-bold mb-4 border-b border-gray-200 pb-2">ZONE MASTER</h2>
                            <div className="space-y-3 px-4">
                                <div className="flex items-center gap-4">
                                    <label className="text-xs font-black uppercase w-20">ZONE NO</label>
                                    <input
                                        ref={nameInputRef}
                                        type="number"
                                        value={formData.zone_name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setFormData({ ...formData, zone_name: name });
                                        }}
                                        className="flex-1 border border-gray-300 px-2 py-1 text-sm bg-white focus:bg-[#fdd55ce1] focus:text-black focus:outline-none focus:border-[#00695c]"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') { e.preventDefault(); descInputRef.current?.focus(); }
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="text-xs font-black uppercase w-20">CODE<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.zone_code}
                                        readOnly
                                        placeholder="AUTO"
                                        className="w-24 border border-gray-300 px-2 py-1 text-sm bg-gray-50 uppercase"
                                    />
                                    <label className="text-xs font-black uppercase w-16 ml-4">DESC</label>
                                    <input
                                        ref={descInputRef}
                                        type="text"
                                        value={formData.desc}
                                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                        placeholder="Description..."
                                        className="flex-1 border border-gray-300 px-2 py-1 text-sm bg-white focus:bg-[#fdd55ce1] focus:text-black focus:outline-none focus:border-[#00695c]"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') { e.preventDefault(); saveBtnRef.current?.focus(); }
                                            if (e.key === 'ArrowUp') { e.preventDefault(); nameInputRef.current?.focus(); }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search Section (List Mode) */}
                    {!isAddMode && (
                        <div className="bg-white p-1">
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search Zone..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full border border-[#b2dfdb] px-3 py-1.5 text-[12px] font-bold text-slate-700 transition-all focus:outline-none focus:bg-[#cff2f3e1] focus:text-black placeholder:italic placeholder:text-slate-500 placeholder:font-normal bg-[#cff2f3e1]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Table Section */}
                    <div className="bg-white border border-[#b2dfdb] h-64 overflow-auto flex flex-col">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-[#004d40] text-white z-10">
                                <tr className="text-[11px] font-black uppercase tracking-wider">
                                    <th className="border border-[#00332e] px-2 py-1.5 text-left w-16">CODE</th>
                                    <th className="border border-[#00332e] px-3 py-1.5 text-left">ZONE NO</th>
                                    <th className="border border-[#00332e] px-3 py-1.5 text-left">DESCRIPTION</th>
                                    <th className="border border-[#00332e] px-2 py-1.5 text-center w-20">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredZones.map((z, index) => (
                                    <tr
                                        key={z.ID || z.SL_NO}
                                        className={`text-[12px] ${index === selectedIndex ? 'bg-[#fdd55ce1] border-y border-[#00695c]' : 'hover:bg-gray-50'}`}
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        <td className="border border-gray-100 px-2 py-1.5 font-medium">{z.ZONE_CODE}</td>
                                        <td className="border border-gray-100 px-3 py-1.5 font-bold">{z.ZONE_NAME}</td>
                                        <td className="border border-gray-100 px-3 py-1.5 text-gray-600">{z.DESCRIPTION}</td>
                                        <td className="border border-gray-100 px-2 py-1.5">
                                            <div className="flex justify-center gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); handleEdit(z); }} className="p-1 text-[#00695c] hover:bg-[#e0f2f1] rounded"><Edit2 size={12} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(z.ID || z.SL_NO); }} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={12} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {/* Empty rows */}
                                {[...Array(Math.max(0, 10 - filteredZones.length))].map((_, i) => (
                                    <tr key={`empty-${i}`} className="h-8">
                                        <td className="border border-gray-100 px-2 py-1.5"></td>
                                        <td className="border border-gray-100 px-3 py-1.5"></td>
                                        <td className="border border-gray-100 px-3 py-1.5"></td>
                                        <td className="border border-gray-100 px-2 py-1.5"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-white p-2 border-t border-[#b2dfdb]">
                    <div className="flex gap-2 justify-end pr-2">
                        <button
                            ref={saveBtnRef}
                            onClick={() => {
                                if (isAddMode) {
                                    handleSave();
                                } else {
                                    handleAction('ADD');
                                }
                            }}
                            onKeyDown={(e) => {
                                if (isAddMode && e.key === 'ArrowUp') { e.preventDefault(); descInputRef.current?.focus(); }
                                if (isAddMode && e.key === 'Enter') { e.preventDefault(); handleSave(); }
                            }}
                            className="bg-[#00695c] hover:bg-[#004d40] text-white text-[10px] font-black px-6 h-8 flex items-center justify-center rounded-sm transition-transform active:scale-95 uppercase"
                        >
                            {isAddMode ? 'ADD' : 'ADD'}
                        </button>
                        <button
                            onClick={() => handleAction('EXIT')}
                            className="bg-[#00695c] hover:bg-red-700 text-white text-[10px] font-black px-6 h-8 flex items-center justify-center rounded-sm transition-transform active:scale-95 uppercase"
                        >
                            EXIT
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ZoneList;
