import React, { useState } from "react";
import Button from "../ui/Button";

const initialUsers = [
  {
    id: 1,
    name: "Aiken Artigas",
    email: "Artigas@example.com",
    reports: 2,
    status: "active",
  },
  {
    id: 2,
    name: "Louie Alberto Canen",
    email: "Canen@example.com",
    reports: 0,
    status: "active",
  },
  {
    id: 3,
    name: "Jacob Mayor Tapere",
    email: "Tapere@example.com",
    reports: 5,
    status: "disabled",
  },
];

const UsersTable = () => {
  const [users, setUsers] = useState(initialUsers);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "disabled" : "active" }
          : u
      )
    );
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">User Management</h2>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2 text-sm text-gray-600">ID</th>
            <th className="px-3 py-2 text-sm text-gray-600">Name</th>
            <th className="px-3 py-2 text-sm text-gray-600">Email</th>
            <th className="px-3 py-2 text-sm text-gray-600">Reports</th>
            <th className="px-3 py-2 text-sm text-gray-600">Status</th>
            <th className="px-3 py-2 text-right text-sm text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2">{u.id}</td>
              <td className="px-3 py-2">{u.name}</td>
              <td className="px-3 py-2">{u.email}</td>
              <td className="px-3 py-2">{u.reports}</td>
              <td className="px-3 py-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    u.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {u.status}
                </span>
              </td>
              <td className="px-3 py-2 text-right">
                <Button
                  variant={u.status === "active" ? "secondary" : "primary"}
                  onClick={() => toggleStatus(u.id)}
                >
                  {u.status === "active" ? "Disable" : "Enable"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
