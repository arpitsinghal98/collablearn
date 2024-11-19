"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router

const Home = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth/login"); // Navigate to the login page
  };

  const handleExploreGroups = () => {
    router.push("/groups");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-6">
          Welcome to CollabLearn
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Collaborate, Learn, and Achieve with AI-powered assistance and group collaboration.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleGetStarted}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
          >
            Get Started
          </button>
          <button
            onClick={handleExploreGroups}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
          >
            Explore Groups
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;