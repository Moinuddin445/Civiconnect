import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, KeyRound, Lock, ShieldCheck } from "lucide-react";
import Dialog from "./Dailog";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
      setStep(2);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Email not found or invalid");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/verify-otp", { email, otp });
      setStep(3);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/reset-password", { email, otp, newPassword });
      setShowSuccessDialog(true);
    } catch (err) {
      console.log(err);
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Email", icon: Mail },
    { num: 2, label: "OTP", icon: KeyRound },
    { num: 3, label: "Reset", icon: Lock },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center min-h-screen p-4">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md ">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500 from-blue-500 to-blue-600 shadow-lg shadow mb-4">
            <ShieldCheck className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Reset Password</h1>
          <p className="text-gray-600 text-sm">Recover access to your account</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  step >= s.num
                    ? "bg-blue-600 from-blue-500 to-blue-600 text-black"
                    : "bg-white border border-gray-200 rounded text-gray-500"
                }`}
              >
                {s.num}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 rounded transition-all duration-300 ${
                    step > s.num ? "bg-orange-500" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-8">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate("/signin"))}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {step > 1 ? "Back" : "Back to Login"}
          </button>

          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-5 ">
              <div>
                <label className="label-text flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-bg-white border border-gray-200 rounded"
                  placeholder="Enter your registered email"
                  required
                />
              </div>
              {error && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center gap-2 py-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send OTP
                  </>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5 ">
              <p className="text-sm text-gray-600 mb-2">
                We sent a 6-digit OTP to <span className="text-blue-600">{email}</span>
              </p>
              <div>
                <label className="label-text flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5" />
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input-bg-white border border-gray-200 rounded text-center text-xl tracking-[0.5em]"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              {error && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center gap-2 py-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Verify OTP
                  </>
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5 ">
              <div>
                <label className="label-text flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-bg-white border border-gray-200 rounded"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="label-text flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-bg-white border border-gray-200 rounded"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              {error && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center gap-2 py-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <Dialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          navigate("/signin");
        }}
        title="Password Reset Successful"
        message="Your password has been successfully reset. Please login with your new password."
        type="success"
        confirmText="Go to Login"
      />
    </div>
  );
};

export default ForgotPassword;
