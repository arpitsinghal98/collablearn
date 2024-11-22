const RecentActivity = ({ activities }: { activities: { id: number; message: string; timestamp: string }[] }) => (
  <div>
    {activities.map((activity) => (
      <div key={activity.id} className="p-4 mb-2 border rounded">
        <p>{activity.message}</p>
        <p className="text-gray-500 text-sm">{new Date(activity.timestamp).toLocaleString()}</p>
      </div>
    ))}
  </div>
);

export default RecentActivity;