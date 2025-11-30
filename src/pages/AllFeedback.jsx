import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  MessageSquare,
  Users,
  Leaf,
} from "lucide-react";
import Loading from "../components/ui/Loading";

const userId = localStorage.getItem("userId");

export default function AllFeedback() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/user/${userId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const userData = await userResponse.json();

        if (userData?.$id) {
          const feedbackResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/admin/allFeedbacks`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userData?.$id,
                API_KEY: userData?.API_KEY,
                email: userData?.email,
              }),
            }
          );

          const allFeedbacksData = await feedbackResponse.json();

          if (Array.isArray(allFeedbacksData)) {
            const extractedFeedbacks = await Promise.all(
              allFeedbacksData.map(async (item, index) => {
                try {
                  const userId = item.userId;
                  const userResponse = await fetch(
                    `${
                      import.meta.env.VITE_API_URL
                    }/api/v1/users/user/${userId}`,
                    {
                      method: "GET",
                      headers: {
                        Accept: "application/json",
                      },
                    }
                  );

                  const userData = await userResponse.json();

                  return {
                    id: index,
                    rating: item.rating || 0,
                    feedback: item.feedback || "",
                    userName:
                      userData.fullName ||
                      `${userData.fName || ""} ${
                        userData.lName || ""
                      }`.trim() ||
                      userData.username ||
                      "Anonymous",
                    userImage: userData.imageURL || null,
                    timestamp:
                      item.timestamp || new Date().toLocaleDateString(),
                    userEmail: userData.email || "N/A",
                    userId: userId,
                    city: userData.city || null,
                    role: userData.role || null,
                    status: userData.status || null,
                    subscription: userData.subscription || false,
                    ...userData,
                  };
                } catch (err) {
                  console.error(
                    `Error fetching user data for ${item.userId}:`,
                    err
                  );
                  return {
                    id: index,
                    rating: item.rating || 0,
                    feedback: item.feedback || "",
                    userName:
                      item.fullName ||
                      `${item.fName || ""} ${item.lName || ""}`.trim() ||
                      item.username ||
                      "Anonymous",
                    userImage: item.imageURL || null,
                    timestamp:
                      item.timestamp || new Date().toLocaleDateString(),
                    userEmail: item.email || "N/A",
                    userId: item.userId,
                    city: item.city || null,
                    role: item.role || null,
                  };
                }
              })
            );
            setFeedbacks(extractedFeedbacks);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load feedbacks");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.userName.toLowerCase().includes(search.toLowerCase()) ||
      f.feedback.toLowerCase().includes(search.toLowerCase()) ||
      f.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = (total) => {
    const pages = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(total - 1, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < total - 2) pages.push("...");
      pages.push(total);
    }
    return pages;
  };

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
        ).toFixed(0)
      : 2;

  return (
    <div className="flex overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 ml-0 md:ml-60">
        <Navbar />
        {loading ? (
          <div className="flex-1 flex flex-col py-6 ml-0  pt-32 items-center justify-center">
            <Loading />
          </div>
        ) : (
          <main className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-12">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-900">
                      Feedback Hub
                    </h1>
                  </div>
                  <p className="text-amber-700/70 text-lg ml-11">
                    Discover what your customers are saying
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 text-sm font-semibold uppercase tracking-wide">
                      Total Feedbacks
                    </p>
                    <p className="text-5xl font-bold text-amber-900 mt-3">
                      {feedbacks.length}
                    </p>
                  </div>
                  <div className="p-4 bg-amber-100 rounded-2xl">
                    <MessageSquare className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide">
                      Average Rating
                    </p>
                    <p className="text-5xl font-bold text-orange-900 mt-3">
                      {avgRating}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-100 rounded-2xl">
                    <Star className="w-8 h-8 text-orange-600 fill-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wide">
                      Users
                    </p>
                    <p className="text-5xl font-bold text-emerald-900 mt-3">
                      {new Set(feedbacks.map((f) => f.userId)).size}
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-100 rounded-2xl">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-10">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
                <input
                  type="text"
                  placeholder="Search feedbacks, names, or emails..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-amber-200 bg-white text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-8 py-6 rounded-2xl">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && currentFeedbacks.length === 0 && (
              <div className="text-center py-24">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6 border-2 border-emerald-200">
                  <Leaf className="w-10 h-10 text-emerald-600" />
                </div>
                <p className="text-amber-900 text-xl font-semibold">
                  No feedbacks found
                </p>
                <p className="text-amber-700/60 mt-2">
                  Try adjusting your search filters
                </p>
              </div>
            )}

            {/* Feedback Cards */}
            {!loading && !error && currentFeedbacks.length > 0 && (
              <div className="space-y-5 mb-12">
                {currentFeedbacks.map((feedback, idx) => {
                  const isExpanded = expandedId === feedback.id;
                  const displayText =
                    feedback.feedback.length > 250 && !isExpanded
                      ? feedback.feedback.slice(0, 250) + "..."
                      : feedback.feedback;

                  return (
                    <div
                      key={feedback.id}
                      onClick={() => toggleExpand(feedback.id)}
                      className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-amber-100 hover:border-amber-300 hover:bg-amber-50/30"
                    >
                      {/* Top Row - User Info and Rating */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                        {/* User Info */}
                        <div className="flex items-center gap-5 min-w-0 flex-1">
                          {feedback.userImage ? (
                            <img
                              src={feedback.userImage}
                              alt={feedback.userName}
                              className="w-16 h-16 rounded-full object-cover shadow-md ring-3 ring-amber-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center flex-shrink-0 shadow-md ring-3 ring-amber-200">
                              <span className="text-white font-bold text-xl">
                                {feedback.userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-amber-900 text-lg truncate">
                              {feedback.userName}
                            </p>
                            <p className="text-sm text-amber-700 truncate">
                              {feedback.userEmail}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {feedback.city && (
                                <span className="text-xs text-amber-600">
                                  📍 {feedback.city}
                                </span>
                              )}
                              <span className="text-xs text-amber-500/70">
                                {feedback.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-3 flex-shrink-0 md:flex-col md:items-end">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-6 h-6 transition-all ${
                                  i < feedback.rating
                                    ? "fill-amber-400 text-amber-400 drop-shadow-md"
                                    : "text-amber-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-lg font-bold text-amber-600">
                            {feedback.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-amber-200/0 via-amber-300/50 to-amber-200/0 mb-6"></div>

                      {/* Feedback Text */}
                      <p className="text-amber-900/80 leading-relaxed text-base font-light">
                        "{displayText}"
                      </p>

                      {/* Expand Indicator */}
                      {feedback.feedback.length > 250 && (
                        <p className="mt-4 text-amber-600 text-sm font-semibold hover:text-amber-700 transition-colors flex items-center gap-2">
                          {isExpanded ? "← Show less" : "Read more →"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12 pb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    currentPage === 1
                      ? "text-amber-300 border-amber-200 cursor-not-allowed bg-amber-50"
                      : "text-amber-600 border-amber-300 hover:bg-amber-100 hover:border-amber-400 bg-white"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {getPageNumbers(totalPages).map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      typeof page === "number" && handlePageChange(page)
                    }
                    disabled={page === "..."}
                    className={`px-4 py-2 rounded-xl border-2 font-semibold transition-all ${
                      page === currentPage
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md"
                        : page === "..."
                        ? "text-amber-400 border-transparent cursor-default bg-transparent"
                        : "text-amber-700 border-amber-300 hover:bg-amber-100 hover:border-amber-400 bg-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    currentPage === totalPages
                      ? "text-amber-300 border-amber-200 cursor-not-allowed bg-amber-50"
                      : "text-amber-600 border-amber-300 hover:bg-amber-100 hover:border-amber-400 bg-white"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
