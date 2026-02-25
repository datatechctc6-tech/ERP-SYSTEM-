import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Edit2, Trash2 } from 'lucide-react';

const DeptList = () => {
    const navigate = useNavigate();
    const [isAddMode, setIsAddMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [formData, setFormData] = useState({
        Sl_No: '',
        t_v_date: '',
        dept_Name: '',
        desc: '',
        dept_code: ''
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

    // Mock data
    const [departments, setDepartments] = useState([
        { id: '01', code: 'D01', name: 'CRUSHER QUARRY ADI' },
        { id: '02', code: 'D02', name: 'CRUSHER' },
        { id: '03', code: 'D03', name: 'RAISING' },
        { id: '04', code: 'D04', name: "CRUSHER'MORRUM & SOIL" },
        { id: '05', code: 'D05', name: 'RAMCO' },
        { id: '06', code: 'D06', name: 'R&B' },
    ]);

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setSelectedIndex(0); // Reset selection on search
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(filteredDepartments.length - 1, prev + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'Enter') {
            if (filteredDepartments[selectedIndex]) {
                // Future: Action on Enter
                console.log('Selected:', filteredDepartments[selectedIndex]);
            }
        }
    };

    const handleAction = (type) => {
        if (type === 'ADD') {
            const nextSlNo = departments.length + 1;
            const today = new Date().toISOString().split('T')[0];
            setFormData({
                Sl_No: nextSlNo,
                t_v_date: today,
                dept_Name: '',
                desc: '',
                dept_code: ''
            });
            setIsAddMode(true);
        } else if (type === 'EXIT' || type === 'CLOSE') {
            if (isAddMode) setIsAddMode(false);
            else navigate(-1);
        }
    };

    const handleSave = async () => {
        if (!formData.dept_Name.trim()) {
            alert('Please enter Department Name');
            return;
        }
        try {
            const res = await fetch('http://localhost:4000/create/dep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                alert('Department created successfully!');
                setDepartments(prev => [...prev, {
                    id: String(formData.Sl_No).padStart(2, '0'),
                    code: formData.dept_code,
                    name: formData.dept_Name
                }]);
                setFormData({ Sl_No: '', t_v_date: '', dept_Name: '', desc: '', dept_code: '' });
                setIsAddMode(false);
            } else {
                alert(data.message || 'Failed to create department');
            }
        } catch (err) {
            console.error(err);
            alert('Server error. Is backend running on port 5000?');
        }
    };

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
            <div className={`bg-white border-2 border-[#00695c] shadow-2xl rounded-lg overflow-hidden flex flex-col transition-all duration-300 ${isAddMode ? 'w-[750px]' : 'w-[650px]'}`}>

                {/* Header */}
                <div className="bg-[#00695c] px-4 py-2 flex items-center justify-between text-white">
                    <span className="text-sm font-bold uppercase tracking-wider">
                        {isAddMode ? 'ADD DEPT' : 'SELECT DEPT'}
                    </span>
                    <button onClick={() => handleAction('EXIT')} className="hover:bg-[#004d40] p-1 rounded transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                </div>

                <div className="p-1 bg-white">
                    {/* Add Mode Form Section */}
                    {isAddMode && (
                        <div className="bg-white p-4 border border-[#b2dfdb] mb-1 animate-fadeIn">
                            <h2 className="text-center font-serif text-lg font-bold mb-4 border-b border-gray-200 pb-2">DEPARTMENT MASTER</h2>
                            <div className="space-y-3 px-4">
                                <div className="flex items-center gap-4">
                                    <label className="text-xs font-black uppercase w-20">NAME</label>
                                    <input
                                        ref={nameInputRef}
                                        type="text"
                                        value={formData.dept_Name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            let code = formData.dept_code;
                                            if (name.trim() && !formData.dept_code) {
                                                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                                                let randomCode = '';
                                                for (let i = 0; i < 4; i++) randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
                                                code = 'DEP' + randomCode;
                                            } else if (!name.trim()) {
                                                code = '';
                                            }
                                            setFormData({ ...formData, dept_Name: name, dept_code: code });
                                        }}
                                        className="flex-1 border border-gray-300 px-2 py-1 text-sm bg-yellow-100 focus:outline-none focus:border-[#00695c]"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') { e.preventDefault(); descInputRef.current?.focus(); }
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="text-xs font-black uppercase w-20">CODE<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.dept_code}
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
                                        className="flex-1 border border-gray-300 px-2 py-1 text-sm bg-yellow-100 focus:outline-none focus:border-[#00695c]"
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
                                    placeholder="Search Department..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full border border-[#b2dfdb] px-3 py-1.5 text-sm focus:outline-none focus:bg-yellow-100 placeholder:italic bg-white"
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
                                    <th className="border border-[#00332e] px-3 py-1.5 text-left">NAME</th>
                                    <th className="border border-[#00332e] px-2 py-1.5 text-center w-20">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDepartments.map((dept, index) => (
                                    <tr
                                        key={dept.id}
                                        className={`text-[12px] ${index === selectedIndex ? 'bg-yellow-50 border-y border-[#00695c]' : 'hover:bg-gray-50'}`}
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        <td className="border border-gray-100 px-2 py-1.5 font-medium">{dept.code}</td>
                                        <td className="border border-gray-100 px-3 py-1.5 font-bold">{dept.name}</td>
                                        <td className="border border-gray-100 px-2 py-1.5">
                                            <div className="flex justify-center gap-1">
                                                <button className="p-1 text-[#00695c] hover:bg-[#e0f2f1] rounded"><Edit2 size={12} /></button>
                                                <button className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={12} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {/* Empty rows */}
                                {[...Array(Math.max(0, 10 - filteredDepartments.length))].map((_, i) => (
                                    <tr key={`empty-${i}`} className="h-8">
                                        <td className="border border-gray-100 px-2 py-1.5"></td>
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

export default DeptList;
