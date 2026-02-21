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

          <div className="mt-6 text-center">
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
            <div className="dev-wrapper">
              <p className="dev-text">
                Developed by <span>Datatech Software</span>
              </p>
              <span className="dev-underline"></span>
            </div>



            <p className="text-md text-gray-500 mt-6 leading-relaxed font-bold">
              H.O. Telenga Bazar ,Bamphi Sahi , Cuttack-753009
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
