import React from "react";

const RecentActivity = ({ activities }: { activities: Array<{ id: number; message: string; timestamp: string }> }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      {activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id} className="border p-4 mb-2 rounded shadow">
              <p>{activity.message}</p>
              <p className="text-gray-500 text-sm">{new Date(activity.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activity to show.</p>
      )}
    </div>
  );
};

export default RecentActivity;