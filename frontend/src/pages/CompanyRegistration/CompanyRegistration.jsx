import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Upload, Calendar, Eye, EyeOff, ShieldCheck, ExternalLink, Save, Edit, Eraser, EyeOff as HideIcon, Lock, Unlock, Printer } from "lucide-react";
import "./CompanyRegistration.css";

export default function CompanyRegistration() {
    const navigate = useNavigate();
    const location = useLocation();
    const companyId = location.state?.companyId;
    const isView = location.state?.isView || false;

    const INITIAL_STATE = {
        companyName: "",
        address1: "",
        address2: "",
        address3: "",
        pincode: "",
        country: "INDIA",
        state: "",

        branchCode: "",
        businessType: "PHARMA",
        finYearFrom: "2025-04-01",
        finYearTo: "2026-03-31",
        booksFrom: "2025-04-01",
        booksTo: "2026-03-31",

        officeNo: "",
        phoneNo: "",
        whatsappNo: "",
        emailId: "",
        password: "",
        website: "",

        regType: "REGISTERED",
        gstin: "",
        gstDate: "",
        tinNo: "",

        dl1: "", dl1From: "", dl1To: "",
        dl2: "", dl2From: "", dl2To: "",
        dl3: "", dl3From: "", dl3To: "",
        fssai: "", fssaiFrom: "", fssaiTo: "",
        cin: "", cinFrom: "", cinTo: "",
        udin: "", udinFrom: "", udinTo: "",

        bankName: "",
        accountNo: "",
        ifscCode: "",
        bankAddress: "",
        jurisdiction: "",
        workingStyle: "MRP",
        narration: "",
    };

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [showPassword, setShowPassword] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    const [signPreview, setSignPreview] = useState(null);
    const companyNameRef = useRef(null);
    const logoInputRef = useRef(null);
    const qrInputRef = useRef(null);
    const signInputRef = useRef(null);

    const handleImageUpload = (e, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        companyNameRef.current?.focus();
        if (companyId) {
            fetch(`http://localhost:5000/api/companies/${companyId}`)
                .then(res => res.json())
                .then(data => {
                    // Update only keys that exist in INITIAL_STATE
                    const formattedData = {};
                    Object.keys(INITIAL_STATE).forEach(key => {
                        formattedData[key] = data[key] !== null ? data[key] : INITIAL_STATE[key];
                    });

                    // Specific date transformations to handle timestamp format return from the db
                    const dateKeys = ['finYearFrom', 'finYearTo', 'booksFrom', 'booksTo', 'gstDate', 'dl1From', 'dl1To', 'dl2From', 'dl2To', 'dl3From', 'dl3To', 'fssaiFrom', 'fssaiTo', 'cinFrom', 'cinTo', 'udinFrom', 'udinTo'];
                    dateKeys.forEach(k => {
                        if (formattedData[k] && formattedData[k].includes('T')) {
                            formattedData[k] = formattedData[k].split('T')[0];
                        }
                    });

                    setFormData(prev => ({ ...prev, ...formattedData }));
                })
                .catch(err => console.error("Error fetching company details:", err));
        }
    }, [companyId]);

    const handleChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value.toUpperCase(),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.companyName) {
            alert("Company Name is required");
            return;
        }

        try {
            const endpoint = companyId ? `http://localhost:5000/api/companies/${companyId}` : "http://localhost:5000/api/companies";
            const method = companyId ? "PUT" : "POST";

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(companyId ? "Company Updated Successfully!" : "Company Registered Successfully!");
                navigate("/companylist");
            } else {
                alert(data.error || (companyId ? "Failed to update company" : "Failed to register company"));
            }
        } catch (error) {
            console.error(companyId ? "Company update error:" : "Company registration error:", error);
            alert("An error occurred. Please check if the server is running.");
        }
    };

    const handleClear = () => {
        setFormData(INITIAL_STATE);
        setLogoPreview(null);
        setQrPreview(null);
        setSignPreview(null);
    };

    const handleKeyDown = (e) => {
        const form = e.currentTarget;
        const inputs = Array.from(form.querySelectorAll('input:not([type="file"]):not([type="hidden"]), select'));
        const currentIndex = inputs.indexOf(e.target);
        if (currentIndex === -1) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            // Only move to next if current field has a value
            if (e.target.value.trim() === '') return;
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            }
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                inputs[currentIndex - 1].focus();
            }
        }

    };

    return (
        <div className="registration-page px-4">

            <div className="registration-container">

                {/* Header / Close Bar */}
                <div className="registration-header">
                    <h2>{isView ? "View Company Details" : (companyId ? "Modify Company Details" : "Company Registration")}</h2>
                    <button type="button" onClick={() => navigate("/companylist")} className="close-btn">
                        <X size={18} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                    <fieldset disabled={isView} style={{ border: 'none', padding: 0, margin: 0, minWidth: 0, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                        <div className="registration-content">

                            {/* Left Column: Create Company */}
                            <div className="form-column">
                                <div className="form-section-title">Create Company</div>

                                <div className="form-group">
                                    <label>Company Name <span>*</span></label>
                                    <input
                                        ref={companyNameRef}
                                        className="reg-input"
                                        value={formData.companyName}
                                        onChange={(e) => handleChange("companyName", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address-1 <span>*</span></label>
                                    <input
                                        className="reg-input"
                                        value={formData.address1}
                                        onChange={(e) => handleChange("address1", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address-2 <span>*</span></label>
                                    <input
                                        className="reg-input"
                                        value={formData.address2}
                                        onChange={(e) => handleChange("address2", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address-3 <span>*</span></label>
                                    <input
                                        className="reg-input"
                                        value={formData.address3}
                                        onChange={(e) => handleChange("address3", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input
                                        className="reg-input"
                                        value={formData.pincode}
                                        onChange={(e) => handleChange("pincode", e.target.value)}
                                    />
                                </div>

                                <div className="dual-columns">
                                    <div className="form-group">
                                        <label>Country</label>
                                        <input
                                            className="reg-input"
                                            value={formData.country}
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <select
                                            className="reg-input"
                                            value={formData.state}
                                            onChange={(e) => handleChange("state", e.target.value)}
                                        >
                                            <option value="">Select State</option>
                                            <option value="ANDHRA PRADESH">ANDHRA PRADESH</option>
                                            <option value="ARUNACHAL PRADESH">ARUNACHAL PRADESH</option>
                                            <option value="ASSAM">ASSAM</option>
                                            <option value="BIHAR">BIHAR</option>
                                            <option value="CHHATTISGARH">CHHATTISGARH</option>
                                            <option value="GOA">GOA</option>
                                            <option value="GUJARAT">GUJARAT</option>
                                            <option value="HARYANA">HARYANA</option>
                                            <option value="HIMACHAL PRADESH">HIMACHAL PRADESH</option>
                                            <option value="JHARKHAND">JHARKHAND</option>
                                            <option value="KARNATAKA">KARNATAKA</option>
                                            <option value="KERALA">KERALA</option>
                                            <option value="MADHYA PRADESH">MADHYA PRADESH</option>
                                            <option value="MAHARASHTRA">MAHARASHTRA</option>
                                            <option value="MANIPUR">MANIPUR</option>
                                            <option value="MEGHALAYA">MEGHALAYA</option>
                                            <option value="MIZORAM">MIZORAM</option>
                                            <option value="NAGALAND">NAGALAND</option>
                                            <option value="ODISHA">ODISHA</option>
                                            <option value="PUNJAB">PUNJAB</option>
                                            <option value="RAJASTHAN">RAJASTHAN</option>
                                            <option value="SIKKIM">SIKKIM</option>
                                            <option value="TAMIL NADU">TAMIL NADU</option>
                                            <option value="TELANGANA">TELANGANA</option>
                                            <option value="TRIPURA">TRIPURA</option>
                                            <option value="UTTAR PRADESH">UTTAR PRADESH</option>
                                            <option value="UTTARAKHAND">UTTARAKHAND</option>
                                            <option value="WEST BENGAL">WEST BENGAL</option>

                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Website</label>
                                    <input className="reg-input" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} />
                                </div>
                            </div>

                            {/* Right Column: Company Details */}
                            <div className="form-column">
                                <div className="form-section-title">Company Details</div>

                                <div className="form-group">
                                    <label>Branch Code</label>
                                    <input
                                        className="reg-input"
                                        value={formData.branchCode}
                                        onChange={(e) => handleChange("branchCode", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Business Type</label>
                                    <select
                                        className="reg-input"
                                        value={formData.businessType}
                                        onChange={(e) => handleChange("businessType", e.target.value)}
                                    >
                                        <option value="PHARMA">PHARMA</option>
                                        <option value="HOSPITAL">HOSPITAL</option>
                                        <option value="RETAIL">RETAIL</option>
                                        <option value="MANUFACTURING">MANUFACTURING</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Financial Year <span>*</span></label>
                                    <div className="date-row">
                                        <div className="date-field">
                                            <label>From:</label>
                                            <input
                                                type="date"
                                                className="reg-input"
                                                value={formData.finYearFrom}
                                                onChange={(e) => handleChange("finYearFrom", e.target.value)}
                                            />
                                        </div>
                                        <div className="date-field">
                                            <label>To:</label>
                                            <input
                                                type="date"
                                                className="reg-input"
                                                value={formData.finYearTo}
                                                onChange={(e) => handleChange("finYearTo", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Books Beginning <span>*</span></label>
                                    <div className="date-row">
                                        <div className="date-field">
                                            <label>From:</label>
                                            <input
                                                type="date"
                                                className="reg-input"
                                                value={formData.booksFrom}
                                                onChange={(e) => handleChange("booksFrom", e.target.value)}
                                            />
                                        </div>
                                        <div className="date-field">
                                            <label>To:</label>
                                            <input
                                                type="date"
                                                className="reg-input"
                                                value={formData.booksTo}
                                                onChange={(e) => handleChange("booksTo", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="logo-upload-area" onClick={() => logoInputRef.current.click()}>
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }} />
                                    ) : (
                                        <>
                                            <Upload size={24} className="text-[#00897b] mb-2" />
                                            <span>Company Logo</span>
                                            <p>Click to upload image</p>
                                        </>
                                    )}
                                    <input type="file" ref={logoInputRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, setLogoPreview)} />
                                </div>
                            </div>

                            {/* Contact Details Section (Full Width spanning columns) */}
                            <div className="section-divider col-span-2">
                                <div className="badge-title">Contact Details</div>
                            </div>

                            <div className="form-column col-span-2">
                                <div className="tri-columns">
                                    <div className="form-group">
                                        <label>Office Number <span>*</span></label>
                                        <input className="reg-input" value={formData.officeNo} onChange={(e) => handleChange("officeNo", e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input className="reg-input" value={formData.phoneNo} onChange={(e) => handleChange("phoneNo", e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>WhatsApp Number</label>
                                        <input className="reg-input" value={formData.whatsappNo} onChange={(e) => handleChange("whatsappNo", e.target.value)} />
                                    </div>
                                </div>

                                <div className="dual-columns">
                                    <div className="form-group">
                                        <label>Email ID <span>*</span></label>
                                        <input
                                            autoComplete="new-password"
                                            className="reg-input"
                                            value={formData.emailId}
                                            onChange={(e) => handleChange("emailId", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                className="reg-input pr-10"
                                                value={formData.password}
                                                onChange={(e) => handleChange("password", e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00897b] hover:text-[#0c4b3d]"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Website</label>
                                    <input className="reg-input" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} />
                                </div>
                            </div>

                            {/* GST / TAX Details Section */}
                            <div className="section-divider">
                                <div className="badge-title">GST / Tax Details</div>
                            </div>

                            <div className="form-column col-span-2">
                                <div className="form-group" style={{ maxWidth: '50%' }}>
                                    <label>Company Reg Type</label>
                                    <select className="reg-input" value={formData.regType} onChange={(e) => handleChange("regType", e.target.value)}>
                                        <option value="REGISTERED">REGISTERED</option>
                                        <option value="UNREGISTERED">UNREGISTERED</option>
                                        <option value="COMPOSITION">COMPOSITION</option>
                                    </select>
                                </div>

                                <div className="tri-columns">
                                    <div className="form-group">
                                        <label>GSTIN No</label>
                                        <input className="reg-input" value={formData.gstin} onChange={(e) => handleChange("gstin", e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input type="date" className="reg-input" value={formData.gstDate} onChange={(e) => handleChange("gstDate", e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>TIN Number</label>
                                        <input className="reg-input" value={formData.tinNo} onChange={(e) => handleChange("tinNo", e.target.value)} />
                                    </div>
                                </div>

                                <div className="btn-verify-group">
                                    <button type="button" className="btn-minimal btn-check-format">
                                        <ShieldCheck size={14} /> Check Format
                                    </button>
                                    <button type="button" className="btn-minimal btn-verify-online">
                                        <ExternalLink size={14} /> Verify Online
                                    </button>
                                </div>
                            </div>

                            {/* License Info Section */}
                            <div className="section-divider">
                                <div className="badge-title">License Info</div>
                            </div>

                            <div className="form-column col-span-2">
                                {[
                                    { id: "dl1", label: "DL Number 1" },
                                    { id: "dl2", label: "DL Number 2" },
                                    { id: "dl3", label: "DL Number 3" },
                                    { id: "fssai", label: "FSSAI Number" },
                                    { id: "cin", label: "CIN Number" },
                                    { id: "udin", label: "UDIN Number" }
                                ].map((lic) => (
                                    <div className="tri-columns mb-4" key={lic.id}>
                                        <div className="form-group">
                                            <label>{lic.label}</label>
                                            <input className="reg-input" value={formData[lic.id]} onChange={(e) => handleChange(lic.id, e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Valid From</label>
                                            <input type="date" className="reg-input" value={formData[`${lic.id}From`]} onChange={(e) => handleChange(`${lic.id}From`, e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Valid To</label>
                                            <input type="date" className="reg-input" value={formData[`${lic.id}To`]} onChange={(e) => handleChange(`${lic.id}To`, e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bank / Others Info Section */}
                            <div className="section-divider">
                                <div className="badge-title">Bank / Others Info</div>
                            </div>

                            <div className="form-column col-span-2">
                                <div className="bank-others-grid">
                                    {/* Left Side: Fields */}
                                    <div className="fields-column">
                                        <div className="form-group">
                                            <label>Bank Name <span>*</span></label>
                                            <input className="reg-input" value={formData.bankName} onChange={(e) => handleChange("bankName", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Account Number <span>*</span></label>
                                            <input className="reg-input" value={formData.accountNo} onChange={(e) => handleChange("accountNo", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>IFSC Code <span>*</span></label>
                                            <input className="reg-input" value={formData.ifscCode} onChange={(e) => handleChange("ifscCode", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Bank Address <span>*</span></label>
                                            <input className="reg-input" value={formData.bankAddress} onChange={(e) => handleChange("bankAddress", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Jurisdiction</label>
                                            <input className="reg-input" value={formData.jurisdiction} onChange={(e) => handleChange("jurisdiction", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Working Style</label>
                                            <select className="reg-input" value={formData.workingStyle} onChange={(e) => handleChange("workingStyle", e.target.value)}>
                                                <option value="MRP">MRP</option>
                                                <option value="NET">NET</option>
                                                <option value="COST">COST</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Narration</label>
                                            <input className="reg-input" value={formData.narration} onChange={(e) => handleChange("narration", e.target.value)} />
                                        </div>
                                    </div>

                                    {/* Right Side: Uploads */}
                                    <div className="upload-column">
                                        <div className="logo-upload-area short-upload" onClick={() => qrInputRef.current.click()}>
                                            {qrPreview ? (
                                                <img src={qrPreview} alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }} />
                                            ) : (
                                                <>
                                                    <Upload size={20} className="text-[#00897b] mb-1" />
                                                    <span>Bank QR Code</span>
                                                    <p>Click to upload image</p>
                                                </>
                                            )}
                                            <input type="file" ref={qrInputRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, setQrPreview)} />
                                        </div>
                                        <div className="logo-upload-area short-upload" onClick={() => signInputRef.current.click()}>
                                            {signPreview ? (
                                                <img src={signPreview} alt="Signature" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }} />
                                            ) : (
                                                <>
                                                    <Upload size={20} className="text-[#00897b] mb-1" />
                                                    <span>Signature</span>
                                                    <p>Click to upload image</p>
                                                </>
                                            )}
                                            <input type="file" ref={signInputRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, setSignPreview)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </fieldset>

                    {/* Footer Actions */}
                    <div className="registration-footer">
                        {!isView && (
                            <button type="submit" className="btn-reg btn-save">
                                <Save size={14} /> Save
                            </button>
                        )}
                        <button type="button" className="btn-reg btn-edit">
                            <Edit size={14} /> Edit
                        </button>
                        {!isView && (
                            <button type="button" onClick={handleClear} className="btn-reg btn-clear">
                                <Eraser size={14} /> Clear
                            </button>
                        )}
                        <button type="button" className="btn-reg btn-hide">
                            <EyeOff size={14} /> Hide
                        </button>
                        <button type="button" className="btn-reg btn-lock">
                            <Lock size={14} /> Lock
                        </button>
                        <button type="button" className="btn-reg btn-unlock">
                            <Unlock size={14} /> Unlock
                        </button>
                        <button type="button" className="btn-reg btn-print">
                            <Printer size={14} /> Print
                        </button>
                        <button type="button" onClick={() => navigate("/companylist")} className="btn-reg btn-close">
                            <X size={14} /> Close
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}