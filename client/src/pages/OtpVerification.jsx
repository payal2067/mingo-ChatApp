import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FiKey, FiArrowRight } from "react-icons/fi";
import api from "../config/api";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      // NOTE: Ensure your backend has the matching route (e.g., /auth/verify-otp)
      const res = await api.post("/auth/verify-otp", { email, otp });
      toast.success(res.data?.message || "OTP Verified Successfully!");
      navigate("/login"); 
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl justify-center text-primary">
              Verify OTP
            </h2>
            <p className="text-center text-base-content/70 mb-6">
              Enter the verification code sent to <br/>
              <span className="font-semibold">{email || "your email"}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <FiKey size={18} />
                  </div>
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    className="input input-bordered w-full pl-10 tracking-[0.5em] text-center font-bold text-lg"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || otp.length < 4}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify <FiArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <button className="text-sm text-primary hover:underline cursor-pointer">
                Resend OTP
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-base-content/60 mt-6">
          We respect your privacy 🔒
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
