import React from "react";

const ExploreGroups = ({ groups }: { groups: Array<{ id: number; name: string; description: string }> }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Explore Groups</h2>
      {groups.length > 0 ? (
        <ul>
          {groups.map((group) => (
            <li key={group.id} className="border p-4 mb-2 rounded shadow">
              <h3 className="text-lg font-medium">{group.name}</h3>
              <p>{group.description}</p>
              <button className="text-green-500" onClick={() => console.log("Join group", group.id)}>
                Join
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No groups available to explore.</p>
      )}
    </div>
  );
};

export default ExploreGroups;