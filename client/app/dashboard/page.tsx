"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import GroupList from "./components/GroupList";
import ExploreGroups from "./components/ExploreGroups";
import RecentActivity from "./components/RecentActivity";
import { AxiosError } from "axios";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ firstname: string; email: string }>({ firstname: "", email: "" });
  const [groups, setGroups] = useState([]);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch user information
        const userData = await api.getUserInfo();
        setUser(userData);

        // Fetch joined groups
        const joinedGroups = await api.getJoinedGroups();
        setGroups(joinedGroups);

        // Fetch suggested groups
        const allGroups = await api.listGroups();
        const suggestions = allGroups.filter(
          (group: { id: number }) => !joinedGroups.some((jg: { id: number }) => jg.id === group.id)
        );
        setSuggestedGroups(suggestions);

        // Fetch recent activity
        const activity = await api.getRecentActivity();
        console.log('Arpit activity: ', activity);
        setRecentActivity(activity);

        setIsLoading(false);
      } catch (err) {
        handleError(err);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleError = (err: unknown) => {
    if (err instanceof AxiosError) {
      setErrorMessage(err.response?.data?.detail || "Failed to load dashboard.");
    } else {
      setErrorMessage("An unexpected error occurred.");
    }
    console.error("Error fetching dashboard data:", err);
  };

  const handleLogout = async () => {
    try {
      await api.logout(); // Call logout API
      router.push("/"); // Redirect to home page
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {isLoading ? (
        <div className="text-center">
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          <header className="mb-6 flex justify-between items-center">
            <div>            
              <h1 className="text-2xl font-bold">Welcome, {user.firstname || "User"}!</h1>
            <p className="text-gray-600">Your Dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </header>

          {errorMessage && <p className="text-red-500 mb-6">{errorMessage}</p>}

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
            {groups.length > 0 ? <GroupList groups={groups} /> : <p className="text-gray-500">No groups joined yet.</p>}
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Explore New Groups</h2>
            {suggestedGroups.length > 0 ? (
              <ExploreGroups groups={suggestedGroups} />
            ) : (
              <p className="text-gray-500">No groups available to explore.</p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <RecentActivity activities={recentActivity} />
            ) : (
              <p className="text-gray-500">No recent activity to display.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;