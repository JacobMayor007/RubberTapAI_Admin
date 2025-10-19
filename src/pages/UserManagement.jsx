import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const BASE_URL = import.meta.env.VITE_API_URL;

const userId = localStorage.getItem("userId");

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userReportsList, setUserReportsList] = useState([]);
  const [reportersCache, setReportersCache] = useState({});
  const [admin, setAdmin] = useState();
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [error, setError] = useState(null);

  console.log("BASE URL: ", typeof BASE_URL);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        console.log(userId);

        const result = await fetch(`${BASE_URL}/api/v1/users/user/${userId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const dataAdmin = await result.json();
        setAdmin(dataAdmin);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdminData();
  }, [userId]);

  useEffect(() => {
    const fetchReportedUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestBody = {
          userId: admin.$id,
          API_KEY: admin.API_KEY,
          email: admin.email,
        };

        console.log("Request Body: ", requestBody);

        const response = await fetch(`${BASE_URL}/api/v1/admin/reports`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${
              errorData.message || "Unknown server error"
            }`
          );
        }

        const data = await response.json();

        // Transform API data (flat list of reports) into the grouped UI structure
        const groupedUsers = data.reduce((acc, report) => {
          const id = report.reported_id;

          if (!acc[id]) {
            acc[id] = {
              id: id,
              name: report.reported_id_name || "Unknown User",
              image: report.reported_id_image || "",
              status:
                report.status && report.status.toLowerCase() === "disable"
                  ? "Disabled"
                  : "Enabled",
              reports: [],
            };
          }

          acc[id].reports.push({
            id: report.$id,
            reporterId: report.reportedBy,
            name: report.reportedBy_Name || "Unknown Reporter",
            date: new Date(report.$createdAt).toLocaleDateString(),
            reason: report.description,
          });
          return acc;
        }, {});

        setUserReportsList(Object.values(groupedUsers));
      } catch (err) {
        console.error("Error fetching reported users:", err);

        setUserReportsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedUsers();
  }, [userId, admin]);

  const filteredUsers = userReportsList.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toString().includes(search)
  );

  /**
   * Populates the reports cache for a specific user.
   */

  const fetchReportersForUser = useCallback(
    (reportedId) => {
      if (reportersCache[reportedId]) return;

      const user = userReportsList.find((u) => u.id === reportedId);
      if (user) {
        setReportersCache((prev) => ({
          ...prev,
          [reportedId]: user.reports,
        }));
      } else {
        setReportersCache((prev) => ({
          ...prev,
          [reportedId]: [],
        }));
      }
    },
    [userReportsList, reportersCache]
  );

  /**
   * Toggles the status of a user (Enable/Disable).
   * USES PATCH METHOD.
   */
  const handleToggleStatus = async (id, currentStatus, e) => {
    e.stopPropagation();

    try {
      const targetUser = userReportsList.find((u) => u.id === id);

      const newStatus = currentStatus === "Enabled" ? "disable" : "enable";
      const newStatusDisplay = newStatus === "enable" ? "Enabled" : "Disabled";
      const targetName = targetUser?.name || "User";

      // Safety check for API Key before proceeding
      if (!API_KEY) {
        throw new Error(
          "Missing VITE_ADMIN_API_KEY. Check your .env configuration."
        );
      }

      // API BODY: Critical for successful status change
      const requestBody = {
        userId: user.$id,
        API_KEY: API_KEY,
        reportedId: id.toString(),
        status: newStatus,
        email: user.email,
      };

      console.log("Sending status toggle request with payload:", requestBody);

      const response = await fetch(`${BASE_URL}/api/v1/admin/user`, {
        // *** Using PATCH method ***
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json().catch(() => ({}));

      // 1. Check HTTP status first
      if (!response.ok) {
        const errorMessage =
          result.message || `Server returned HTTP ${response.status}.`;
        console.error(
          `Status Toggle Failed (HTTP ${response.status}):`,
          errorMessage,
          result
        );
        throw new Error(errorMessage);
      }

      // 2. Check API payload success flag
      if (result.success) {
        // SUCCESS
        setUserReportsList((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: newStatusDisplay } : u
          )
        );

        setNotif({
          message:
            result.message || `${targetName} is now ${newStatusDisplay}.`,
          type: "success",
        });
      } else {
        // FAILURE: Backend returned 200 OK but success: false
        const errorMessage =
          result.message ||
          `Failed to set status to ${newStatusDisplay}. Reason unknown.`;
        console.error(
          `Status Toggle Failed (Success: False):`,
          errorMessage,
          result
        );
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      setNotif({
        message: err.message || "Network error. Status change failed.",
        type: "error",
      });
    }
    setTimeout(() => setNotif(null), 5000);
  };

  useEffect(() => {
    if (expandedUserId && userReportsList.length > 0) {
      fetchReportersForUser(expandedUserId);
    }
  }, [expandedUserId, userReportsList, fetchReportersForUser]);

  const handleToggleExpand = (id) => {
    const newExpandedId = expandedUserId === id ? null : id;
    setExpandedUserId(newExpandedId);
    if (newExpandedId) {
      fetchReportersForUser(newExpandedId);
    }
  };

  const expandedReports = expandedUserId ? reportersCache[expandedUserId] : [];

  // --- Rendering ---

  const renderReportsTable = (reports) => (
    <table className="w-full text-left table-fixed">
      <thead>
        <tr>
          <th className="py-2 text-[#4B2E1E] font-semibold w-[15%]">ID</th>
          <th className="py-2 text-[#4B2E1E] font-semibold w-[25%]">
            Account Name
          </th>
          <th className="py-2 text-[#4B2E1E] font-semibold w-[15%]">Date</th>
          <th className="py-2 text-[#4B2E1E] font-semibold w-[45%]">
            Report Reason
          </th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id}>
            <td className="py-2 break-all text-sm">{report.reporterId}</td>
            <td className="py-2 truncate">{report.name}</td>
            <td className="py-2 whitespace-nowrap">{report.date}</td>
            <td className="py-2 overflow-hidden text-ellipsis whitespace-nowrap">
              "{report.reason}"
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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

          {/* Search Bar with Icon */}
          <div className="mb-6 flex items-center">
            <div className="relative w-96">
              <img
                src="/search_icon.png"
                alt="Search Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="text"
                placeholder="Search ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border-none bg-[#C2A78C] pl-10 pr-4 py-3 text-[#4B2E1E] placeholder-[#4B2E1E] focus:outline-none"
              />
            </div>
          </div>

          {/* Loading/Error Feedback */}
          {loading && (
            <div className="text-center text-[#4B2E1E] py-8">
              Loading user reports...
            </div>
          )}
          {error && (
            <div
              className={`px-4 py-3 rounded mb-4 bg-red-100 border border-red-400 text-red-700`}
            >
              {error}
            </div>
          )}

          {/* User List and Expanded Reports */}
          <div className="space-y-6">
            {filteredUsers.length === 0 && !loading && !error && (
              <div className="text-center text-[#4B2E1E] py-8">
                No reported users found.
              </div>
            )}

            {filteredUsers.map((user) => (
              <div key={user.id}>
                {/* Main User Row */}
                <div
                  className={`flex items-center justify-between rounded-xl bg-white px-6 py-4 shadow cursor-pointer transition ${
                    expandedUserId === user.id
                      ? "ring-2 ring-offset-2 ring-[#C2A78C]"
                      : ""
                  }`}
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
                      handleToggleStatus(user.id, user.status, e);
                    }}
                  >
                    {user.status === "Enabled" ? "Disable" : "Enable"}
                  </button>
                </div>

                {/* Expanded Reports Section */}
                {expandedUserId === user.id && (
                  <div className="mx-4 mt-2 mb-4 rounded-xl bg-white p-6 shadow">
                    {expandedReports.length > 0 ? (
                      <>
                        {renderReportsTable(expandedReports)}
                        <div className="mt-4 text-md text-[#4B2E1E] font-semibold">
                          List of accounts who reported this user (
                          {expandedReports.length} total reports).
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-[#4B2E1E]">
                        No specific reports available for this user.
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
              className={`fixed top-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg font-semibold transition ${
                notif.type === "success"
                  ? "bg-[#7CB154] text-white"
                  : "bg-red-500 text-white"
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
