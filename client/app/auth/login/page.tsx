"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api, {setAccessToken} from "@/utils/api"; // Import the centralized API utility

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  // Automatically focus on the password field when email is verified
  useEffect(() => {
    if (isEmailChecked && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [isEmailChecked]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true); // Start loading

    try {
      // Call API to check if the email exists
      const response = await api.checkEmail(email);

      setIsLoading(false); // Stop loading
      if (response.exists) {
        // If email exists, proceed to password entry
        setIsEmailChecked(true);
      } else {
        // Redirect to registration page with prefilled email
        router.push(`/auth/register?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      setIsLoading(false); // Stop loading
      setErrorMessage("An error occurred while checking your email. Please try again.");
      console.error("Error checking email:", error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true); // Start loading
  
    try {
      // Call API to log in with email and password
      const response = await api.login(email, password);
  
      console.log(response.access_token)
      // Store the access token
      setAccessToken(response.access_token);

      
  
      setIsLoading(false); // Stop loading
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setIsLoading(false); // Stop loading
      setErrorMessage("Invalid password. Please try again.");
      console.error("Login failed:", error);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        {!isEmailChecked ? (
          // Email input form
          <form onSubmit={handleEmailSubmit}>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading} // Disable while loading
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={isLoading} // Disable while loading
            >
              {isLoading ? "Checking..." : "Next"}
            </button>
          </form>
        ) : (
          // Password input form
          <form onSubmit={handlePasswordSubmit}>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded mb-4 bg-gray-100 cursor-not-allowed"
              value={email}
              disabled // Make email non-editable
            />
            <label className="block mb-2 font-medium">Password</label>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border p-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordInputRef} // Focus when entering password step
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsEmailChecked(false)} // Go back to email input
                className="text-blue-500 hover:underline"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                disabled={isLoading} // Disable while loading
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        )}

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
