import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { useState } from "react";

// Dummy feedback data
const feedbacks = [
  {
    id: 1,
    name: "Louie Alberto Canen",
    image: "/louie.png",
    time: "10 hours ago",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  },
  {
    id: 2,
    name: "Jacob Mayor Tapere",
    image: "/jacob.png",
    time: "15 hours ago",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  },
  {
    id: 3,
    name: "Aiken Artigas",
    image: "/aiken.png",
    time: "7 hours ago",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
  },
  {
    id: 4,
    name: "Joy Anne Lutero",
    image: "",
    time: "10 hours ago",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
  },
  // Repeat for demo
  {
    id: 5,
    name: "Louie Alberto Canen",
    image: "/louie.png",
    time: "10 hours ago",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
  },
  {
    id: 6,
    name: "Jacob Mayor Tapere",
    image: "/jacob.png",
    time: "15 hours ago",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
  },
  {
    id: 7,
    name: "Aiken Artigas",
    image: "/aiken.png",
    time: "7 hours ago",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
  },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toString().includes(search)
  );

  return (
    <div className="flex overflow-x-hidden">
      {" "}
      {/* 🔹 Prevent horizontal scroll */}
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#F6E6D0] p-6 ml-0 md:ml-60">
        <Navbar />
        <main className="p-10">
          <h2 className="text-5xl font-bold text-[#4B2E1E] mb-6">Dashboard</h2>

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
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 max-w-full rounded-lg border-none bg-[#C2A78C] px-10 py-3 text-[#4B2E1E] placeholder-[#4B2E1E] focus:outline-none"
              />
            </div>
            <div className="relative">
              <button
                className="bg-transparent border border-gray-400 rounded-xl px-6 py-2 text-[#4B2E1E] font-semibold shadow flex items-center gap-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Feedbacks
                <img
                  src="/down_arrow.png"
                  alt="Arrow Down"
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>

          <div className="text-lg text-[#4B2E1E] mb-4">
            User Feedbacks and Reports
          </div>
          <div className="space-y-4">
            {filteredFeedbacks.map((f) => {
              const isExpanded = expandedId === f.id;
              const isLong = f.feedback.length > 120;

              return (
                <div
                  key={f.id}
                  onClick={() => toggleExpand(f.id)}
                  className="flex flex-wrap items-center justify-between rounded-xl bg-white px-6 py-4 shadow transition-all duration-300 cursor-pointer min-w-0"
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
                        <span className="text-gray-500 text-xl">●</span>
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
        </main>
      </div>
    </div>
  );
}
