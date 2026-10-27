import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";
import ForgotPasswordModal from "../components/commonModals/ForgotPasswordModal";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.email.trim()) {
      newErrors.email = "Email address is required";
    }
    if (!data.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      toast.success(res.data?.message || "Logged in successfully!");
      if (res.data?.data) {
        sessionStorage.setItem("AppUser", JSON.stringify(res.data.data));
        setUser(res.data.data);
        setIsLogin(true);
      }
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <ForgotPasswordModal open={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />

      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl justify-center text-primary">
              Login
            </h2>
            <p className="text-center text-base-content/70 mb-6">
              Welcome Back 🫡
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle size={14} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`input input-bordered w-full pr-10 ${errors.password ? "input-error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/60 hover:text-base-content cursor-pointer"
                  >
                    {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <FiAlertCircle size={14} /> {errors.password}
                  </p>
                )}
                <div className="flex justify-end mt-2">
                  <button type="button" onClick={() => setIsForgotModalOpen(true)} className="text-sm text-primary hover:underline cursor-pointer">
                    Forgot Password?
                  </button>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-base-content/60 mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center text-sm text-base-content/60 mt-6">
          We respect your privacy 🔒
        </p>
      </div>
    </div>
  );
};

export default Login;
