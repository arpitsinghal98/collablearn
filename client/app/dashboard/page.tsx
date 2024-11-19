"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import GroupList from "./components/GroupList";
import ExploreGroups from "./components/ExploreGroups";
import RecentActivity from "./components/RecentActivity";

const Dashboard = () => {
  const [user, setUser] = useState({ firstname: "", email: "" });
  const [groups, setGroups] = useState([]);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("User not authenticated");

        // Fetch user info
        const userData = await api.getUserInfo(token);
        setUser(userData);

        // Fetch user's joined groups
        const joinedGroups = await api.getJoinedGroups(token);
        setGroups(joinedGroups);

        // Fetch suggested groups
        const suggestions = await api.listGroups();
        setSuggestedGroups(suggestions);

        // Fetch recent activity
        const activity = await api.getRecentActivity(token);
        setRecentActivity(activity);
      } catch (err) {
        setErrorMessage("Failed to load dashboard. Please try again.");
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.firstname}!</h1>
        <p className="text-gray-600">Your Dashboard</p>
      </header>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <section className="mb-6">
        <GroupList groups={groups} />
      </section>

      <section className="mb-6">
        <ExploreGroups groups={suggestedGroups} />
      </section>

      <section>
        <RecentActivity activities={recentActivity} />
      </section>
    </div>
  );
};

export default Dashboard;