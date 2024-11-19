"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api"; // API utility for backend communication

type Group = {
  id: number;
  name: string;
  description: string;
};

const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data: Group[] = await api.listGroups(); // Fetch groups from the backend
        console.log('Arpit: ',data);
        setGroups(data);
      } catch (error) {
        setErrorMessage("Failed to load groups. Please try again.");
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Available Groups</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {groups.length === 0 && !errorMessage && (
        <p className="text-gray-600">No groups available.</p>
      )}
      <ul>
        {groups.map((group) => (
          <li
            key={group.id}
            className="border p-4 mb-2 rounded shadow hover:bg-gray-50"
          >
            <h2 className="text-lg font-medium">{group.name}</h2>
            <p>{group.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsPage;