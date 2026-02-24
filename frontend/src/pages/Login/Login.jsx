import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import dataQuestLogo from "../../assets/newdatatech.png";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [step, setStep] = useState("email");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [showPinModal, setShowPinModal] = useState(false);
  const [mpin, setMpin] = useState("");
  const [mpinError, setMpinError] = useState("");
  const [showMpin, setShowMpin] = useState(false);
  const [mpinLoading, setMpinLoading] = useState(false);

  // CONFIRMATION MODAL STATE
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const checkConfirm = (message, action) => {
    setConfirmMessage(message);
    setPendingAction(() => action);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (pendingAction) pendingAction();
    setShowConfirm(false);
    setPendingAction(null);
  };

  useEffect(() => {
    setLoginError("");
  }, [email, password]);

  useEffect(() => {
    setResetEmailError("");
  }, [resetEmail]);

  useEffect(() => {
    setOtpError("");
  }, [otp]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(
      value.trim() === ""
        ? "Email is required."
        : !validateEmail(value)
          ? "Please enter a valid email."
          : ""
    );
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(
      value.trim() === ""
        ? "Password is required."
        : value.length < 4
          ? "Password must be at least 4 characters."
          : ""
    );
  };

  const handleLogin = async () => {
    if (!isFormValid) return;
    setLoading(true);
    // Mocking a delay for the UI
    setTimeout(() => {
      navigate("/companylist"); // Mock navigation
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter valid 6-digit OTP");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowForgot(false);
      alert("OTP Verified! Proceed to reset password.");
    }, 1000);
  };

  const handleSendResetLink = async () => {
    if (!resetEmail || resetEmailError) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1000);
  };

  const handleVerifyMpin = async () => {
    if (mpin.length !== 6) {
      setMpinError("Please enter valid 6-digit PIN");
      return;
    }
    setMpinLoading(true);
    setTimeout(() => {
      setMpinLoading(false);
      navigate("/companylist"); // Mock navigation
    }, 1000);
  };

  const isFormValid =
    email.trim() !== "" &&
    password.trim() !== "" &&
    emailError === "" &&
    passwordError === "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* ================= LEFT ================= */}
        <div className="p-10 relative">
          <div className="flex gap-3 mb-8">
            <div className="w-8 h-8 mt-1 bg-red-100 rounded flex items-center justify-center">
              <span className="text-red-600 font-bold">D</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-red-800">Log in</h2>
              <p className="text-xs text-gray-500">to access Admin</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2 text-gray-700 font-bold">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder=""
              ref={emailRef}
              value={email}
              onChange={handleEmailChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  passwordRef.current?.focus();
                }
              }}
              className="w-full h-11 rounded-md bg-[#ffffff] border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500"
            />
            {emailError && <p className="mt-2 text-xs text-red-500">{emailError}</p>}
          </div>

          <div className="mb-3 relative">
            <label className="text-sm font-bold text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              onChange={handlePasswordChange}
              value={password}
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isFormValid && !loading) {
                  e.preventDefault();
                  handleLogin();
                }
              }}
              className="w-full h-11 rounded-md bg-[#ffffff] border border-[#a6b0c7] px-4 text-sm text-black outline-none focus:border-red-500 mt-1"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 right-2 top-[38px]"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            {loginError && <p className="text-red-500 text-sm font-bold">{loginError}</p>}
            <button
              onClick={() => setShowForgot(true)}
              className="text-sm text-red-500 hover:underline cursor-pointer ml-auto"
            >
              Forgot Password
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={!isFormValid || loading}
            className={`w-full mt-3 py-2.5 rounded-md text-white font-medium cursor-pointer ${!isFormValid
              ? "bg-gray-300 cursor-not-allowed"
              : loading
                ? "bg-[rgb(232,3,8)] cursor-wait"
                : "bg-[rgb(232,3,8)] hover:bg-red-600"
              }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-400 font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <button
            onClick={() => {
              setShowPinModal(true);
              setMpin("");
              setMpinError("");
            }}
            className="w-full py-2.5 rounded-md border border-gray-300 text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            Login with PIN
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-red-500 font-semibold hover:underline cursor-pointer"
              >
                Register Now
              </button>
            </p>
          </div>

          <div className="mt-3 text-center">
            <button
              onClick={() => {
                checkConfirm("RESET CONNECTION?", () => {
                  window.location.reload();
                });
              }}
              className="text-xs text-gray-400 hover:text-red-500 underline cursor-pointer"
            >
              Reset Connection / Re-run Setup
            </button>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-gray-50 p-10 flex flex-col justify-between">
          <div>
            <img
              src={dataQuestLogo}
              alt="login"
              className="w-full max-w-xs mx-auto "
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
            {/* Facebook */}
            <a href="#" className="social-icon" style={{ background: 'linear-gradient(135deg, #1877F2, #0C5DC7)' }} title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            {/* YouTube */}
            <a href="#" className="social-icon" style={{ background: 'linear-gradient(135deg, #FF0000, #CC0000)' }} title="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>
            {/* Twitter / X */}
            <a href="#" className="social-icon" style={{ background: 'linear-gradient(135deg, #1DA1F2, #0D8BD9)' }} title="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            {/* WhatsApp */}
            <a href="#" className="social-icon" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }} title="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="social-icon" style={{ background: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF, #515BD4)' }} title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-[90%] max-w-[400px] border border-gray-200 p-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-6">{confirmMessage}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FORGOT MODAL ================= */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
          <div className="relative bg-white w-full max-w-md rounded-xl p-6">
            <button
              onClick={() => {
                setShowForgot(false);
                setStep("email");
                setOtp("");
                setResetEmail("");
                setOtpError("");
              }}
              className="absolute top-3 right-3 text-gray-400"
            >
              ✕
            </button>

            {step === "email" && (
              <>
                <h2 className="text-xl font-semibold mb-1">Forgot Password</h2>
                <p className="text-sm text-gray-500 mb-5">Enter your registered email to receive OTP</p>
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    disabled={loading}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full h-11 rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-red-500 disabled:bg-gray-100"
                  />
                  <p className="text-xs text-red-500 min-h-[16px] mt-1">{resetEmailError}</p>
                </div>
                <button
                  onClick={handleSendResetLink}
                  disabled={!resetEmail || resetEmailError || loading}
                  className={`w-full py-2.5 rounded-md text-white font-medium ${!resetEmail || resetEmailError || loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[rgb(232,3,8)] hover:bg-red-600"
                    }`}
                >
                  {loading ? <Spinner /> : "Send OTP"}
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <h2 className="text-xl font-semibold mb-1">Verify OTP</h2>
                <p className="text-sm text-gray-500 mb-6">Enter 6-digit OTP sent to your email</p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  disabled={loading}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="______"
                  className="w-full text-center text-2xl font-semibold tracking-[0.6em] border-b-2 border-gray-300 pb-3 outline-none focus:border-red-500 placeholder-gray-300"
                />
                {otpError && <p className="text-xs text-red-500 mt-2">{otpError}</p>}
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full mt-6 py-2.5 rounded-md bg-[rgb(232,3,8)] hover:bg-red-600 text-white font-medium flex justify-center items-center"
                >
                  {loading ? <Spinner /> : "Verify OTP"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= MPIN MODAL ================= */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-sm rounded-xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute top-3 right-3 text-gray-400"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold text-center mb-2">Login with MPIN</h2>
            <p className="text-sm text-gray-500 text-center mb-4">Enter your 6 digit PIN</p>
            <div className="relative">
              <input
                type={showMpin ? "text" : "password"}
                inputMode="numeric"
                placeholder="------"
                maxLength={6}
                value={mpin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setMpin(val);
                  setMpinError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerifyMpin();
                }}
                className="w-full h-12 text-center tracking-[0.6em] text-xl border border-gray-300 rounded-md outline-none focus:border-red-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowMpin(!showMpin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showMpin ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {mpinError && <p className="text-xs text-red-500 mt-2 text-center">{mpinError}</p>}
            <button
              disabled={mpinLoading}
              onClick={handleVerifyMpin}
              className={`w-full mt-5 py-2.5 rounded-md text-white font-semibold ${mpinLoading ? "bg-[rgb(232,3,8)] cursor-wait" : "bg-[rgb(232,3,8)] hover:bg-red-600"
                }`}
            >
              {mpinLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Verifying
                </span>
              ) : (
                "Verify PIN"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Spinner = () => (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

export default Login;
