import React, { useEffect, useState } from "react";
import { handleApiError } from "../../helper/getError";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useErrorStore } from "../../store/useErrorStore";
import { ApiClientError } from "../../helper/apiClient";
import { FormInput } from "../common/FormInput";
import { ErrorAlert } from "../common/ErrorAlert";
import { Cherry } from "lucide-react";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  // Auth state
  const { isLoading, isAuthenticated } = useAuthStore();
  const { register, login } = useAuthStore();

  // Error state
  const { error } = useErrorStore();
  const {
    setError,
    setFormErrors,
    setPageErrors,
    getFieldErrors,
    hasFieldErrors,
    clearFormErrors,
  } = useErrorStore();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearFormErrors("loginForm");
    clearFormErrors("registerForm");
    setFormData({
      email: "",
      username: "",
      password: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formName = isLogin ? "loginForm" : "registerForm";
    try {
      clearFormErrors(formName);
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });
        setFormData({ email: "", username: "", password: "" });
      }
    } catch (error) {
      if (error instanceof ApiClientError) {
        console.error("handleSubmit auth error:", error.data);
        handleApiError(error, {
          formName,
          pageName: "authPage",
          setError,
          setFormErrors,
          setPageErrors,
        });
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  const currentForm = isLogin ? "loginForm" : "registerForm";

  return (
    <div className="z-50 min-h-screen flex items-center  justify-center p-4">
      <div className="relative bg-brandCream-50 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-8 text-3xl font-bold text-brandChoco-50 mb-2">
            <Cherry />
            <p>{isLogin ? "Welcome Back" : "Create Account"}</p>
            <Cherry />
          </div>
          <p className="text-brandChoco-50">
            {isLogin ? "Sign in to your account" : "Join us today"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* API Error Alert */}
          {error && error.type !== "validation" && (
            <ErrorAlert message={error.message} />
          )}

          {/* Email Field */}
          <FormInput
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleOnChange}
            hasError={hasFieldErrors(currentForm, "email")}
            errorMessage={getFieldErrors(currentForm, "email")}
          />

          {/* Username Field (Register only) */}
          {!isLogin && (
            <FormInput
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleOnChange}
              hasError={hasFieldErrors(currentForm, "username")}
              errorMessage={getFieldErrors(currentForm, "username")}
            />
          )}

          {/* Password Field */}
          <FormInput
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleOnChange}
            hasError={hasFieldErrors(currentForm, "password")}
            errorMessage={getFieldErrors(currentForm, "password")}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-xl text-white transition-all duration-200 ${
              isLoading
                ? "bg-brandStrawberry-100 cursor-not-allowed"
                : "bg-brandStrawberry-50 hover:bg-brandGreen-50 hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-brandChoco-50 border-t-transparent rounded-full animate-spin"></div>
                {isLogin ? "Signing in..." : "Creating account..."}
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>

          {/* Toggle Mode */}
          <div className="text-center pt-4 border-t border-brandChoco-50">
            <p className="text-brandChoco-50">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-text-brandChoco-50 font-semibold hover:text-brandChoco-50 hover:underline transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-brandChoco-50 text-sm mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>


        <div className="absolute top-4 left-4 -rotate-30 ">🧁</div>
        <div className="absolute top-16 right-8 ">🍯</div>
        <div className="absolute bottom-20 left-6 ">🍪</div>
        <div className="absolute bottom-14 left-52 rotate-30  ">🧁</div>
        <div className="absolute top-24 right-30  ">🍪</div>

      </div>
    </div>
  );
}

export default AuthForm;
