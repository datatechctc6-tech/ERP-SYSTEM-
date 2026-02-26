import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ShieldCheck, X, KeyRound, RefreshCw, Save } from 'lucide-react';
import './AdminPin.css';

const AdminPin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPin: '',
        newPin: '',
        confirmPin: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.currentPin.length !== 4) {
            toast.error('Please enter current 4-digit PIN');
            return;
        }
        if (formData.newPin.length !== 4) {
            toast.error('Please enter a valid new 4-digit PIN');
            return;
        }
        if (formData.newPin !== formData.confirmPin) {
            toast.error('New PIN and Confirm PIN do not match');
            return;
        }
        console.log('Admin PIN Updated:', formData);
        toast.success('Admin PIN updated successfully!');
        navigate('/dashboard/1');
    };

    const handleClear = () => {
        setFormData({ currentPin: '', newPin: '', confirmPin: '' });
    };

    const PinInputGroup = ({ label, name, value }) => (
        <div className="ap-input-group flex items-center gap-3 mb-2">
            <label className="ap-label w-36 flex-shrink-0 flex items-center gap-2 text-[12px] font-black text-[#004d40] uppercase tracking-tight">
                <KeyRound size={14} className="text-[#00695c]" />
                {label}
            </label>
            <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={value}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setFormData(prev => ({ ...prev, [name]: val }));
                }}
                placeholder="Enter 4-digit PIN"
                className="ap-input flex-1 h-10 bg-[#f8fafc] border-2 border-gray-300 focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none px-3 text-[14px] font-bold text-[#004d40] transition-all placeholder:font-normal rounded-lg shadow-sm"
            />
        </div>
    );

    return (
        <div className="admin-pin-page h-full w-full bg-[#f0f4f4] flex overflow-hidden">
            <Toaster position="top-right" />
            <div className="w-full h-full bg-white border-[2px] border-[#004d40] shadow-2xl rounded-lg overflow-hidden flex flex-col">

                {/* Header */}
                <div className="ap-header bg-[#004d40] px-4 py-2 text-white flex items-center justify-between h-12 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-[#a7ffeb]" />
                        <h1 className="ap-title text-sm font-black tracking-widest uppercase">Admin Pin</h1>
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
                    <div className="ap-form-container flex-1 flex items-center justify-center p-6 text-gray-800">
                        <div className="ap-card w-full max-w-lg">
                            <div className="border border-gray-200 rounded-md p-6 shadow-lg bg-white">
                                <h2 className="ap-section-title text-[14px] font-black text-[#00695c] uppercase tracking-[0.2em] mb-5 flex items-center gap-1.5 border-b border-gray-50 pb-2 text-[#004d40]">
                                    <span className="w-1 h-3 bg-[#004d40] rounded-full"></span>
                                    Change Admin PIN
                                </h2>

                                <PinInputGroup label="Current Pin" name="currentPin" value={formData.currentPin} />
                                <PinInputGroup label="New Pin" name="newPin" value={formData.newPin} />
                                <PinInputGroup label="Confirm Pin" name="confirmPin" value={formData.confirmPin} />

                                {/* Save & Clear Buttons */}
                                <div className="flex items-center justify-end gap-2 mt-5">
                                    <button
                                        type="submit"
                                        className="ap-footer-btn h-7 px-4 bg-[#004d40] hover:bg-[#00332e] text-white rounded flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                    >
                                        <Save size={14} />
                                        <span className="ap-btn-text text-[10px] font-black uppercase tracking-widest">Save</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="ap-footer-btn h-7 px-4 bg-[#004d40] hover:bg-[#00332e] text-white rounded flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                    >
                                        <RefreshCw size={14} />
                                        <span className="ap-btn-text text-[10px] font-black uppercase tracking-widest">Clear</span>
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

export default AdminPin;
