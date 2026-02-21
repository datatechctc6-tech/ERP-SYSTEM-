import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Save, Upload, User, MapPin, Phone, Mail, Map, Briefcase, Camera } from 'lucide-react';

const Party = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        phone: '',
        email: '',
        gramPanchayat: '',
        zone: '',
        designation: ''
    });
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        alert("Party created successfully!");
        navigate('/party');
    };

    const FormInput = ({ label, name, type = "text", placeholder, icon: Icon, isFullWidth = false }) => (
        <div className={`flex items-center gap-3 mb-2 ${isFullWidth ? 'col-span-full' : ''}`}>
            <label className="w-32 flex-shrink-0 flex items-center gap-2 text-[12px] font-black text-[#004d40] uppercase tracking-tight">
                {Icon && <Icon size={14} className="text-[#00695c]" />}
                {label}
            </label>
            <div className="flex-1">
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full bg-[#f8fafc] border border-gray-300 focus:border-[#004d40] focus:ring-1 focus:ring-[#004d40] outline-none px-3 py-2 text-[13px] font-bold text-gray-800 transition-all placeholder:text-gray-300 placeholder:font-normal rounded shadow-sm"
                />
            </div>
        </div>
    );

    return (
        <div className="h-full w-full bg-[#f0f4f4] flex overflow-hidden">
            {/* Full-Screen Form Container */}
            <div className="w-full h-full bg-white border-[2px] border-[#004d40] shadow-2xl rounded-lg overflow-hidden flex flex-col">

                {/* Compact Header */}
                <div className="bg-[#004d40] px-4 py-2 text-white flex items-center justify-between h-12 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <User size={18} className="text-[#a7ffeb]" />
                        <h1 className="text-sm font-black tracking-widest uppercase">GP HOLDER MASTER</h1>
                    </div>
                    <button
                        onClick={() => navigate('/party')}
                        className="w-8 h-8 rounded-full hover:bg-black/20 flex items-center justify-center transition-colors text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-3 flex flex-col h-full overflow-hidden">
                    <div className="flex flex-row gap-6 h-full">

                        {/* Main Form Fields - 3 Column Layout */}
                        <div className="flex-[3] flex flex-col gap-3 overflow-hidden">

                            {/* General Section */}
                            <div className="border border-gray-100 rounded-md p-3">
                                <h2 className="text-[11px] font-black text-[#00695c] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 border-b border-gray-50 pb-1">
                                    <span className="w-1 h-3 bg-[#004d40] rounded-full"></span>
                                    Core Details
                                </h2>
                                <div className="grid grid-cols-2 gap-x-6">
                                    <FormInput label="Full Name" name="name" icon={User} placeholder="Party full name..." />
                                    <FormInput label="Address" name="address" icon={MapPin} placeholder="Street, Area details..." />
                                    <FormInput label="Pincode" name="pincode" type="number" icon={Map} placeholder="6-digit" />
                                    <FormInput label="City" name="city" icon={Map} placeholder="e.g. Cuttack" />
                                    <FormInput label="State" name="state" icon={Map} placeholder="e.g. Odisha" />
                                    <FormInput label="Phone" name="phone" type="tel" icon={Phone} placeholder="Mobile number" />
                                </div>
                            </div>

                            {/* Categorization Section */}
                            <div className="border border-gray-100 rounded-md p-3">
                                <h2 className="text-[11px] font-black text-[#00695c] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 border-b border-gray-50 pb-1">
                                    <span className="w-1 h-3 bg-[#004d40] rounded-full"></span>
                                    Classification
                                </h2>
                                <div className="grid grid-cols-2 gap-x-6">
                                    <FormInput label="Email ID" name="email" type="email" icon={Mail} placeholder="name@email.com" />
                                    <FormInput label="Panchayat" name="gramPanchayat" icon={Briefcase} placeholder="Gram Panchayat" />
                                    <FormInput label="Zone" name="zone" icon={Briefcase} placeholder="Zone / Area" />
                                    <FormInput label="Designation" name="designation" icon={Briefcase} placeholder="e.g. Proprietor" />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Photo */}
                        <div className="flex-1 min-w-[200px] flex flex-col gap-4 border-l border-gray-50 pl-6 h-full p-4">
                            {/* Compact Photo Upload */}
                            <div className="bg-[#f8fcfb] border border-[#00695c33] rounded-lg p-4 flex flex-col items-center gap-4">
                                <h2 className="text-[10px] font-black text-[#00695c] uppercase tracking-widest text-center">Party Photo</h2>

                                <div className="relative group w-36 h-36 bg-gray-50 rounded-lg border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera size={32} className="text-gray-200" />
                                    )}
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute inset-0 bg-[#004d4099] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white gap-1"
                                    >
                                        <Upload size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Upload</span>
                                    </div>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-[#f0f4f4] border-t border-gray-100 px-4 py-2 flex items-center justify-between h-14 flex-shrink-0 mt-2 rounded-b-lg">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span>#PRT-2024</span>
                            <span className="text-[#00695c66]">●</span>
                            <span>Auto-Scale: Active</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                className="h-10 px-8 bg-[#004d40] hover:bg-[#00332e] text-white rounded-md flex items-center justify-center gap-2 transition-all shadow-md"
                            >
                                <Save size={18} />
                                <span className="text-[13px] font-black uppercase tracking-widest">Save</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/party')}
                                className="h-10 px-8 bg-white border border-gray-300 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                <X size={18} />
                                <span className="text-[13px] font-black uppercase tracking-widest">Exit</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Party;
