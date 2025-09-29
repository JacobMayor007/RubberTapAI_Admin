const sampleReports = [
  { id: 1, user: "John Doe", issue: "Inappropriate post", status: "Pending" },
  { id: 2, user: "Jane Smith", issue: "Fake account", status: "Resolved" },
  { id: 3, user: "Alex Cruz", issue: "Harassment", status: "Investigating" },
];

const ReportTable = () => {
  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">Recent Reports</h2>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2 text-sm text-gray-600">ID</th>
            <th className="px-3 py-2 text-sm text-gray-600">User</th>
            <th className="px-3 py-2 text-sm text-gray-600">Issue</th>
            <th className="px-3 py-2 text-sm text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {sampleReports.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2">{r.id}</td>
              <td className="px-3 py-2">{r.user}</td>
              <td className="px-3 py-2">{r.issue}</td>
              <td className="px-3 py-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    r.status === "Resolved"
                      ? "bg-green-100 text-green-600"
                      : r.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
