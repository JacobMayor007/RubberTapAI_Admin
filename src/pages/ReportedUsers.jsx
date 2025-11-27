import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Modal } from "antd";
import "@ant-design/v5-patch-for-react-19";
import {
  Search,
  AlertTriangle,
  Ban,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  MessageSquare,
  Shield,
} from "lucide-react";

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
  const [sortBy, setSortBy] = useState("Most reported");
  const [reportModal, setReportModal] = useState(false);
  const [user, setUser] = useState("");

  console.log("BASE URL: ", BASE_URL);

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
      if (!admin?.$id || !admin?.API_KEY) {
        setLoading(false);
        return;
      }

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
              latestReportDate: new Date(0),
            };
          }

          const reportDate = new Date(report.$createdAt);
          if (reportDate > acc[id].latestReportDate) {
            acc[id].latestReportDate = reportDate;
          }

          acc[id].reports.push({
            id: report.$id,
            reporterId: report.reportedBy,
            name: report.reportedBy_Name || "Unknown Reporter",
            date: reportDate.toLocaleDateString(),
            reason: report.description,
          });
          return acc;
        }, {});

        const finalUsers = Object.values(groupedUsers).map((user) => ({
          ...user,
          reportCount: user.reports.length,
        }));

        setUserReportsList(finalUsers);
      } catch (err) {
        console.error("Error fetching reported users:", err);
        setError(err.message || "Failed to load user reports.");
        setUserReportsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedUsers();
  }, [admin]);

  const filteredUsers = userReportsList.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toString().includes(search)
  );

  const sortedAndFilteredUsers = filteredUsers.sort((a, b) => {
    if (sortBy === "Most reported") {
      return b.reportCount - a.reportCount;
    } else if (sortBy === "Recent reports") {
      return b.latestReportDate.getTime() - a.latestReportDate.getTime();
    }
    return 0;
  });

  const handleToggleStatus = async (id, currentStatus, e) => {
    e.stopPropagation();
    const user = admin;

    try {
      const targetUser = userReportsList.find((u) => u.id === id);

      const newStatus = currentStatus === "Enabled" ? "disable" : "enable";
      const newStatusDisplay = newStatus === "enable" ? "Enabled" : "Disabled";
      const targetName = targetUser?.name || "User";

      if (!admin.API_KEY) {
        throw new Error(
          "Missing VITE_ADMIN_API_KEY. Check your .env configuration."
        );
      }

      const requestBody = {
        userId: admin?.$id,
        API_KEY: admin?.API_KEY,
        reportedId: id.toString(),
        status: newStatus,
        email: admin?.email,
      };

      console.log("Sending status toggle request with payload:", requestBody);
      // ${BASE_URL}
      const response = await fetch(
        `http://192.168.1.21:3000/api/v1/admin/user`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.message || `Server returned HTTP ${response.status}.`;
        throw new Error(errorMessage);
      }

      if (result.success) {
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
        const errorMessage =
          result.message ||
          `Failed to set status to ${newStatusDisplay}. Reason unknown.`;
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

  const handleWarnUser = async () => {
    try {
      const requestBody = {
        userId: admin.$id,
        API_KEY: admin.API_KEY,
        warnedId: user,
        email: admin.email,
      };

      console.log("Hello: ", requestBody);

      const response = await fetch(`${BASE_URL}/api/v1/admin/warn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorMessage =
          result.message || `Failed to warn user. HTTP ${response.status}.`;
        throw new Error(errorMessage);
      }

      setNotif({
        message: `Successfully sent a warning.`,
        type: "success",
      });
    } catch (err) {
      console.error("Error warning user:", err);
      setNotif({
        message: err.message || "Network error. Warning failed.",
        type: "error",
      });
    }
    setTimeout(() => setNotif(null), 5000);
  };

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

  const renderReportsTable = (reports) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b-2 border-[#D4A373]/20">
            <th className="py-4 px-4 text-[#5D4E37] font-bold text-sm uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Reporter ID
              </div>
            </th>
            <th className="py-4 px-4 text-[#5D4E37] font-bold text-sm uppercase tracking-wider">
              Account Name
            </th>
            <th className="py-4 px-4 text-[#5D4E37] font-bold text-sm uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </div>
            </th>
            <th className="py-4 px-4 text-[#5D4E37] font-bold text-sm uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Report Reason
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr
              key={report.id}
              className="border-b border-[#D4A373]/10 hover:bg-[#F5DEB3]/20 transition-colors"
            >
              <td className="py-4 px-4 text-sm text-[#5D4E37] font-mono">
                {report.reporterId.slice(0, 12)}...
              </td>
              <td className="py-4 px-4 text-sm text-[#5D4E37] font-medium">
                {report.name}
              </td>
              <td className="py-4 px-4 text-sm text-[#8B7355]">
                {report.date}
              </td>
              <td className="py-4 px-4 text-sm text-[#8B7355] italic">
                "{report.reason}"
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex overflow-x-hidden h-screen bg-gradient-to-br from-[#F6E6D0] via-[#F5E5CC] to-[#F0DFC8]">
      <Sidebar />

      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#D4A373]/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-[#C2794D]/10 rounded-full blur-3xl -z-10" />

      <div className="ml-60 min-h-screen flex-1 p-8 animate-fadeIn">
        <Navbar />

        <main className="mt-8 py-12">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-[#C2794D] to-[#D4A373] p-3 rounded-2xl shadow-lg">
                <Shield className="text-white w-7 h-7" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#5D4E37] tracking-tight">
                  Reported Users
                </h1>
                <p className="text-[#8B7355] text-sm mt-1">
                  Manage and moderate reported user accounts
                </p>
              </div>
            </div>
          </div>

          {/* Search and Sort Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8B7355] group-focus-within:text-[#C2794D] transition-colors" />
              <input
                type="text"
                placeholder="Search by ID or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border-2 border-[#D4A373]/30 bg-white/80 backdrop-blur-sm pl-12 pr-4 py-4 text-[#5D4E37] placeholder-[#8B7355]/60 focus:outline-none focus:border-[#C2794D] focus:shadow-lg transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border-2 border-[#D4A373]/30 rounded-2xl px-6 py-3 shadow-md">
              <span className="text-[#5D4E37] font-semibold text-sm uppercase tracking-wider">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border-none bg-transparent px-3 py-1 text-[#5D4E37] font-medium focus:outline-none cursor-pointer"
              >
                <option value="Most reported">Most reported</option>
                <option value="Recent reports">Recent reports</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-lg border-2 border-[#D4A373]/20">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border-4 border-[#C2794D] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[#5D4E37] font-medium text-lg">
                    Loading user reports...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50/90 backdrop-blur-sm border-2 border-red-200 rounded-2xl px-6 py-4 mb-6 flex items-center gap-3 shadow-lg">
              <AlertTriangle className="text-red-500 w-6 h-6" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-5">
            {sortedAndFilteredUsers.length === 0 && !loading && !error && (
              <div className="text-center py-20">
                <div className="inline-block bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-lg border-2 border-[#D4A373]/20">
                  <User className="w-12 h-12 text-[#8B7355] mx-auto mb-3" />
                  <span className="text-[#5D4E37] font-medium text-lg">
                    No reported users found.
                  </span>
                </div>
              </div>
            )}

            {sortedAndFilteredUsers.map((user, index) => (
              <div
                key={user.id}
                className="group"
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div
                  className={`flex items-center justify-between rounded-3xl bg-white/90 backdrop-blur-sm px-8 py-6 shadow-lg cursor-pointer transition-all duration-300 border-2 ${
                    expandedUserId === user.id
                      ? "border-[#C2794D] shadow-2xl scale-[1.02]"
                      : "border-white/50 hover:border-[#D4A373]/50 hover:shadow-xl hover:scale-[1.01]"
                  }`}
                >
                  <div
                    onClick={() => handleToggleExpand(user.id)}
                    className="flex items-center gap-8 flex-1"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-5">
                      {/* Avatar */}
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-16 h-16 rounded-2xl object-cover shadow-md ring-2 ring-[#D4A373]/30"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4A373] to-[#C2794D] flex items-center justify-center shadow-md">
                          <span className="text-white text-2xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      <div>
                        <h3 className="text-xl font-bold text-[#5D4E37] mb-1">
                          {user.name}
                        </h3>

                        {/* Replace ID with Report Type */}
                        <div className="flex items-center gap-3 mt-1">
                          {/* Most Common Report Type */}
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF2D2D] bg-[#FF2D2D]/10 px-3 py-1 rounded-full border border-[#FF2D2D]/20">
                            <AlertTriangle className="w-3 h-3" />
                            {user.reportCount > 1
                              ? "Multiple Violations"
                              : "Violation"}
                          </span>

                          {/* Latest Report Date */}
                          <span className="text-xs text-[#8B7355] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Latest: {user.latestReportDate.toLocaleDateString()}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              user.status === "Enabled"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Report Count Badge */}
                    <div className="flex items-center gap-3 bg-gradient-to-br from-[#FF2D2D]/10 to-[#FF2D2D]/5 px-5 py-3 rounded-2xl border-2 border-[#FF2D2D]/20">
                      <AlertTriangle className="text-[#FF2D2D] w-5 h-5" />
                      <div>
                        <span className="text-2xl font-black text-[#5D4E37]">
                          {user.reportCount}
                        </span>
                        <span className="text-sm text-[#8B7355] ml-2">
                          {user.reportCount === 1 ? "Report" : "Reports"}
                        </span>
                      </div>
                    </div>

                    {/* Expand Indicator */}
                    <div className="ml-auto">
                      {expandedUserId === user.id ? (
                        <ChevronUp className="w-6 h-6 text-[#C2794D]" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-[#8B7355]" />
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 ml-6">
                    <button
                      className="group/btn rounded-2xl px-7 py-3.5 text-base font-bold transition-all duration-300 bg-gradient-to-r from-[#FF8418] to-[#FF9A3C] text-white hover:from-[#e09115] hover:to-[#FF8418] shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                      onClick={async (e) => {
                        e.stopPropagation();
                        setReportModal(true);
                        setUser(user.id);
                        await handleWarnUser();
                      }}
                    >
                      <AlertTriangle className="w-5 h-5" />
                      Warn User
                    </button>

                    <button
                      className={`group/btn rounded-2xl px-7 py-3.5 text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 ${
                        user.status === "Enabled"
                          ? "bg-gradient-to-r from-[#FF2D2D] to-[#FF5252] text-white hover:from-[#c82323] hover:to-[#FF2D2D]"
                          : "bg-gradient-to-r from-[#7CB154] to-[#8FC768] text-white hover:from-[#5e8c3a] hover:to-[#7CB154]"
                      }`}
                      onClick={(e) => {
                        handleToggleStatus(user.id, user.status, e);
                      }}
                    >
                      {user.status === "Enabled" ? (
                        <>
                          <Ban className="w-5 h-5" />
                          Disable
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Enable
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Reports Section */}
                {expandedUserId === user.id && (
                  <div
                    className="mx-4 mt-3 mb-2 rounded-3xl bg-white/90 backdrop-blur-sm p-8 shadow-xl border-2 border-[#D4A373]/20"
                    style={{ animation: "slideDown 0.3s ease-out" }}
                  >
                    {expandedReports.length > 0 ? (
                      <>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-gradient-to-br from-[#8FAA52] to-[#A8C686] p-2.5 rounded-xl shadow-md">
                            <MessageSquare className="text-white w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-[#5D4E37]">
                              Report Details
                            </h3>
                            <p className="text-sm text-[#8B7355]">
                              {expandedReports.length} total{" "}
                              {expandedReports.length === 1
                                ? "report"
                                : "reports"}{" "}
                              submitted
                            </p>
                          </div>
                        </div>
                        {renderReportsTable(expandedReports)}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-[#8B7355]/50 mx-auto mb-3" />
                        <span className="text-[#8B7355] font-medium">
                          No specific reports available for this user.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Notification Toast */}
          {notif && (
            <div
              className={`fixed top-8 right-8 z-50 px-8 py-4 rounded-2xl shadow-2xl font-bold transition-all duration-300 flex items-center gap-3 backdrop-blur-md border-2 ${
                notif.type === "success"
                  ? "bg-gradient-to-r from-[#7CB154] to-[#8FC768] text-white border-[#7CB154]"
                  : notif.type === "error"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500"
                  : "bg-gradient-to-r from-[#F9A825] to-[#FFC107] text-white border-[#F9A825]"
              }`}
              style={{ animation: "slideInRight 0.3s ease-out" }}
            >
              {notif.type === "success" && <CheckCircle className="w-6 h-6" />}
              {notif.type === "error" && <AlertTriangle className="w-6 h-6" />}
              {notif.message}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
