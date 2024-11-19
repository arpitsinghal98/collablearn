"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

const CreateGroupPage = () => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken") || "";
      await api.createGroup({ name: groupName, description: groupDescription }, token);
      router.push("/groups"); // Navigate back to the groups list
    } catch (error) {
      setErrorMessage("Failed to create group. Please try again.");
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Group</h1>
        <form onSubmit={handleCreateGroup}>
          <label className="block mb-2 font-medium">Group Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded mb-4"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Group Description</label>
          <textarea
            className="w-full border p-2 rounded mb-4"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Create Group
          </button>
        </form>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default CreateGroupPage;