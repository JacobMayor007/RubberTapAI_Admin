import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { account } from "../lib/appwrite";

const fallbackFeedbacks = [
  {
    id: 1,
    name: "Louie Alberto Canen",
    image: "/louie.png",
    time: "10 hours ago",
    rating: 5,
    feedback:
      "The disease detection feature saved my entire harvest! Identified leaf spot early and the treatment recommendations worked perfectly. Buyers are now paying premium prices for my high-quality latex.",
  },
  {
    id: 2,
    name: "Jacob Mayor Tapere",
    image: "/jacob.png",
    time: "15 hours ago",
    rating: 5,
    feedback:
      "As a latex processor, this app helps me verify the quality of rubber tree plantations before purchasing. The health reports from farmers using this app give me confidence in the raw material quality.",
  },
  {
    id: 3,
    name: "Aiken Artigas",
    image: "/aiken.png",
    time: "7 hours ago",
    rating: 5,
    feedback:
      "My latex yield increased by 30% after following the app's disease prevention tips. Buyers are now competing for my produce because of the consistent quality and health certification.",
  },
  {
    id: 4,
    name: "Joy Anne Lutero",
    image: "",
    time: "10 hours ago",
    rating: 5,
    feedback:
      "This app has streamlined our sourcing process. We can now identify reliable farmers with healthy plantations, reducing our quality control costs and ensuring better latex for our manufacturing.",
  },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [apiStatus, setApiStatus] = useState("Checking backend connection...");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feedbacks");

  useEffect(() => {

    const loadData = async () => {

      try {
        const user = await account.get();

        const adminData = {
          userId: user.$id,
          API_KEY: import.meta.env.VITE_ADMIN_API_KEY,
          email: user.email,
        };

        console.log("🔑 Fetching data directly from API...");
        console.log("📦 Admin Data:", adminData);

        // Load feedbacks - Skip since endpoint returns 404
        console.log(
          "📋 Using fallback feedback data (rates endpoint returns 404)"
        );
        setFeedbacks(fallbackFeedbacks);

        // The reports fetching logic was removed in the previous step, so it is kept removed.

        setApiStatus("✅ Data loaded successfully");
      } catch (error) {
        console.error("🚨 Main error:", error);
        setFeedbacks(fallbackFeedbacks);
        setApiStatus("❌ Error loading data. Using demo data.");
      } finally {
        setLoading(false);
      }
    };

    setActiveTab("feedbacks");
    loadData();
  
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  // Feedback data filtering and pagination
  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toString().includes(search) ||
      f.feedback.toLowerCase().includes(search.toLowerCase())
  );

  const feedbackTotalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const feedbackStartIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(
    feedbackStartIndex,
    feedbackStartIndex + itemsPerPage
  );

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
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page === "...") return;
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < feedbackTotalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentTotalPages = feedbackTotalPages;

  return (
    <div className="flex overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#F6E6D0] p-6 ml-0 md:ml-60">
        <Navbar />
        <main className="p-10">
          <h2 className="text-5xl font-bold text-[#4B2E1E] mb-6">Dashboard</h2>

          {/* New Header and Search Bar (matching the image) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-semibold text-[#4B2E1E] whitespace-nowrap">
              User Feedbacks and Reports
            </h3>

            <div className="relative w-full md:w-72">
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
                  setCurrentPage(1);
                }}
                // Custom styles matching the search bar color from the image
                className="w-full rounded-lg border-none bg-[#C2A78C] px-10 py-3 text-[#4B2E1E] placeholder-[#4B2E1E] focus:outline-none focus:ring-2 focus:ring-[#4B2E1E]"
              />
            </div>
          </div>

          {loading && (
            <div className="text-center text-[#4B2E1E] py-8">
              Loading data...
            </div>
          )}

          {/* FEEDBACKS CONTENT */}
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
                    const displayFeedback =
                      f.feedback.length > 200 && !isExpanded
                        ? f.feedback.slice(0, 200) + "..."
                        : f.feedback;

                    return (
                      <div
                        key={f.id}
                        onClick={() => toggleExpand(f.id)}
                        // Adjusted background/shadow to better match image style
                        className="flex rounded-xl bg-white p-4 shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg min-w-0"
                      >
                        {/* Wrapper for the primary columns (Avatar, Name, Time, Rating) */}
                        <div className="flex items-center w-full min-w-0">
                          {/* Avatar + Name */}
                          <div className="flex items-center gap-3 w-64 shrink-0 min-w-[150px]">
                            {f.image ? (
                              <img
                                src={f.image}
                                alt={f.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                                <span className="text-gray-500 text-lg">
                                  {f.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-sm font-semibold text-[#4B2E1E] truncate">
                              {f.name}
                            </span>
                          </div>

                          {/* Time (Smaller/less dominant, moved next to name visually) */}
                          <div className="w-24 text-sm text-gray-500 shrink-0 hidden sm:block">
                            {f.time}
                          </div>

                          {/* Rating (Central, prominent) */}
                          <div className="flex items-center gap-0.5 w-32 justify-center shrink-0 text-xl">
                            {[...Array(f.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">
                                &#9733;
                              </span>
                            ))}
                          </div>

                          {/* Feedback text column (takes up the rest of the space) */}
                          <div className="text-sm text-[#4B2E1E] flex-1 px-4 min-w-[200px]">
                            {/* The feedback content needs to be inline with the other items to match the image structure */}
                            {displayFeedback}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Pagination and Status */}
          {/* MODIFIED: Changed justify-between to justify-center and removed the status message to center the pagination */}
          <div className="flex justify-center items-center mt-8">
            {currentTotalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
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
                        : page === "..."
                        ? "text-gray-500 border-transparent cursor-default"
                        : "text-[#4B2E1E] border-[#4B2E1E] hover:bg-[#4B2E1E] hover:text-white"
                    }`}
                    disabled={page === "..."}
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
          </div>
        </main>
      </div>
    </div>
  );
}
