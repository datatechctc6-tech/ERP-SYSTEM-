import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, X, User, Lock, KeyRound, Eye, EyeOff, RefreshCw } from 'lucide-react';

const UserCreate = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        pin: ''
    });
    const usernameRef = useRef(null);

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'pin') {
            // Only allow digits and max 6 characters
            const pinValue = value.replace(/\D/g, '').slice(0, 6);
            setFormData(prev => ({ ...prev, [name]: pinValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username.trim()) {
            toast.error('Please enter a username');
            return;
        }
        if (!formData.password.trim()) {
            toast.error('Please enter a password');
            return;
        }
        if (formData.pin.length !== 6) {
            toast.error('Please enter a valid 6-digit PIN');
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/set-pin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.username,
                    password: formData.password,
                    pin: formData.pin
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('PIN set successfully!');
                navigate('/settings/user-list');
            } else {
                toast.error(data.error || data.message || 'Failed to set PIN');
            }
        } catch (error) {
            console.error('Error setting PIN:', error);
            toast.error('An error occurred. Please check if the server is running.');
        }
    };

    const handleClear = () => {
        setFormData({ username: '', password: '', pin: '' });
    };

    return (
        <div className="h-full w-full bg-[#f0f4f4] flex overflow-hidden">
            <Toaster position="top-right" />
            <div className="w-full h-full bg-white border-[2px] border-[#004d40] shadow-2xl rounded-lg overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-[#004d40] px-4 py-2 text-white flex items-center justify-between h-12 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <UserPlus size={18} className="text-[#a7ffeb]" />
                        <h1 className="text-sm font-black tracking-widest uppercase">User Create</h1>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/1')}
                        className="w-8 h-8 rounded-full hover:bg-black/20 flex items-center justify-center transition-colors text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="w-full max-w-lg">
                            <div className="border border-gray-200 rounded-md p-6 shadow-lg">
                                <h2 className="text-[14px] font-black text-[#00695c] uppercase tracking-[0.2em] mb-5 flex items-center gap-1.5 border-b border-gray-50 pb-2">
                                    <span className="w-1 h-3 bg-[#004d40] rounded-full"></span>
                                    User Credentials
                                </h2>

                                {/* Username */}
                                <div className="flex items-center gap-1 mb-4">
                                    <label className="w-28 flex-shrink-0 flex items-center gap-2 text-[12px] font-black text-[#004d40] uppercase tracking-tight">
                                        <User size={14} className="text-[#00695c]" />
                                        Username
                                    </label>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            placeholder="Enter username..."
                                            ref={usernameRef}
                                            className="w-full bg-[#f8fafc] border border-gray-300 focus:border-[#004d40] focus:bg-[#fdd55ce1] outline-none px-3 py-2 text-[13px] font-bold text-gray-800 transition-all placeholder:text-gray-300 placeholder:font-normal rounded shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="flex items-center gap-1 mb-4">
                                    <label className="w-28 flex-shrink-0 flex items-center gap-2 text-[12px] font-black text-[#004d40] uppercase tracking-tight">
                                        <Lock size={14} className="text-[#00695c]" />
                                        Password
                                    </label>
                                    <div className="flex-1 relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter password..."
                                            className="w-full bg-[#f8fafc] border border-gray-300 focus:border-[#004d40] focus:bg-[#fdd55ce1] outline-none px-3 py-2 pr-10 text-[13px] font-bold text-gray-800 transition-all placeholder:text-gray-300 placeholder:font-normal rounded shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004d40] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* 6-Digit PIN */}
                                <div className="flex items-center gap-1 mb-2">
                                    <label className="w-28 flex-shrink-0 flex items-center gap-2 text-[12px] font-black text-[#004d40] uppercase tracking-tight">
                                        <KeyRound size={14} className="text-[#00695c]" />
                                        6-Digit Pin
                                    </label>
                                    <div className="flex-1 flex gap-2">
                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={formData.pin[i] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    const newPin = formData.pin.split('');
                                                    newPin[i] = val;
                                                    const joined = newPin.join('').slice(0, 6);
                                                    setFormData(prev => ({ ...prev, pin: joined }));
                                                    // Auto-focus next input
                                                    if (val && i < 5) {
                                                        const next = e.target.parentElement.parentElement.querySelectorAll('input')[i + 1];
                                                        if (next) next.focus();
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !formData.pin[i] && i > 0) {
                                                        const prev = e.target.parentElement.parentElement.querySelectorAll('input')[i - 1];
                                                        if (prev) prev.focus();
                                                    }
                                                }}
                                                className="w-12 h-12 bg-[#f8fafc] border-2 border-gray-300 focus:border-[#004d40] focus:bg-[#fdd55ce1] outline-none text-center text-[20px] font-black text-[#004d40] transition-all rounded-lg shadow-sm"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Create & Clear Buttons */}
                                <div className="flex items-center justify-end gap-2 mt-5">
                                    <button
                                        type="submit"
                                        className="h-7 px-4 bg-[#004d40] hover:bg-[#00332e] text-white rounded flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                    >
                                        <UserPlus size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Create</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="h-7 px-4 bg-[#004d40] hover:bg-[#00332e] text-white rounded flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                    >
                                        <RefreshCw size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Clear</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserCreate;
