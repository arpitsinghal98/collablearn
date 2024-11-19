"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api"; // Import the centralized API utility

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      // Call API to check if the email exists
      const response = await api.checkEmail(email);

      if (response.exists) {
        // If email exists, prompt for password
        setIsEmailChecked(true);
      } else {
        // Redirect to registration page with prefilled email
        router.push(`/auth/register?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Error checking email:", error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      // Call API to log in with email and password
      const data = await api.login(email, password);
      
      console.log("Login successful:", data);
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
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
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Next
            </button>
          </form>
        ) : (
          // Password input form
          <form onSubmit={handlePasswordSubmit}>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        )}

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginPage;