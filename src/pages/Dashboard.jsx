import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { account } from "../lib/appwrite";
import { adminApi } from "../lib/adminApi";

// Dummy feedback data (fallback)
const fallbackFeedbacks = [
  {
    id: 1,
    name: "Louie Alberto Canen",
    image: "/louie.png",
    time: "10 hours ago",
    rating: 5,
    feedback: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  },
  {
    id: 2,
    name: "Jacob Mayor Tapere",
    image: "/jacob.png",
    time: "15 hours ago",
    rating: 5,
    feedback: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  },
  {
    id: 3,
    name: "Aiken Artigas",
    image: "/aiken.png",
    time: "7 hours ago",
    rating: 5,
    feedback: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
  },
  {
    id: 4,
    name: "Joy Anne Lutero",
    image: "",
    time: "10 hours ago",
    rating: 5,
    feedback: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
  },
  // Repeat for demo
  {
    id: 5,
    name: "Louie Alberto Canen",
    image: "/louie.png",
    time: "10 hours ago",
    rating: 5,
    feedback: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
  },
  {
    id: 6,
    name: "Jacob Mayor Tapere",
    image: "/jacob.png",
    time: "15 hours ago",
    rating: 5,
    feedback: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
  },
  {
    id: 7,
    name: "Aiken Artigas",
    image: "/aiken.png",
    time: "7 hours ago",
    rating: 5,
    feedback: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
  },
  {
    id: 8,
    name: "User 8",
    image: "",
    time: "1 day ago",
    rating: 4,
    feedback: "Additional feedback for pagination demo.",
  },
  {
    id: 9,
    name: "User 9",
    image: "",
    time: "2 days ago",
    rating: 3,
    feedback: "Another feedback entry for testing pagination.",
  },
  {
    id: 10,
    name: "User 10",
    image: "",
    time: "3 days ago",
    rating: 5,
    feedback: "Final feedback entry to demonstrate pagination functionality.",
  },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [apiStatus, setApiStatus] = useState("Checking backend connection...");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Show 3 items per page
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const user = await account.get();
        const adminData = {
          userId: user.$id,
          email: user.email,
          API_KEY: import.meta.env.VITE_ADMIN_API_KEY
        };
        
        console.log("👤 Admin data loaded:", {
          userId: user.$id,
          email: user.email,
          apiKeyLength: adminData.API_KEY?.length
        });
        
        setAdminData(adminData);
        
        // Test API connection first
        const testResult = await adminApi.testAdminAPI(adminData);
        console.log("🧪 API Test Result:", testResult);
        
        if (testResult.success) {
          setApiStatus("✅ Connected to backend API successfully! Loading feedbacks...");
          // If test passes, fetch feedbacks
          fetchFeedbacks(adminData);
        } else {
          setApiStatus(`❌ API Test Failed: ${testResult.error}. Showing demo data.`);
          setFeedbacks(fallbackFeedbacks);
          setLoading(false);
        }
        
      } catch (error) {
        console.error("Error getting admin data:", error);
        setApiStatus("❌ Failed to get admin data. Showing demo data.");
        setFeedbacks(fallbackFeedbacks);
        setLoading(false);
      }
    };
    getAdminData();
  }, []);

  const fetchFeedbacks = async (adminData) => {
    try {
      setLoading(true);
      console.log("📥 Fetching feedbacks from API...");
      
      const response = await adminApi.getRatesAndFeedbacks(adminData);
      console.log("📊 Feedbacks API Response:", response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const transformedFeedbacks = response.data.map(feedback => ({
          id: feedback.$id || Math.random().toString(36).substr(2, 9),
          name: feedback.ratedBy || 'Anonymous User',
          image: feedback.imageURL || '',
          time: formatTimeAgo(feedback.$createdAt),
          rating: feedback.rate || 5,
          feedback: feedback.feedback || 'No feedback provided.'
        }));
        setFeedbacks(transformedFeedbacks);
        setApiStatus(`✅ Loaded ${transformedFeedbacks.length} feedbacks from backend.`);
      } else {
        setApiStatus(`⚠️ API returned: ${response.message || 'No feedback data available'}. Showing demo data.`);
        setFeedbacks(fallbackFeedbacks);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setApiStatus(`❌ Error: ${error.message}. Showing demo data.`);
      setFeedbacks(fallbackFeedbacks);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time ago
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

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  // Filter feedbacks based on search
  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toString().includes(search)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(startIndex, startIndex + itemsPerPage);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
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
    if (page === '...') return; // Don't do anything for ellipsis
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

          {loading && (
            <div className="text-center text-[#4B2E1E] py-8">Loading feedbacks...</div>
          )}

          {/* Search and Feedback Button */}
          <div className="flex flex-col items-end gap-2 mb-6">
            <div className="relative">
              <img
                src="/search_icon.png"
                alt="Search Icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="w-72 max-w-full rounded-lg border-none bg-[#C2A78C] px-10 py-3 text-[#4B2E1E] placeholder-[#4B2E1E] focus:outline-none"
              />
            </div>
          </div>

          <div className="text-lg text-[#4B2E1E] mb-4">
            User Feedbacks and Reports {apiStatus.includes("demo") ? "(Demo Data)" : ""} - Page {currentPage} of {totalPages}
          </div>
          
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

          {/* Pagination */}
          {totalPages > 1 && (
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
              {getPageNumbers().map((page, index) => (
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
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg border ${
                  currentPage === totalPages
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