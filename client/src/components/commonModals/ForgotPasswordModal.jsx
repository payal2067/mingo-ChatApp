import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiX } from "react-icons/fi";
import api from "../../config/api";

const ForgotPasswordModal = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    try {
      const formattedEmail = email.trim().toLowerCase();
      const res = await api.post("/auth/forgot-password", { email: formattedEmail });
      toast.success(res.data?.message || "OTP sent to your email!");
      onClose();
      navigate("/verify-otp", { state: { email: formattedEmail } });
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <FiX size={20} />
        </button>

        <div className="card-body">
          <div className="text-center mb-4">
            <h2 className="card-title text-2xl justify-center text-primary mb-2">
              Reset Password
            </h2>
            <p className="text-base-content/70 text-sm">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <FiMail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  disabled={loading}
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
