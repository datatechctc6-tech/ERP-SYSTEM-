import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import dataQuestLogo from "../../assets/newdatatech.png";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePhone = (phone) =>
        /^[0-9]{10}$/.test(phone);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error on change
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email.";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
        else if (!validatePhone(formData.phone)) newErrors.phone = "Enter valid 10-digit phone number.";
        if (!formData.password.trim()) newErrors.password = "Password is required.";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
        else if (formData.password.length > 8) newErrors.password = "Password must be at most 8 characters.";
        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password.";
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;
        setLoading(true);
        // Mock registration
        setTimeout(() => {
            setLoading(false);
            alert("Registration successful! Please login.");
            navigate("/login");
        }, 1200);
    };

    const isFormValid =
        formData.fullName.trim() &&
        formData.email.trim() &&
        formData.phone.trim() &&
        formData.password.trim() &&
        formData.confirmPassword.trim() &&
        Object.values(errors).every((e) => e === "");

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

                {/* ================= LEFT - FORM ================= */}
                <div className="p-5 relative">
                    <div className="flex gap-3 mb-6">
                        <div className="w-8 h-8 mt-1 bg-red-100 rounded flex items-center justify-center">
                            <span className="text-red-600 font-bold">D</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-red-800">Register</h2>
                            <p className="text-xs text-gray-500">Create a new account</p>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="mb-1">
                        <label className="block text-sm mb-1 text-gray-700 font-bold">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            ref={nameRef}
                            autoFocus
                            value={formData.fullName}
                            onChange={handleChange}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (formData.fullName.trim()) emailRef.current?.focus(); else setErrors(prev => ({ ...prev, fullName: "Please enter name" })); } }}
                            className="w-full h-9 rounded-md bg-white border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
                        />
                        <p className="text-xs text-red-500 min-h-[16px]">{errors.fullName || "\u00A0"}</p>
                    </div>

                    {/* Email */}
                    <div className="mb-1">
                        <label className="block text-sm mb-1 text-gray-700 font-bold">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            ref={emailRef}
                            value={formData.email}
                            onChange={handleChange}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (formData.email.trim() && validateEmail(formData.email)) phoneRef.current?.focus(); else setErrors(prev => ({ ...prev, email: !formData.email.trim() ? "Please enter email" : "Please enter valid email" })); } }}
                            className="w-full h-9 rounded-md bg-white border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
                        />
                        <p className="text-xs text-red-500 min-h-[16px]">{errors.email || "\u00A0"}</p>
                    </div>

                    {/* Phone */}
                    <div className="mb-1">
                        <label className="block text-sm mb-1 text-gray-700 font-bold">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 h-9 rounded-l-md border border-r-0 border-[#a6b0c7] bg-gray-100 text-sm text-gray-600 font-semibold select-none">+91</span>
                            <input
                                type="tel"
                                name="phone"
                                ref={phoneRef}
                                maxLength={10}
                                placeholder="10-digit mobile number"
                                value={formData.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    setFormData((prev) => ({ ...prev, phone: val }));
                                    setErrors((prev) => ({ ...prev, phone: "" }));
                                }}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (formData.phone.trim().length === 10) passwordRef.current?.focus(); else setErrors(prev => ({ ...prev, phone: "Please enter 10-digit phone number" })); } }}
                                className="w-full h-9 rounded-r-md bg-white border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
                            />
                        </div>
                        <p className="text-xs text-red-500 min-h-[16px]">{errors.phone || "\u00A0"}</p>
                    </div>

                    {/* Password */}
                    <div className="mb-1 relative">
                        <label className="block text-sm mb-1 text-gray-700 font-bold">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            ref={passwordRef}
                            value={formData.password}
                            onChange={handleChange}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (formData.password.trim() && formData.password.length >= 6 && formData.password.length <= 8) confirmPasswordRef.current?.focus(); else setErrors(prev => ({ ...prev, password: !formData.password.trim() ? "Please enter password" : "Password must be 6-8 characters" })); } }}
                            className="w-full h-9 rounded-md bg-white border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute text-gray-400 right-2 top-[34px]"
                        >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <p className="text-xs text-red-500 min-h-[16px]">{errors.password || "\u00A0"}</p>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4 relative">
                        <label className="block text-sm mb-1 text-gray-700 font-bold">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            ref={confirmPasswordRef}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (!formData.confirmPassword.trim()) { setErrors(prev => ({ ...prev, confirmPassword: "Please confirm password" })); }
                                    else if (formData.password !== formData.confirmPassword) { setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" })); }
                                    else if (isFormValid && !loading) handleRegister();
                                }
                            }}
                            className="w-full h-9 rounded-md bg-white border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute text-gray-400 right-2 top-[34px]"
                        >
                            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <p className="text-xs text-red-500 min-h-[16px]">{errors.confirmPassword || "\u00A0"}</p>
                    </div>

                    {/* Register Button */}
                    <button
                        onClick={handleRegister}
                        disabled={!isFormValid || loading}
                        className={`w-full mt-2 py-2.5 rounded-md text-white font-medium cursor-pointer ${!isFormValid
                            ? "bg-gray-300 cursor-not-allowed"
                            : loading
                                ? "bg-[rgb(232,3,8)] cursor-wait"
                                : "bg-[rgb(232,3,8)] hover:bg-red-600"
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Registering...
                            </span>
                        ) : (
                            "Register"
                        )}
                    </button>

                    {/* Login Link */}
                    <div className="mt-5 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="text-red-500 font-semibold hover:underline cursor-pointer"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>

                {/* ================= RIGHT - BRANDING ================= */}
                <div className="bg-gray-50 p-5 flex flex-col justify-between">
                    <div>
                        <img
                            src={dataQuestLogo}
                            alt="logo"
                            className="w-full max-w-xs mx-auto"
                        />
                        <div className="dev-wrapper" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="dev-text">
                                Developed by <span>Datatech Software</span>
                            </p>
                            {/* <span className="dev-underline"></span> */}
                        </div>
                        <p className="text-md text-gray-500 mt-6 leading-relaxed font-bold text-center">
                            H.O. Telenga Bazar ,Bamphi Sahi , Cuttack-753009
                        </p>
                    </div>

                    <div className="flex gap-4 mt-6 justify-center">
                        <a href="#" className="social-icon" style={{ background: 'linear-gradient(135deg, #1877F2, #0C5DC7)' }} title="Facebook">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </a>
                        <a href="#" className="social-icon" style={{ background: 'linear-gradient(135deg, #FF0000, #CC0000)' }} title="YouTube">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                        </a>
                        <a href="#" className="social-icon" style={{ background: 'linear-gradient(135deg, #1DA1F2, #0D8BD9)' }} title="Twitter">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                        <a href="#" className="social-icon" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }} title="WhatsApp">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        </a>
                        <a href="#" className="social-icon" style={{ background: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF, #515BD4)' }} title="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
