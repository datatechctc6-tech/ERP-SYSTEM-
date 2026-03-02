import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { X, Save, Upload, User, MapPin, Phone, Mail, Map, Briefcase, Camera, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './Party.css';

const FormInput = forwardRef(({ label, name, type = "text", placeholder, icon: Icon, isFullWidth = false, value, onChange, onKeyDown, maxLength, error, required }, ref) => (
    <div className={`flex items-center gap-3 mb-1 ${isFullWidth ? 'col-span-full' : ''}`}>
        <label className="party-label w-32 flex-shrink-0 flex items-center gap-2 text-[12px] font-black text-[#004d40] uppercase tracking-tight">
            {Icon && <Icon size={14} className="text-[#00695c]" />}
            {label}
            {required && <span className="text-red-500 text-sm">*</span>}
        </label>
        <div className="flex-1">
            <input
                ref={ref}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                className={`party-input w-full bg-[#f8fafc] border ${error ? 'border-red-400 focus:border-red-500 focus:bg-[#fdd55ce1]' : 'border-gray-300 focus:border-[#004d40] focus:bg-[#fdd55ce1]'} outline-none px-3 py-1.5 text-[13px] font-bold text-gray-800 transition-all placeholder:text-gray-400 placeholder:font-normal focus:text-black focus:placeholder:text-gray-600 rounded shadow-sm`}
            />
            {error && <p className="party-error text-[10px] text-red-500 mt-0.5 font-semibold">{error}</p>}
        </div>
    </div>
));

const Party = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const isEditMode = !!id;
    const editParty = location.state?.party;
    const fileInputRef = useRef(null);

    // Refs for all input fields (navigation order)
    const nameRef = useRef(null);
    const stateRef = useRef(null);
    const addressRef = useRef(null);
    const address2Ref = useRef(null);
    const cityRef = useRef(null);
    const pincodeRef = useRef(null);
    const phoneRef = useRef(null);
    const whatsappRef = useRef(null);
    const emailRef = useRef(null);
    const gramPanchayatRef = useRef(null);
    const zoneRef = useRef(null);
    const designationRef = useRef(null);

    // Navigation order: column-wise (left column first, then right column) for both sections
    const fieldOrder = [nameRef, addressRef, address2Ref, pincodeRef, stateRef, cityRef, phoneRef, whatsappRef, emailRef, zoneRef, gramPanchayatRef, designationRef];

    const DRAFT_KEY = 'party_form_draft';

    const getInitialFormData = () => {
        if (isEditMode && editParty) {
            return {
                hold_name: editParty.name || '',
                address1: editParty.address || '',
                address2: editParty.address2 || '',
                pincode: editParty.PINCODE || editParty.pincode || '',
                city: editParty.city || '',
                state: editParty.state || '',
                Mobile_No: editParty.mobile || editParty.phone || '',
                Whatsapp_No: editParty.whatsapp || '',
                Gmail_Id: editParty.email || '',
                gp_Name: editParty.gramPanchayat || '',
                Zone_Name: editParty.zone || '',
                designation: editParty.designation || '',
                Sl_No: editParty.Sl_No || '',
                t_v_date: editParty.t_v_date || ''
            };
        }

        return {
            Sl_No: '', t_v_date: '', hold_name: '', address1: '', address2: '', pincode: '', city: '', state: '',
            Mobile_No: '', Whatsapp_No: '', Gmail_Id: '', gp_Name: '', Zone_Name: '', designation: ''
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);
    const [errors, setErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState(
        isEditMode && editParty && editParty.photo
            ? `http://localhost:5000${editParty.photo}`
            : null
    );
    const [showDraftPrompt, setShowDraftPrompt] = useState(false);

    // Check for saved draft on mount (only for create mode)
    useEffect(() => {
        if (!isEditMode) {
            try {
                const saved = localStorage.getItem(DRAFT_KEY);
                if (saved) {
                    const draft = JSON.parse(saved);
                    const hasData = Object.values(draft).some(v => v && v.trim() !== '');
                    if (hasData) {
                        setShowDraftPrompt(true);
                    }
                }
            } catch (e) { /* ignore */ }
        }
        nameRef.current?.focus();
    }, []);

    // Auto-save draft on every form change (only create mode)
    useEffect(() => {
        if (!isEditMode && !showDraftPrompt) {
            const hasData = Object.values(formData).some(v => v && v.trim() !== '');
            if (hasData) {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
            }
        }
    }, [formData]);

    const loadDraft = () => {
        try {
            const saved = localStorage.getItem(DRAFT_KEY);
            if (saved) {
                setFormData(JSON.parse(saved));
            }
        } catch (e) { /* ignore */ }
        setShowDraftPrompt(false);
        nameRef.current?.focus();
    };

    const startFresh = () => {
        localStorage.removeItem(DRAFT_KEY);
        setShowDraftPrompt(false);
        nameRef.current?.focus();
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Pincode: only digits, max 6
        if (name === 'pincode') {
            const cleaned = value.replace(/\D/g, '').slice(0, 6);
            setFormData(prev => ({ ...prev, pincode: cleaned }));
            setErrors(prev => ({ ...prev, pincode: '' }));
            return;
        }

        // Phone: only digits, max 10
        if (name === 'Mobile_No' || name === 'Whatsapp_No') {
            const cleaned = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: cleaned }));
            setErrors(prev => ({ ...prev, [name]: '' }));
            return;
        }

        // Clear error on change
        if (name === 'Gmail_Id') {
            setErrors(prev => ({ ...prev, Gmail_Id: '' }));
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleKeyDown = (e, currentRef) => {
        const currentIndex = fieldOrder.indexOf(currentRef);

        if (e.key === 'Enter') {
            e.preventDefault();

            // Validate before moving forward
            const name = e.target.name;
            if (name === 'Mobile_No' && formData.Mobile_No && !validatePhone(formData.Mobile_No)) {
                setErrors(prev => ({ ...prev, Mobile_No: '10-digit mobile number required' }));
                return;
            }
            if (name === 'Gmail_Id' && formData.Gmail_Id && !validateEmail(formData.Gmail_Id)) {
                setErrors(prev => ({ ...prev, Gmail_Id: 'Please enter a valid email' }));
                return;
            }
            if (name === 'pincode' && formData.pincode && formData.pincode.length !== 6) {
                setErrors(prev => ({ ...prev, pincode: '6-digit pincode required' }));
                return;
            }

            // Move to next field
            if (currentIndex < fieldOrder.length - 1) {
                fieldOrder[currentIndex + 1].current?.focus();
            }
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                fieldOrder[currentIndex - 1].current?.focus();
            }
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation
        const newErrors = {};
        if (formData.Mobile_No && !validatePhone(formData.Mobile_No)) newErrors.Mobile_No = '10-digit mobile number required';
        if (formData.Gmail_Id && !validateEmail(formData.Gmail_Id)) newErrors.Gmail_Id = 'Please enter a valid email';
        if (formData.pincode && formData.pincode.length !== 6) newErrors.pincode = '6-digit pincode required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Map frontend state to backend expected fields
        const formDataToSend = new FormData();
        formDataToSend.append('FULL_NAME', formData.hold_name || '');
        formDataToSend.append('ADDRESS', formData.address1 || '');
        formDataToSend.append('ADDRESS2', formData.address2 || '');
        formDataToSend.append('PINCODE', formData.pincode || '');
        formDataToSend.append('STATE', formData.state || '');
        formDataToSend.append('CITY', formData.city || '');
        formDataToSend.append('PHONE', formData.Mobile_No || '');
        formDataToSend.append('WHATSAPP', formData.Whatsapp_No || '');
        formDataToSend.append('EMAIL_ID', formData.Gmail_Id || '');
        formDataToSend.append('ZONE', formData.Zone_Name || '');
        formDataToSend.append('PANCHAYAT', formData.gp_Name || '');
        formDataToSend.append('DESIGNATION', formData.designation || '');

        if (fileInputRef.current && fileInputRef.current.files[0]) {
            formDataToSend.append('photo', fileInputRef.current.files[0]);
        } else if (!photoPreview && isEditMode) {
            // Signal to backend that the photo was cleared
            formDataToSend.append('clear_photo', 'true');
        }

        try {
            const token = localStorage.getItem('token');
            const url = isEditMode ? `http://localhost:5000/api/party/${id}` : 'http://localhost:5000/api/party';
            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.removeItem(DRAFT_KEY);
                toast.success(isEditMode ? 'Party updated successfully!' : 'Party created successfully!');
                navigate('/party');
            } else {
                toast.error(data.message || 'Failed to save party');
            }
        } catch (err) {
            console.error(err);
            toast.error('Server error. Backend is not responding.');
        }
    };

    return (
        <div className="party-page h-full w-full bg-[#f0f4f4] flex overflow-hidden">
            <Toaster position="top-right" />
            {/* Full-Screen Form Container */}
            <div className="w-full h-full bg-white border-[2px] border-[#004d40] shadow-2xl rounded-lg overflow-hidden flex flex-col">

                {/* Compact Header */}
                <div className="party-header bg-[#004d40] px-4 py-2 text-white flex items-center justify-between h-12 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <User size={18} className="text-[#a7ffeb]" />
                        <h1 className="party-header-title text-sm font-black tracking-widest uppercase">{isEditMode ? 'EDIT GP HOLDER' : 'GP HOLDER MASTER'}</h1>
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
                                <h2 className="party-section-title text-[14px] font-black text-[#00695c] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 border-b border-gray-50 pb-1">
                                    <span className="w-1 h-3 bg-[#004d40] rounded-full"></span>
                                    Core Details
                                </h2>
                                <div className="grid grid-cols-2 gap-x-6">
                                    <FormInput ref={nameRef} label="Full Name" name="hold_name" icon={User} placeholder="Party full name..." value={formData.hold_name} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, nameRef)} required />
                                    <FormInput ref={stateRef} label="State" name="state" icon={Map} placeholder="e.g. Odisha" value={formData.state} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, stateRef)} />
                                    <FormInput ref={addressRef} label="Address" name="address1" icon={MapPin} placeholder="Street, Area details..." value={formData.address1} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, addressRef)} />
                                    <FormInput ref={cityRef} label="City" name="city" icon={Map} placeholder="e.g. Cuttack" value={formData.city} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, cityRef)} />
                                    <FormInput ref={address2Ref} label="Address 2" name="address2" icon={MapPin} placeholder="Additional address..." value={formData.address2} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, address2Ref)} />
                                    <FormInput ref={phoneRef} label="Phone" name="Mobile_No" type="text" icon={Phone} placeholder="10-digit mobile" value={formData.Mobile_No} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, phoneRef)} maxLength={10} error={errors.phone} required />
                                    <FormInput ref={pincodeRef} label="Pincode" name="pincode" type="text" icon={Map} placeholder="6-digit" value={formData.pincode} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, pincodeRef)} maxLength={6} error={errors.pincode} required />
                                    <FormInput ref={whatsappRef} label="WhatsApp" name="Whatsapp_No" type="text" icon={Phone} placeholder="10-digit WhatsApp" value={formData.Whatsapp_No} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, whatsappRef)} maxLength={10} />
                                </div>
                            </div>

                            {/* Categorization Section */}
                            <div className="border border-gray-100 rounded-md p-3">
                                <h2 className="party-section-title text-[14px] font-black text-[#00695c] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 border-b border-gray-50 pb-1">
                                    <span className="w-1 h-3 bg-[#004d40] rounded-full"></span>
                                    Classification
                                </h2>
                                <div className="grid grid-cols-2 gap-x-6">
                                    <FormInput ref={emailRef} label="Email ID" name="Gmail_Id" type="email" icon={Mail} placeholder="name@email.com" value={formData.Gmail_Id} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, emailRef)} error={errors.email} required />
                                    <FormInput ref={gramPanchayatRef} label="Panchayat" name="gp_Name" icon={Briefcase} placeholder="Gram Panchayat" value={formData.gp_Name} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, gramPanchayatRef)} />
                                    <FormInput ref={zoneRef} label="Zone" name="Zone_Name" icon={Briefcase} placeholder="Zone / Area" value={formData.Zone_Name} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, zoneRef)} />
                                    <FormInput ref={designationRef} label="Designation" name="designation" icon={Briefcase} placeholder="e.g. Proprietor" value={formData.designation} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, designationRef)} />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Photo */}
                        <div className="flex-1 min-w-[200px] flex flex-col gap-4 border-l border-gray-50 pl-6 h-full p-4">
                            {/* Compact Photo Upload */}
                            <div className="bg-[#f8fcfb] border border-[#00695c33] rounded-lg p-4 flex flex-col items-center gap-4">
                                <h2 className="party-photo-title text-[10px] font-black text-[#00695c] uppercase tracking-widest text-center">Party Photo</h2>

                                <div className="party-photo-box relative group w-36 h-36 bg-gray-50 rounded-lg border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
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
                                        <span className="party-upload-text text-[10px] font-black uppercase tracking-widest">Upload</span>
                                    </div>
                                </div>
                                {photoPreview && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPhotoPreview(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="flex items-center gap-1.5 text-[11px] text-red-500 hover:text-red-600 font-bold uppercase tracking-wider transition-colors mt-2 bg-red-50 px-3 py-1.5 rounded"
                                    >
                                        <Trash2 size={14} />
                                        <span>Clear</span>
                                    </button>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="party-footer bg-[#f0f4f4] border-t border-gray-100 px-4 py-2 flex items-center justify-between h-14 flex-shrink-0 mt-2 rounded-b-lg">
                        <div className="party-footer-info flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {/* <span>#PRT-2024</span> */}
                            <span className="text-[#00695c66]">●</span>
                            {/* <span>Auto-Scale: Active</span> */}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                className="party-footer-btn bg-[#004d40] hover:bg-[#00332e] text-white rounded-md flex items-center justify-center gap-2 transition-all shadow-md"
                            >
                                <Save size={18} />
                                <span className="party-btn-text text-[13px] font-black uppercase tracking-widest">{isEditMode ? 'Update' : 'Save'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/party')}
                                className="party-footer-btn bg-[#004d40] hover:bg-red-600 text-white rounded-md flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                <X size={18} />
                                <span className="party-btn-text text-[13px] font-black uppercase tracking-widest">Exit</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Draft Continue Prompt */}
            {showDraftPrompt && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl w-[90%] max-w-[400px] border-2 border-[#004d40] overflow-hidden">
                        <div className="bg-[#004d40] px-4 py-3 text-white flex items-center gap-2">
                            <Save size={18} className="text-[#a7ffeb]" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Draft Found</h3>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-gray-600 mb-5">Your previous incomplete form has been saved. Would you like to continue?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={startFresh}
                                    className="px-5 h-9 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    New Form
                                </button>
                                <button
                                    onClick={loadDraft}
                                    className="px-5 h-9 text-sm font-bold text-white bg-[#004d40] hover:bg-[#00332e] rounded-md transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Party;
