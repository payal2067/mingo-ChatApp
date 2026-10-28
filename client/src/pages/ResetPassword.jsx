import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setIsLogin } = useAuth();
  const email = location.state?.email || "";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Guard: if no email in state, redirect to login
  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please start again.");
      navigate("/login");
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        email,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      // Auto-login: save user session & redirect to chat
      if (res.data?.data) {
        sessionStorage.setItem("AppUser", JSON.stringify(res.data.data));
        setUser(res.data.data);
        setIsLogin(true);
      }

      setSuccess(true);
      toast.success("Password reset! Welcome back 🎉");
      setTimeout(() => navigate("/chat"), 1500);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    if (pwd.length < 6) return { level: 1, label: "Weak", color: "bg-error" };
    if (pwd.length < 8) return { level: 2, label: "Fair", color: "bg-warning" };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd))
      return { level: 4, label: "Strong", color: "bg-success" };
    return { level: 3, label: "Good", color: "bg-info" };
  };

  const strength = getStrength(formData.newPassword);
  const passwordsMatch =
    formData.confirmPassword && formData.newPassword === formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl border border-base-content/10">
          <div className="card-body">
            {/* Header */}
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <FiLock size={28} className="text-primary" />
              </div>
              <h2 className="card-title text-3xl justify-center text-primary font-extrabold tracking-tight">
                New Password
              </h2>
              <p className="text-base-content/60 text-sm mt-1">
                Create a strong password for{" "}
                <span className="font-semibold text-base-content">{email}</span>
              </p>
            </div>

            {/* Success State */}
            {success ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <FiCheckCircle size={52} className="text-success" />
                <p className="text-success font-semibold text-lg">Password Reset!</p>
                <p className="text-base-content/60 text-sm">Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                {/* New Password */}
                <div>
                  <label className="label pb-1">
                    <span className="label-text font-medium">New Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                      <FiLock size={18} />
                    </div>
                    <input
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={loading}
                      className={`input input-bordered w-full pl-10 pr-10 ${
                        errors.newPassword ? "input-error" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-base-content"
                    >
                      {showNew ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {formData.newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.level ? strength.color : "bg-base-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs mt-1 font-medium ${
                        strength.level === 1 ? "text-error" :
                        strength.level === 2 ? "text-warning" :
                        strength.level === 3 ? "text-info" : "text-success"
                      }`}>
                        {strength.label}
                      </p>
                    </div>
                  )}

                  {errors.newPassword && (
                    <p className="text-error text-sm mt-1 flex items-center gap-1">
                      <FiAlertCircle size={14} /> {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="label pb-1">
                    <span className="label-text font-medium">Confirm Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                      <FiLock size={18} />
                    </div>
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      className={`input input-bordered w-full pl-10 pr-10 ${
                        errors.confirmPassword
                          ? "input-error"
                          : passwordsMatch
                          ? "input-success"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-base-content"
                    >
                      {showConfirm ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                    </button>
                  </div>

                  {/* Match indicator */}
                  {formData.confirmPassword && (
                    <p
                      className={`text-xs mt-1 flex items-center gap-1 font-medium ${
                        passwordsMatch ? "text-success" : "text-error"
                      }`}
                    >
                      {passwordsMatch ? (
                        <><FiCheckCircle size={13} /> Passwords match</>
                      ) : (
                        <><FiAlertCircle size={13} /> Passwords do not match</>
                      )}
                    </p>
                  )}

                  {errors.confirmPassword && (
                    <p className="text-error text-sm mt-1 flex items-center gap-1">
                      <FiAlertCircle size={14} /> {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>
            )}

            {!success && (
              <p className="text-center text-sm text-base-content/60 mt-4">
                Remember your password?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login
                </Link>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-base-content/60 mt-6">
          We respect your privacy 🔒
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
