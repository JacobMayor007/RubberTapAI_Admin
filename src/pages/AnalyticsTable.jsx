import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Sidebar from "../components/layout/Sidebar";
import {
  ArrowLeft,
  Search,
  Calendar,
  User,
  MapPin,
  Globe,
  BarChart3,
  Loader2,
  Eye,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;
const userId = localStorage.getItem("userId");

export default function AnalyticsTable() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortField, setSortField] = useState("$createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const result = await fetch(`${BASE_URL}/api/v1/users/user/${userId}`);
        const admin = await result.json();

        const body = {
          userId: admin.$id,
          API_KEY: admin.API_KEY,
          email: admin.email,
        };

        const analyticsRes = await fetch(`${BASE_URL}/api/v1/admin/analytics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await analyticsRes.json();

        setAnalytics(
          data.map((item) => ({
            ...item,
            originalDate: item.$createdAt,
            $createdAt: dayjs(item.$createdAt).format("MMM DD, YYYY • hh:mm A"),
            probabilityColor:
              item.probability >= 80
                ? "text-green-600"
                : item.probability >= 60
                ? "text-amber-600"
                : "text-red-600",
            probabilityBg:
              item.probability >= 80
                ? "bg-green-50"
                : item.probability >= 60
                ? "bg-amber-50"
                : "bg-red-50",
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAnalytics = analytics
    .filter((item) => {
      if (!search.trim()) return true;

      return (
        (item.fullName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.userId?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.userID?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.id?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.city?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.region?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.country?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.className?.toLowerCase() || "").includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      let aValue, bValue;

      if (sortField === "originalDate") {
        aValue = new Date(a.originalDate);
        bValue = new Date(b.originalDate);
      } else if (sortField === "probability") {
        aValue = a.probability;
        bValue = b.probability;
      } else {
        aValue = a[sortField]?.toLowerCase() || "";
        bValue = b[sortField]?.toLowerCase() || "";
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="flex bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 ml-0 md:ml-60">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                Scan Records
              </h1>
            </div>
            <p className="text-amber-700/70 text-sm mt-1">
              Complete history of all image analysis scans
            </p>
          </div>

          <a
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 text-amber-700 hover:text-amber-800 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </a>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 px-24">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600/70 text-sm font-medium">
                  Total Scans
                </p>
                <p className="text-2xl font-bold text-amber-800">
                  {analytics.length}
                </p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600/70 text-sm font-medium">
                  Filtered Results
                </p>
                <p className="text-2xl font-bold text-amber-800">
                  {filteredAnalytics.length}
                </p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Search className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="w-full flex justify-center">
            <div className="relative w-2/3">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
              <input
                type="text"
                placeholder="Search by ID, name, email, location, or class..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-300 transition-all duration-300 placeholder-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Analytics Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-4" />
            <p className="text-amber-700/70 font-medium">
              Loading scan records...
            </p>
          </div>
        ) : filteredAnalytics.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-amber-200">
            <BarChart3 className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-amber-800 mb-2">
              {search
                ? "No matching records found"
                : "No analytics data available yet"}
            </h3>
            <p className="text-amber-600/70 max-w-sm mx-auto">
              {search
                ? "Try searching by user ID, name, email, location, or class name"
                : "Scan records will appear here once users start analyzing images"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-amber-200 bg-amber-50/50">
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-amber-700 cursor-pointer hover:bg-amber-100/50 transition-colors"
                      onClick={() => handleSort("fullName")}
                    >
                      <div className="flex items-center gap-2">
                        User
                        <SortIcon field="fullName" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-amber-700 cursor-pointer hover:bg-amber-100/50 transition-colors"
                      onClick={() => handleSort("className")}
                    >
                      <div className="flex items-center gap-2">
                        Classification
                        <SortIcon field="className" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-amber-700 cursor-pointer hover:bg-amber-100/50 transition-colors"
                      onClick={() => handleSort("probability")}
                    >
                      <div className="flex items-center gap-2">
                        Confidence
                        <SortIcon field="probability" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-amber-700 cursor-pointer hover:bg-amber-100/50 transition-colors"
                      onClick={() => handleSort("originalDate")}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        <SortIcon field="originalDate" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-700">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-amber-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200/50">
                  {filteredAnalytics.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-amber-900">
                            {item.fullName || "Anonymous User"}
                          </div>
                          <div className="text-sm text-amber-600/70 font-mono">
                            {item.userId || item.userID || item.id || "No ID"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-amber-800">
                          {item.className}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.probabilityBg} ${item.probabilityColor}`}
                        >
                          {item.probability}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-amber-700">
                        {item.$createdAt}
                      </td>
                      <td className="px-6 py-4 text-sm text-amber-700">
                        {item.city || item.region || item.country ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {[item.city, item.region]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
              className="bg-white rounded-3xl border border-amber-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-amber-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-amber-900">
                    Scan Details
                  </h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-amber-100 rounded-xl transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div>
                  <h4 className="text-sm font-semibold text-amber-600 mb-3">
                    USER INFORMATION
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-amber-500 font-medium">
                        Full Name
                      </label>
                      <p className="text-amber-900 font-medium">
                        {selectedItem.fullName || "Anonymous User"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-amber-500 font-medium">
                        User ID
                      </label>
                      <p className="text-amber-900 font-mono text-sm">
                        {selectedItem.userId ||
                          selectedItem.userID ||
                          selectedItem.id ||
                          "No ID"}
                      </p>
                    </div>
                    {selectedItem.email && (
                      <div className="md:col-span-2">
                        <label className="text-xs text-amber-500 font-medium">
                          Email
                        </label>
                        <p className="text-amber-900">{selectedItem.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Info */}
                <div>
                  <h4 className="text-sm font-semibold text-amber-600 mb-3">
                    LOCATION
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem.city && (
                      <div>
                        <label className="text-xs text-amber-500 font-medium">
                          City
                        </label>
                        <p className="text-amber-900">{selectedItem.city}</p>
                      </div>
                    )}
                    {selectedItem.region && (
                      <div>
                        <label className="text-xs text-amber-500 font-medium">
                          Region
                        </label>
                        <p className="text-amber-900">{selectedItem.region}</p>
                      </div>
                    )}
                    {selectedItem.subregion && (
                      <div>
                        <label className="text-xs text-amber-500 font-medium">
                          Subregion
                        </label>
                        <p className="text-amber-900">
                          {selectedItem.subregion}
                        </p>
                      </div>
                    )}
                    {selectedItem.country && (
                      <div>
                        <label className="text-xs text-amber-500 font-medium">
                          Country
                        </label>
                        <p className="text-amber-900">{selectedItem.country}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analysis Results */}
                <div>
                  <h4 className="text-sm font-semibold text-amber-600 mb-3">
                    ANALYSIS RESULTS
                  </h4>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-xs text-amber-500 font-medium">
                          Classification
                        </label>
                        <p className="text-lg font-bold text-amber-900">
                          {selectedItem.className}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-bold px-3 py-1 rounded-full ${selectedItem.probabilityBg} ${selectedItem.probabilityColor}`}
                      >
                        {selectedItem.probability}% confidence
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <h4 className="text-sm font-semibold text-amber-600 mb-3">
                    DATE
                  </h4>
                  <p className="text-amber-700">{selectedItem.$createdAt}</p>
                </div>
              </div>

              <div className="p-6 border-t border-amber-200">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
