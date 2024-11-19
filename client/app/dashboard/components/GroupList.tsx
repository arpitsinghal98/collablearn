import React from "react";

const GroupList = ({ groups }: { groups: Array<{ id: number; name: string; description: string }> }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Groups</h2>
      {groups.length > 0 ? (
        <ul>
          {groups.map((group) => (
            <li key={group.id} className="border p-4 mb-2 rounded shadow">
              <h3 className="text-lg font-medium">{group.name}</h3>
              <p>{group.description}</p>
              <div className="flex space-x-4">
                <button className="text-blue-500" onClick={() => console.log("View group", group.id)}>
                  View
                </button>
                <button className="text-red-500" onClick={() => console.log("Leave group", group.id)}>
                  Leave
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven’t joined any groups yet.</p>
      )}
    </div>
  );
};

export default GroupList;