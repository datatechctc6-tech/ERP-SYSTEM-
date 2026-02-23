import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, X, KeyRound, RefreshCw, Save } from 'lucide-react';

const AdminPin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPin: '',
        newPin: '',
        confirmPin: ''
    });

    const handlePinChange = (name, index, value) => {
        const val = value.replace(/\D/g, '');
        const newPin = formData[name].split('');
        newPin[index] = val;
        const joined = newPin.join('').slice(0, 4);
        setFormData(prev => ({ ...prev, [name]: joined }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.currentPin.length !== 4) {
            alert('Please enter current 4-digit PIN');
            return;
        }
        if (formData.newPin.length !== 4) {
            alert('Please enter a valid new 4-digit PIN');
            return;
        }
        if (formData.newPin !== formData.confirmPin) {
            alert('New PIN and Confirm PIN do not match');
            return;
        }
        console.log('Admin PIN Updated:', formData);
        alert('Admin PIN updated successfully!');
        navigate('/dashboard/1');
    };

    const handleClear = () => {
        setFormData({ currentPin: '', newPin: '', confirmPin: '' });
    };

    const PinInputGroup = ({ label, name, value }) => (
        <div className="flex items-center gap-3 mb-4">
            <label className="w-36 flex-shrink-0 flex items-center gap-2 text-[12px] font-black text-[#004d40] uppercase tracking-tight">
                <KeyRound size={14} className="text-[#00695c]" />
                {label}
            </label>
            <div className="flex-1 flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                    <input
                        key={i}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        value={value[i] || ''}
                        onChange={(e) => {
                            handlePinChange(name, i, e.target.value);
                            if (e.target.value.replace(/\D/g, '') && i < 3) {
                                const next = e.target.parentElement.querySelectorAll('input')[i + 1];
                                if (next) next.focus();
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !value[i] && i > 0) {
                                const prev = e.target.parentElement.querySelectorAll('input')[i - 1];
                                if (prev) prev.focus();
                            }
                        }}
                        className="w-12 h-12 bg-[#f8fafc] border-2 border-gray-300 focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none text-center text-[20px] font-black text-[#004d40] transition-all rounded-lg shadow-sm"
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="h-full w-full bg-[#f0f4f4] flex overflow-hidden">
            <div className="w-full h-full bg-white border-[2px] border-[#004d40] shadow-2xl rounded-lg overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-[#004d40] px-4 py-2 text-white flex items-center justify-between h-12 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-[#a7ffeb]" />
                        <h1 className="text-sm font-black tracking-widest uppercase">Admin Pin</h1>
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
                                    Change Admin PIN
                                </h2>

                                <PinInputGroup label="Current Pin" name="currentPin" value={formData.currentPin} />
                                <PinInputGroup label="New Pin" name="newPin" value={formData.newPin} />
                                <PinInputGroup label="Confirm Pin" name="confirmPin" value={formData.confirmPin} />

                                {/* Save & Clear Buttons */}
                                <div className="flex items-center justify-end gap-2 mt-5">
                                    <button
                                        type="submit"
                                        className="h-8 px-5 bg-[#004d40] hover:bg-[#00332e] text-white rounded flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                    >
                                        <Save size={14} />
                                        <span className="text-[11px] font-black uppercase tracking-widest">Save</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="h-8 px-5 bg-white border border-gray-300 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                    >
                                        <RefreshCw size={14} />
                                        <span className="text-[11px] font-black uppercase tracking-widest">Clear</span>
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
