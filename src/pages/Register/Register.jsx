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
                <div className="p-10 relative">
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
                            className="w-full h-11 rounded-md bg-white border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
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
                            className="w-full h-11 rounded-md bg-white border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
                        />
                        <p className="text-xs text-red-500 min-h-[16px]">{errors.email || "\u00A0"}</p>
                    </div>

                    {/* Phone */}
                    <div className="mb-1">
                        <label className="block text-sm mb-1 text-gray-700 font-bold">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 h-11 rounded-l-md border border-r-0 border-[#a6b0c7] bg-gray-100 text-sm text-gray-600 font-semibold select-none">+91</span>
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
                                className="w-full h-11 rounded-r-md bg-white border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
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
                            className="w-full h-11 rounded-md bg-white border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
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
                            className="w-full h-11 rounded-md bg-white border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
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
                <div className="bg-gray-50 p-10 flex flex-col justify-between">
                    <div>
                        <img
                            src={dataQuestLogo}
                            alt="logo"
                            className="w-full max-w-xs mx-auto"
                        />
                        <div className="dev-wrapper">
                            <p className="dev-text">
                                Developed by <span>Datatech Software</span>
                            </p>
                            <span className="dev-underline"></span>
                        </div>
                        <p className="text-md text-gray-500 mt-6 leading-relaxed font-bold">
                            H.O. Telenga Bazar, Bamphi Sahi, Cuttack-753009
                        </p>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <div className="social-icon bg-blue-600">FB</div>
                        <div className="social-icon bg-red-600">YT</div>
                        <div className="social-icon bg-sky-500">TW</div>
                        <div className="social-icon bg-green-500">WA</div>
                        <div className="social-icon bg-pink-500">IG</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
