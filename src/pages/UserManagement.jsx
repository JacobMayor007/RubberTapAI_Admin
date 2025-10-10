import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { account } from "../lib/appwrite";
import { adminApi } from "../lib/adminApi";

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
  const [userReports, setUserReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [notif, setNotif] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const user = await account.get();
        const adminData = {
          userId: user.$id,
          email: user.email,
          API_KEY: import.meta.env.VITE_ADMIN_API_KEY
        };
        
        console.log("👤 UserManagement - Admin data:", {
          userId: user.$id,
          email: user.email,
          apiKey: adminData.API_KEY ? "✓ Loaded" : "✗ Missing"
        });
        
        setAdminData(adminData);
        
        // Test API first
        const testResult = await adminApi.testAdminAPI(adminData);
        console.log("🧪 UserManagement API Test:", testResult);
        
        if (testResult.success) {
          setError(null);
          fetchUsers(adminData);
        } else {
          setError(`API Connection Failed: ${testResult.error}. Using demo data.`);
          setUserList(fallbackUsers);
          setLoading(false);
        }
        
      } catch (error) {
        console.error("Error getting admin data:", error);
        setError("Failed to load admin data. Using demo data.");
        setUserList(fallbackUsers);
        setLoading(false);
      }
    };
    getAdminData();
  }, []);

  const fetchUsers = async (adminData) => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Fetching users from API...");
      
      const response = await adminApi.getAllUsers(adminData);
      console.log("👥 Users API Response:", response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const transformedUsers = response.data.map(user => ({
          id: user.$id,
          name: user.fullName || user.username || user.email,
          image: user.imageURL || '',
          status: user.status === "disabled" ? "Disabled" : "Enabled",
          email: user.email,
          role: user.role
        }));
        setUserList(transformedUsers);
        console.log(`✅ Loaded ${transformedUsers.length} users from backend`);
      } else {
        setError(`API returned: ${response.message || 'No users data available'}. Using demo data.`);
        setUserList(fallbackUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(`Cannot connect to backend: ${error.message}. Using demo data.`);
      setUserList(fallbackUsers);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReports = async (userId) => {
    if (!adminData) return;
    
    try {
      console.log("Fetching reports for user:", userId);
      const response = await adminApi.getUserReports(adminData, userId);
      if (response.success && response.data && Array.isArray(response.data)) {
        setUserReports(prev => ({
          ...prev,
          [userId]: response.data.map(report => ({
            id: report.$id,
            name: report.reportedBy || 'Anonymous',
            date: new Date(report.$createdAt).toLocaleDateString(),
            reason: report.description || 'No reason provided'
          }))
        }));
      } else {
        setUserReports(prev => ({
          ...prev,
          [userId]: []
        }));
      }
    } catch (error) {
      console.error("Error fetching user reports:", error);
      setUserReports(prev => ({
        ...prev,
        [userId]: []
      }));
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
    if (!adminData) {
      // Fallback: update local state only
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
      return;
    }
    
    try {
      const user = userList.find((u) => u.id === id);
      const newStatus = user.status !== "Enabled"; // true for enable, false for disable
      
      const response = await adminApi.toggleUserStatus(adminData, id, newStatus);

      if (response.success) {
        setUserList((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  status: newStatus ? "Enabled" : "Disabled",
                }
              : u
          )
        );
        setNotif({
          message: response.message || `User "${user.name}" status updated successfully.`,
          type: "success",
        });
      } else {
        setNotif({
          message: response.message || "Failed to update user status",
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
            <div className={`px-4 py-3 rounded mb-4 ${
              error.includes("✅") 
                ? "bg-green-100 border border-green-400 text-green-700"
                : error.includes("❌") 
                ? "bg-red-100 border border-red-400 text-red-700"
                : "bg-yellow-100 border border-yellow-400 text-yellow-700"
            }`}>
              {error}
            </div>
          )}

          <div className="mb-6 flex items-center">
            <div className="relative">
              {/* Search Icon */}
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
              {/* Filter Icon */}
              <img
                src="/filter.png" // Make sure you have this icon in your public folder
                alt="Filter Icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                onClick={() => {
                  // Add filter functionality here if needed
                  console.log("Filter icon clicked");
                }}
              />
            </div>
          </div>

          {loading && (
            <div className="text-center text-[#4B2E1E] py-8">Loading users...</div>
          )}

          {!loading && filteredUsers.length === 0 ? (
            <div className="text-center text-[#4B2E1E] py-8">
              No users found.
            </div>
          ) : (
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
                          <span className="text-gray-500 text-xl">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-lg font-poppins text-[#4B2E1E]">
                        {user.name}
                      </span>
                    </div>
                    <button
                      className={`rounded-lg px-6 py-2 text-base font-semibold transition ${
                        user.status === "Enabled"
                          ? "bg-[#FF2D2D] text-white hover:bg-[#c82323]"
                          : "bg-[#7CB154] text-white hover:bg-[#5e8c3a]"
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
                      {userReports[user.id]?.length > 0 ? (
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
                                  <td className="py-2">{report.id}</td>
                                  <td className="py-2">{report.name}</td>
                                  <td className="py-2">{report.date}</td>
                                  <td className="py-2">"{report.reason}"</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="mt-2 text-sm text-[#4B2E1E]">
                            Here is the list of accounts who reported the said user.
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