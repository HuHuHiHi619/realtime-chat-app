import React, { useEffect, useState } from "react";
import { handleApiError } from "../../helper/getError";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useErrorStore } from "../../store/useErrorStore";
import { ApiClientError } from "../../helper/apiClient";
import { FormInput } from "../common/FormInput";
import { ErrorAlert } from "../common/ErrorAlert";

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
    <div className="min-h-screen bg-gray-900 flex items-center  justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600">
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
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isLogin ? "Signing in..." : "Creating account..."}
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>

          {/* Toggle Mode */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
