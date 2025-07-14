import React, { useState } from "react";
import { loginInputSchema, registerInputSchema } from "../schema/authSchema";
import { clientLogin, clientRegister } from "../api/auth";
import { getErrorMessage } from "../helper/getError";

// Helper function สำหรับ handle error

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  
 
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>("");
  const [loading, setLoading] = useState(false);

 
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Toggle between login/register
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setApiError("");
  
    setFormData(prev => ({
      ...prev,
      username: ""
    }));
  };

  // Validate form with Zod
  const validateForm = () => {
    const schema = isLogin ? loginInputSchema : registerInputSchema;
    const dataToValidate = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;
    
    const result = schema.safeParse(dataToValidate);
    
    if (!result.success) {
      const errorMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errorMap[issue.path[0] as string] = issue.message;
      });
      setErrors(errorMap);
      return false;
    }
    
    setErrors({});
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    // Validate first
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      if (isLogin) {
        const result = await clientLogin({
          email: formData.email,
          password: formData.password
        });
        
        if (result?.success) {
          alert("Login successful!");
          // Reset form
          setFormData({ email: "", username: "", password: "" });
        } else {
          setApiError(result?.error || "Login failed");
        }
      } else {
        const result = await clientRegister(formData);
        
        if (result?.success) {
          alert("Registration successful!");
          // Switch to login mode after successful registration
          setIsLogin(true);
          setFormData(prev => ({ ...prev, username: "", password: "" }));
        } else {
          setApiError(result?.error || "Registration failed");
        }
      }
      
    } catch (error: unknown) {
      setApiError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        
        {/* API Error Display */}
        {apiError && (
          <div style={{ 
            color: 'red', 
            marginBottom: '10px', 
            padding: '10px', 
            border: '1px solid red', 
            borderRadius: '4px',
            backgroundColor: '#fee' 
          }}>
            {apiError}
          </div>
        )}

        {/* Email Field */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleOnChange}
            style={{
              width: '100%',
              padding: '10px',
              border: errors.email ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.email && (
            <p style={{ color: 'red', fontSize: '14px', margin: '5px 0 0 0' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Username Field (only for register) */}
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleOnChange}
              style={{
                width: '100%',
                padding: '10px',
                border: errors.username ? '1px solid red' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            {errors.username && (
              <p style={{ color: 'red', fontSize: '14px', margin: '5px 0 0 0' }}>
                {errors.username}
              </p>
            )}
          </div>
        )}

        {/* Password Field */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleOnChange}
            style={{
              width: '100%',
              padding: '10px',
              border: errors.password ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errors.password && (
            <p style={{ color: 'red', fontSize: '14px', margin: '5px 0 0 0' }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
        </button>

        {/* Toggle Button */}
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;