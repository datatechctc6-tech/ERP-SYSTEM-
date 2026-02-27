import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Search, Edit2, Trash2 } from 'lucide-react';

const WorkList = () => {
    const navigate = useNavigate();
    const [isAddMode, setIsAddMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [formData, setFormData] = useState({
        id: '',
        work_name: '',
        desc: '',
        work_code: ''
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

    const [works, setWorks] = useState([]);
    const [editId, setEditId] = useState(null);

    const fetchWorks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/works', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWorks(data);
            }
        } catch (err) {
            console.error('Error fetching works:', err);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    const filteredWorks = works.filter(work =>
        (work.WORK_NAME || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (work.WORK_CODE || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setSelectedIndex(0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(filteredWorks.length - 1, prev + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(0, prev - 1));
        }
    };

    const handleAction = (type) => {
        if (type === 'ADD') {
            setFormData({
                id: '',
                work_name: '',
                desc: '',
                work_code: ''
            });
            setEditId(null);
            setIsAddMode(true);
        } else if (type === 'EXIT' || type === 'CLOSE') {
            if (isAddMode) {
                setIsAddMode(false);
                setEditId(null);
            } else {
                navigate(-1);
            }
        }
    };

    const handleSave = async () => {
        if (!formData.work_name.trim()) {
            toast.error('Please enter Work Name');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const url = editId ? `http://localhost:5000/api/works/${editId}` : 'http://localhost:5000/api/works';
            const method = editId ? 'PUT' : 'POST';

            const payload = {
                WORK_NAME: formData.work_name,
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
                toast.success(editId ? 'Work updated successfully!' : 'Work created successfully!');
                fetchWorks();
                setFormData({ id: '', work_name: '', desc: '', work_code: '' });
                setIsAddMode(false);
                setEditId(null);
            } else {
                toast.error(data.error || 'Failed to save work');
            }
        } catch (err) {
            console.error(err);
            toast.error('Server error. Backend is not responding.');
        }
    };

    const handleEdit = (work) => {
        setFormData({
            ...formData,
            work_name: work.WORK_NAME,
            desc: work.DESCRIPTION,
            work_code: work.WORK_CODE
        });
        setEditId(work.ID || work.SL_NO);
        setIsAddMode(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this work?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/works/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchWorks();
            } else {
                toast.error('Failed to delete work');
            }
        } catch (err) {
            console.error('Error deleting work:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
            <Toaster position="top-right" />
            <div className={`bg-white border-2 border-[#00695c] shadow-2xl rounded-lg overflow-hidden flex flex-col transition-all duration-300 ${isAddMode ? 'w-[750px]' : 'w-[650px]'}`}>

                {/* Header */}
                <div className="bg-[#00695c] px-4 py-2 flex items-center justify-between text-white">
                    <span className="text-sm font-bold uppercase tracking-wider">
                        {isAddMode ? 'ADD WORK' : 'SELECT WORK'}
                    </span>
                    <button onClick={() => handleAction('EXIT')} className="hover:bg-[#004d40] p-1 rounded transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                </div>

                <div className="p-1 bg-white">
                    {/* Add Mode Form Section */}
                    {isAddMode && (
                        <div className="bg-white p-4 border border-[#b2dfdb] mb-1 animate-fadeIn">
                            <h2 className="text-center font-serif text-lg font-bold mb-4 border-b border-gray-200 pb-2">WORK MASTER</h2>
                            <div className="space-y-3 px-4">
                                <div className="flex items-center gap-4">
                                    <label className="text-xs font-black uppercase w-20">NAME</label>
                                    <input
                                        ref={nameInputRef}
                                        type="text"
                                        value={formData.work_name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setFormData({ ...formData, work_name: name });
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
                                        value={formData.work_code}
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
                                    placeholder="Search Work..."
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
                                    <th className="border border-[#00332e] px-3 py-1.5 text-left">WORK NAME</th>
                                    <th className="border border-[#00332e] px-3 py-1.5 text-left">DESCRIPTION</th>
                                    <th className="border border-[#00332e] px-2 py-1.5 text-center w-20">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWorks.map((work, index) => (
                                    <tr
                                        key={work.ID || work.SL_NO}
                                        className={`text-[12px] ${index === selectedIndex ? 'bg-[#fdd55ce1] border-y border-[#00695c]' : 'hover:bg-gray-50'}`}
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        <td className="border border-gray-100 px-2 py-1.5 font-medium">{work.WORK_CODE}</td>
                                        <td className="border border-gray-100 px-3 py-1.5 font-bold">{work.WORK_NAME}</td>
                                        <td className="border border-gray-100 px-3 py-1.5 text-gray-600">{work.DESCRIPTION}</td>
                                        <td className="border border-gray-100 px-2 py-1.5">
                                            <div className="flex justify-center gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); handleEdit(work); }} className="p-1 text-[#00695c] hover:bg-[#e0f2f1] rounded"><Edit2 size={12} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(work.ID || work.SL_NO); }} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={12} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {/* Empty rows */}
                                {[...Array(Math.max(0, 10 - filteredWorks.length))].map((_, i) => (
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
                            onClick={() => isAddMode ? handleSave() : handleAction('ADD')}
                            onKeyDown={(e) => {
                                if (isAddMode && e.key === 'ArrowUp') { e.preventDefault(); descInputRef.current?.focus(); }
                                if (isAddMode && e.key === 'Enter') { e.preventDefault(); handleSave(); }
                            }}
                            className="bg-[#00695c] hover:bg-[#004d40] text-white text-[10px] font-black px-6 h-8 flex items-center justify-center rounded-sm transition-transform active:scale-95 uppercase"
                        >
                            {isAddMode ? 'SAVE' : 'ADD'}
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

export default WorkList;
