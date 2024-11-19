"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import api from "@/utils/api"; // Import the centralized API utility
import { AxiosError } from "axios"; // Import AxiosError for error typing

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Check if confirmEmail matches email
    if (formData.email !== formData.confirmEmail) {
      setErrorMessage("Email and Confirm Email do not match.");
      return;
    }

    // Check if confirmPassword matches password
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.");
      return;
    }

    try {
      // Call API to register the user
      const response = await api.register({
        email: formData.email,
        password: formData.password,
        firstname: formData.firstname,
        lastname: formData.lastname,
      });

      console.log("Registration successful:", response);
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000); // Redirect to login page
    } catch (error: unknown) {
      // Use AxiosError to extract the error message from the response
      if (error instanceof AxiosError && error.response) {
        setErrorMessage(error.response.data.detail || "An error occurred. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <form onSubmit={handleRegister}>
          <label className="block mb-2 font-medium">First Name</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            className="w-full border p-2 rounded mb-4"
            required
          />

          <label className="block mb-2 font-medium">Last Name</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            className="w-full border p-2 rounded mb-4"
            required
          />

          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border p-2 rounded mb-4"
            required
          />

          <label className="block mb-2 font-medium">Confirm Email</label>
          <div className="relative mb-4">
            <input
              type="email"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
              onPaste={(e) => e.preventDefault()} // Disable paste
            />
          </div>

          <label className="block mb-2 font-medium">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
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

          <label className="block mb-2 font-medium">Confirm Password</label>
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
              onPaste={(e) => e.preventDefault()} // Disable paste
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;