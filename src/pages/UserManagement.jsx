import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { account } from "../lib/appwrite";

const BASE_URL = "https://rubbertapai-backend.vercel.app";

// Fallback dummy data
const fallbackUsers = [
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
  const [userList, setUserList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userReports, setUserReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const user = await account.get();

        console.log("🔑 Current Appwrite User ID:", user.$id);

        // ✅ Include 'email' in request body as required
        const requestBody = {
          userId: user.$id,
          API_KEY: import.meta.env.VITE_ADMIN_API_KEY,
          email: user.email,
        };

        console.log("📦 Sending POST request with JSON body:", requestBody);

        const response = await fetch(`${BASE_URL}/api/v1/admin/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        console.log("📡 Response Status:", response.status);

        if (response.ok) {
          const data = await response.json();

          console.log("✅ SUCCESS! API Response:", data.documents);
          setAllUsers(data.documents);

          if (data.success && Array.isArray(data.data)) {
            const transformedUsers = data.data.map((user) => ({
              id: user.$id,
              name:
                user.fullName ||
                (user.fName && user.lName
                  ? `${user.fName} ${user.lName}`
                  : user.username) ||
                user.email,
              image: user.imageURL || "",
              status: user.status === "disable" ? "Disabled" : "Enabled",
              email: user.email,
              role: user.role,
            }));

            setUserList(transformedUsers);
            setError(null);
            console.log(`✅ Loaded ${transformedUsers.length} users from API`);
          } else {
            console.warn("⚠️ Unexpected response format, using demo data");
            setUserList(fallbackUsers);
            setError("Unexpected API response format. Using demo data.");
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ API Error:", errorData);
          setUserList(fallbackUsers);
          setError(
            `API returned ${response.status}: ${
              errorData.error || "Using demo data"
            }`
          );
        }
      } catch (error) {
        console.error("🚨 Network error:", error);
        setUserList(fallbackUsers);
        setError("Network error. Using demo data.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const fetchUserReports = async (userId) => {
    try {
      const user = await account.get();

      const requestBody = {
        userId: user.$id,
        API_KEY: import.meta.env.VITE_ADMIN_API_KEY,
        reportedId: userId,
        email: user.email,
      };

      console.log("🔄 Fetching reports for user:", userId, requestBody);

      const response = await fetch(`${BASE_URL}/api/v1/admin/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Reports Response Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Reports response:", data);

        let reportsArray = [];
        if (data.success && Array.isArray(data.data)) {
          reportsArray = data.data;
        }

        if (reportsArray.length > 0) {
          setUserReports((prev) => ({
            ...prev,
            [userId]: reportsArray.map((report) => ({
              id: report.$id,
              name: report.reportedBy || "Anonymous",
              date: new Date(report.$createdAt).toLocaleDateString(),
              reason: report.description || "No reason provided",
            })),
          }));
        } else {
          setUserReports((prev) => ({ ...prev, [userId]: [] }));
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log("❌ Reports API failed:", errorData);
        setUserReports((prev) => ({ ...prev, [userId]: [] }));
      }
    } catch (error) {
      console.error("Error fetching user reports:", error);
      setUserReports((prev) => ({ ...prev, [userId]: [] }));
    }
  };

  const handleToggleExpand = async (id) => {
    if (expandedUserId === id) {
      setExpandedUserId(null);
    } else {
      setExpandedUserId(id);
      if (!userReports[id]) {
        await fetchUserReports(id);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const user = await account.get();
      const targetUser = userList.find((u) => u.id === id);
      const newStatus = targetUser.status !== "Enabled";

      const requestBody = {
        userId: user.$id,
        API_KEY: import.meta.env.VITE_ADMIN_API_KEY,
        reportedId: id,
        status: newStatus ? "enable" : "disable",
        email: user.email,
      };

      console.log("🔄 Making enable/disable request:", requestBody);

      const response = await fetch(`${BASE_URL}/api/v1/admin/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Enable/disable response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Enable/disable SUCCESS:", result);

        if (result.success) {
          setUserList((prev) =>
            prev.map((u) =>
              u.id === id
                ? { ...u, status: newStatus ? "Enabled" : "Disabled" }
                : u
            )
          );
          setNotif({
            message:
              result.message ||
              `User "${targetUser.name}" status updated successfully.`,
            type: "success",
          });
        } else {
          setNotif({
            message: result.message || "Failed to update user status",
            type: "error",
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Enable/disable failed:", errorData);

        setNotif({
          message: errorData.error || "Failed to update user status",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      setNotif({
        message: "Network error. Please try again.",
        type: "error",
      });
    }

    setTimeout(() => setNotif(null), 3000);
  };

  const filteredUsers = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toString().includes(search)
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 min-h-screen flex-1 bg-[#F6E6D0] p-6">
        <Navbar />
        <main className="p-10">
          <h2 className="text-4xl font-bold text-[#4B2E1E] mb-6">
            User Management
          </h2>

          {error && (
            <div
              className={`px-4 py-3 rounded mb-4 ${
                error.includes("✅")
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : error.includes("❌")
                  ? "bg-red-100 border border-red-400 text-red-700"
                  : "bg-yellow-100 border border-yellow-400 text-yellow-700"
              }`}
            >
              {error}
            </div>
          )}

          <div className="mb-6 flex items-center">
            <div className="relative">
              <img
                src="/search_icon.png"
                alt="Search Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="text"
                placeholder="Search by name or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-96 rounded-lg border-none bg-[#C2A78C] px-10 py-3 text-[#4B2E1E] placeholder-[#4B2E1E] focus:outline-none pr-10"
              />
              <img
                src="/filter.png"
                alt="Filter Icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                onClick={() => {
                  console.log("Filter icon clicked");
                }}
              />
            </div>
          </div>

          {loading && (
            <div className="text-center text-[#4B2E1E] py-8">
              Loading users...
            </div>
          )}

          {!loading && filteredUsers.length === 0 ? (
            <div className="text-center text-[#4B2E1E] py-8">
              No users found.
            </div>
          ) : (
            <div className="space-y-6">
              {allUsers.map((data, index) => (
                <div key={index}>
                  <div
                    className="flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow cursor-pointer"
                    onClick={() => handleToggleExpand(data.$id)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-poppins text-[#4B2E1E]">
                        {data.id}
                      </span>
                      {data.imageURL ? (
                        <img
                          src={data.imageURL}
                          alt={data.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-xl">
                            {data.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-lg font-poppins text-[#4B2E1E]">
                        {data.name}
                      </span>
                    </div>
                    <button
                      className={`rounded-lg px-6 py-2 text-base font-semibold transition ${
                        data.status === "Enabled"
                          ? "bg-[#FF2D2D] text-white hover:bg-[#c82323]"
                          : "bg-[#7CB154] text-white hover:bg-[#5e8c3a]"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(data.$id);
                      }}
                    >
                      {data.status === "Enabled" ? "Disable" : "Enable"}
                    </button>
                  </div>
                  {expandedUserId === data.$id && (
                    <div className="mx-4 mt-2 mb-4 rounded-xl bg-[#F6E6D0] p-6 shadow">
                      {userReports[data.$id]?.length > 0 ? (
                        <>
                          <table className="w-full text-left">
                            <thead>
                              <tr>
                                <th className="py-2 text-[#4B2E1E] font-semibold">
                                  ID
                                </th>
                                <th className="py-2 text-[#4B2E1E] font-semibold">
                                  Reported By
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
                              {userReports[user.id].map((report) => (
                                <tr key={report.id}>
                                  <td className="py-2">{report.$id}</td>
                                  <td className="py-2">{report.fullName}</td>
                                  <td className="py-2">{report.$createdAt}</td>
                                  <td className="py-2">"{report.role}</td>
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
          )}

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
