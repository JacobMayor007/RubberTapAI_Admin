import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

// Dummy user data
const users = [
  {
    id: 1001,
    name: "Louie Alberto Canen",
    image: "/louie.png",
    status: "Disabled",
    reports: [
      {
        id: 1002,
        name: "Jacob Mayor Tapere",
        date: "10/29/2024",
        reason: "This Account has scamming issues.",
      },
      {
        id: 1003,
        name: "Pablo Escobar",
        date: "11/02/2025",
        reason: "This account is rude during negotiation",
      },
      {
        id: 1004,
        name: "Pablo Borsalino",
        date: "12/29/2025",
        reason: "This account is rude during negotiation",
      },
      {
        id: 1005,
        name: "Shanks Figarland",
        date: "12/29/2025",
        reason: "This account is rude during negotiation",
      },
      {
        id: 1010,
        name: "Garling Figarland",
        date: "12/29/2025",
        reason: "This account is rude during negotiation",
      },
    ],
  },
  {
    id: 1002,
    name: "Jacob Mayor Tapere",
    image: "/jacob.png",
    status: "Disabled",
    reports: [],
  },
  {
    id: 1003,
    name: "Aiken Artigas",
    image: "/aiken.png",
    status: "Enabled",
    reports: [],
  },
  {
    id: 1004,
    name: "Joy Anne Lutero",
    image: "",
    status: "Enabled",
    reports: [],
  },
];

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userList, setUserList] = useState(users);
  const [notif, setNotif] = useState("");

  const filteredUsers = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toString().includes(search)
  );

  const handleToggleExpand = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  const handleToggleStatus = (id) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "Enabled" ? "Disabled" : "Enabled",
            }
          : u
      )
    );
    const user = userList.find((u) => u.id === id);
    if (user) {
      setNotif({
        message: `User "${user.name}" is now ${
          user.status === "Enabled" ? "Disabled" : "Enabled"
        }.`,
        type: user.status === "Enabled" ? "error" : "success",
      });
      setTimeout(() => setNotif(null), 2000);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 min-h-screen flex-1 bg-[#F6E6D0] p-6">
        <Navbar />
        <main className="p-10">
          <h2 className="text-4xl font-bold text-[#4B2E1E] mb-6">
            User Management
          </h2>
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Search ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-96 rounded-lg border-none bg-[#C2A78C] px-4 py-3 text-[#4B2E1E] placeholder-[#4B2E1E] focus:outline-none"
            />
          </div>
          <div className="space-y-6">
            {filteredUsers.map((user) => (
              <div key={user.id}>
                <div
                  className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow cursor-pointer"
                  onClick={() => handleToggleExpand(user.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-poppins text-[#4B2E1E]">
                      {user.id}
                    </span>
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-xl">●</span>
                      </div>
                    )}
                    <span className="text-lg font-poppins text-[#4B2E1E]">
                      {user.name}
                    </span>
                  </div>
                  <button
                    className={`rounded-lg px-6 py-2 text-base font-semibold transition ${
                      user.status === "Enabled"
                        ? "bg-[#7CB154] text-white hover:bg-[#5e8c3a]"
                        : "bg-[#FF2D2D] text-white hover:bg-[#c82323]"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(user.id);
                    }}
                  >
                    {user.status === "Enabled" ? "Disable" : "Enable"}
                  </button>
                </div>
                {expandedUserId === user.id && (
                  <div className="mx-4 mt-2 mb-4 rounded-xl bg-[#F6E6D0] p-6 shadow">
                    {user.reports.length > 0 ? (
                      <>
                        <table className="w-full text-left">
                          <thead>
                            <tr>
                              <th className="py-2 text-[#4B2E1E] font-semibold">
                                ID
                              </th>
                              <th className="py-2 text-[#4B2E1E] font-semibold">
                                Account Name
                              </th>
                              <th className="py-2 text-[#4B2E1E] font-semibold">
                                Date
                              </th>
                              <th className="py-2 text-[#4B2E1E] font-semibold">
                                Report Reason
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {user.reports.map((report) => (
                              <tr key={report.id}>
                                <td className="py-2">{report.id}</td>
                                <td className="py-2">{report.name}</td>
                                <td className="py-2">{report.date}</td>
                                <td className="py-2">"{report.reason}"</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-2 text-sm text-[#4B2E1E]">
                          Here is the list of accounts who reported the said
                          user.
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-[#4B2E1E]">
                        No reports for this user.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Notification */}
          {notif && (
            <div
              className={`fixed top-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition ${
                notif.type === "success" ? "bg-[#7CB154]" : "bg-[#FF2D2D]"
              }`}
            >
              {notif.message}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
