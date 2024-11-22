const ExploreGroups = ({ groups }: { groups: { id: number; name: string; description: string }[] }) => (
  <div>
    {groups.map((group) => (
      <div key={group.id} className="p-4 mb-2 border rounded">
        <h3 className="font-semibold">{group.name}</h3>
        <p className="text-gray-600">{group.description}</p>
      </div>
    ))}
  </div>
);

export default ExploreGroups;