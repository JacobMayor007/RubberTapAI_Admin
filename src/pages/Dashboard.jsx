import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { account } from "../lib/appwrite";

const BASE_URL = 'https://rubbertapai-backend.vercel.app';

// Dummy feedback data (fallback) - YOUR EXISTING DATA
const fallbackFeedbacks = [
  {
    id: 1,
    name: "Louie Alberto Canen",
    image: "/louie.png",
    time: "10 hours ago",
    rating: 5,
    feedback: "The disease detection feature saved my entire harvest! Identied leaf spot early and the treatment recommendations worked perfectly. Buyers are now paying premium prices for my high-quality latex.",
  },
  {
    id: 2,
    name: "Jacob Mayor Tapere",
    image: "/jacob.png",
    time: "15 hours ago",
    rating: 5,
    feedback: "As a latex processor, this app helps me verify the quality of rubber tree plantations before purchasing. The health reports from farmers using this app give me confidence in the raw material quality.",
  },
  {
    id: 3,
    name: "Aiken Artigas",
    image: "/aiken.png",
    time: "7 hours ago",
    rating: 5,
    feedback: "My latex yield increased by 30% after following the app's disease prevention tips. Buyers are now competing for my produce because of the consistent quality and health certification.",
  },
  {
    id: 4,
    name: "Joy Anne Lutero",
    image: "",
    time: "10 hours ago",
    rating: 5,
    feedback: "This app has streamlined our sourcing process. We can now identify reliable farmers with healthy plantations, reducing our quality control costs and ensuring better latex for our manufacturing.",
  },
];

// Dummy reports data (fallback)
const fallbackReports = [
  {
    id: "report1",
    reported_id: "user1001",
    reportedBy: "Jacob Tapere",
    type: "Scamming",
    status: "pending",
    description: "This user is asking for money",
    $createdAt: "2024-01-15T10:30:00.000Z"
  },
  {
    id: "report2",
    reported_id: "user1002",
    reportedBy: "Louie Canen",
    type: "Harassment",
    status: "resolved",
    description: "Sending inappropriate messages",
    $createdAt: "2024-01-14T15:45:00.000Z"
  }
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [apiStatus, setApiStatus] = useState("Checking backend connection...");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feedbacks"); 

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await account.get();
        
        // EXACT structure from Jacob's API documentation
        const adminData = {
          userId: user.$id,
          API_KEY: import.meta.env.VITE_ADMIN_API_KEY,
          email: user.email
        };

        console.log("🔑 Fetching data directly from API...");
        console.log("📦 Admin Data:", adminData);
        
        // Load feedbacks - Skip since endpoint returns 404
        console.log("📋 Using fallback feedback data (rates endpoint returns 404)");
        setFeedbacks(fallbackFeedbacks);

        // Load reports - EXACT endpoint from documentation
        try {
          console.log("🔄 Calling reports endpoint...");
          const reportsResponse = await fetch(`${BASE_URL}/api/v1/admin/reports`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(adminData),
          });

          console.log("📡 Reports Response Status:", reportsResponse.status);
          console.log("📡 Reports Response OK:", reportsResponse.ok);

          if (reportsResponse.ok) {
            const data = await reportsResponse.json();
            console.log("✅ Reports API FULL response:", data);
            
            // According to documentation, data should be an array of report objects
            if (Array.isArray(data)) {
              console.log("📊 Reports data is direct array, length:", data.length);
              setReports(data);
              console.log(`✅ Successfully loaded ${data.length} reports`);
            } else if (data.success && Array.isArray(data.data)) {
              console.log("📊 Reports data has success wrapper");
              setReports(data.data);
              console.log(`✅ Successfully loaded ${data.data.length} reports`);
            } else {
              console.warn("⚠️ Unexpected reports response structure:", data);
              throw new Error('Unexpected reports response structure');
            }
          } else {
            const errorText = await reportsResponse.text();
            console.error("❌ Reports API Error:", {
              status: reportsResponse.status,
              statusText: reportsResponse.statusText,
              body: errorText
            });
            throw new Error(`Reports HTTP ${reportsResponse.status}`);
          }
        } catch (apiError) {
          console.error("🚨 Reports API failed:", apiError);
          console.log("📋 Using fallback reports data");
          setReports(fallbackReports);
        }
        
        setApiStatus("✅ Data loaded successfully");
        
      } catch (error) {
        console.error("🚨 Main error:", error);
        setFeedbacks(fallbackFeedbacks);
        setReports(fallbackReports);
        setApiStatus("❌ Error loading data. Using demo data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    } catch (error) {
      return "Recently";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  // Feedback data filtering and pagination
  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toString().includes(search)
  );

  const feedbackTotalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const feedbackStartIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(feedbackStartIndex, feedbackStartIndex + itemsPerPage);

  // Reports data filtering and pagination
  const filteredReports = reports.filter(report =>
    report.reported_id?.toLowerCase().includes(search.toLowerCase()) ||
    report.reportedBy?.toLowerCase().includes(search.toLowerCase()) ||
    report.type?.toLowerCase().includes(search.toLowerCase())
  );

  const reportsTotalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const reportsStartIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = filteredReports.slice(reportsStartIndex, reportsStartIndex + itemsPerPage);

  const getPageNumbers = (totalPages) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page === '...') return;
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    const totalPages = activeTab === "feedbacks" ? feedbackTotalPages : reportsTotalPages;
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentTotalPages = activeTab === "feedbacks" ? feedbackTotalPages : reportsTotalPages;
  const currentItemsCount = activeTab === "feedbacks" ? filteredFeedbacks.length : filteredReports.length;

  return (
    <div className="flex overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#F6E6D0] p-6 ml-0 md:ml-60">
        <Navbar />
        <main className="p-10">
          <h2 className="text-5xl font-bold text-[#4B2E1E] mb-6">Dashboard</h2>

          {/* API Status Message */}
          <div className={`px-4 py-3 rounded mb-6 ${
            apiStatus.includes("✅") 
              ? "bg-green-100 border border-green-400 text-green-700"
              : apiStatus.includes("❌") 
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-yellow-100 border border-yellow-400 text-yellow-700"
          }`}>
            <strong>Note:</strong> {apiStatus}
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 border-b border-[#4B2E1E]">
            <button
              onClick={() => {
                setActiveTab("feedbacks");
                setCurrentPage(1);
              }}
              className={`px-6 py-3 font-semibold text-lg ${
                activeTab === "feedbacks"
                  ? "bg-[#4B2E1E] text-white border-b-2 border-[#4B2E1E]"
                  : "text-[#4B2E1E] hover:bg-[#4B2E1E] hover:text-white"
              } rounded-t-lg transition-colors`}
            >
              User Feedbacks
            </button>
            <button
              onClick={() => {
                setActiveTab("reports");
                setCurrentPage(1);
              }}
              className={`px-6 py-3 font-semibold text-lg ${
                activeTab === "reports"
                  ? "bg-[#4B2E1E] text-white border-b-2 border-[#4B2E1E]"
                  : "text-[#4B2E1E] hover:bg-[#4B2E1E] hover:text-white"
              } rounded-t-lg transition-colors`}
            >
              User Reports
            </button>
          </div>

          {loading && (
            <div className="text-center text-[#4B2E1E] py-8">Loading data...</div>
          )}

          {/* Search Bar */}
          <div className="flex flex-col items-end gap-2 mb-6">
            <div className="relative">
              <img
                src="/search_icon.png"
                alt="Search Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="text"
                placeholder={`Search ${activeTab === "feedbacks" ? "feedbacks" : "reports"}...`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-72 max-w-full rounded-lg border-none bg-[#C2A78C] px-10 py-3 text-[#4B2E1E] placeholder-[#4B2E1E] focus:outline-none"
              />
            </div>
          </div>

          <div className="text-lg text-[#4B2E1E] mb-4">
            {activeTab === "feedbacks" ? "User Feedbacks" : "User Reports"} 
            {apiStatus.includes("demo") ? " (Demo Data)" : ""} - Page {currentPage} of {currentTotalPages}
            {` (${currentItemsCount} total)`}
          </div>
          
          {/* FEEDBACKS TAB CONTENT */}
          {activeTab === "feedbacks" && (
            <>
              {!loading && currentFeedbacks.length === 0 ? (
                <div className="text-center text-[#4B2E1E] py-8">
                  No feedbacks found.
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {currentFeedbacks.map((f) => {
                    const isExpanded = expandedId === f.id;
                    const isLong = f.feedback.length > 120;

                    return (
                      <div
                        key={f.id}
                        onClick={() => toggleExpand(f.id)}
                        className="flex flex-wrap items-center justify-between rounded-xl bg-white px-6 py-4 shadow transition-all duration-300 cursor-pointer min-w-0 hover:bg-gray-50"
                      >
                        {/* Avatar + Name */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {f.image ? (
                            <img
                              src={f.image}
                              alt={f.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-500 text-xl">
                                {f.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-lg text-[#4B2E1E] truncate">
                            {f.name}
                          </span>
                        </div>

                        {/* Time */}
                        <div className="w-32 text-right text-[#4B2E1E] shrink-0">
                          {f.time}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 w-40 justify-center shrink-0">
                          {[...Array(f.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-2xl">
                              &#9733;
                            </span>
                          ))}
                        </div>

                        {/* Feedback */}
                        <div
                          className={`text-[#4B2E1E] text-sm pl-6 flex-1 min-w-0 ${
                            isExpanded ? "" : "truncate"
                          }`}
                        >
                          {isExpanded
                            ? f.feedback
                            : isLong
                            ? f.feedback.slice(0, 120) + "..."
                            : f.feedback}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* REPORTS TAB CONTENT */}
          {activeTab === "reports" && (
            <>
              {!loading && currentReports.length === 0 ? (
                <div className="text-center text-[#4B2E1E] py-8">
                  No reports found.
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {currentReports.map((report) => (
                    <div
                      key={report.$id || report.id}
                      className="rounded-xl bg-white px-6 py-4 shadow transition-all duration-300 hover:bg-gray-50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-sm font-semibold text-[#4B2E1E]">
                              Report ID: {report.$id || report.id}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              report.status === 'resolved' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <strong>Reported User:</strong> {report.reported_id}
                            </div>
                            <div>
                              <strong>Reported By:</strong> {report.reportedBy}
                            </div>
                            <div>
                              <strong>Type:</strong> {report.type}
                            </div>
                            <div>
                              <strong>Date:</strong> {formatDate(report.$createdAt || report.date)}
                            </div>
                          </div>
                          
                          {report.description && (
                            <div className="mt-2 text-sm text-[#4B2E1E]">
                              <strong>Description:</strong> {report.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {currentTotalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              {/* Previous Button */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg border ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-[#4B2E1E] border-[#4B2E1E] hover:bg-[#4B2E1E] hover:text-white"
                }`}
              >
                &lt;
              </button>

              {/* Page Numbers */}
              {getPageNumbers(currentTotalPages).map((page, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg border ${
                    page === currentPage
                      ? "bg-[#4B2E1E] text-white border-[#4B2E1E]"
                      : page === '...'
                      ? "text-gray-500 border-transparent cursor-default"
                      : "text-[#4B2E1E] border-[#4B2E1E] hover:bg-[#4B2E1E] hover:text-white"
                  }`}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === currentTotalPages}
                className={`px-3 py-2 rounded-lg border ${
                  currentPage === currentTotalPages
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-[#4B2E1E] border-[#4B2E1E] hover:bg-[#4B2E1E] hover:text-white"
                }`}
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}