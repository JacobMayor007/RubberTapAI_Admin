import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import PieChart from "../components/ui/PieChart";
import dayjs from "dayjs";
import { Leaf, Users, TrendingUp, Calendar } from "lucide-react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

import Loading from "../components/ui/Loading";
import DiseaseInfoModal from "../components/ui/DiseaseInfo";

const BASE_URL = import.meta.env.VITE_API_URL;
const userId = localStorage.getItem("userId");

export default function Dashboard() {
  const btnRef = useRef(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, "month"),
    dayjs(),
  ]);
  const totalUser = [];
  let leafCases = [];

  var anthracnose = 0,
    leafSpot = 0,
    oidium = 0;

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const result = await fetch(`${BASE_URL}/api/v1/users/user/${userId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const dataAdmin = await result.json();

        if (dataAdmin) {
          fetchAnalytics(dataAdmin);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdminData();
  }, [userId]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!btnRef.current?.contains(e.target)) {
        setDropdown(false);
      }
    };

    document.body.addEventListener("mousedown", closeDropdown);

    return () => {
      document.body.removeEventListener("mouseover", closeDropdown);
    };
  }, [dropdown]);

  const fetchAnalytics = async (admin) => {
    try {
      const requestBody = {
        userId: admin?.$id,
        API_KEY: admin?.API_KEY,
        email: admin?.email,
      };

      const result = await fetch(`${BASE_URL}/api/v1/admin/analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await result.json();
      const filtered = data.map((data) => ({
        ...data,
        $createdAt: dayjs(data?.$createdAt),
      }));
      setAnalytics(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterAnalytics = analytics.filter((data) => {
    if (!dateRange || dateRange.length !== 2) return true;

    const [start, end] = dateRange;
    return (
      data.$createdAt.isAfter(start.startOf("day")) &&
      data.$createdAt.isBefore(end.endOf("day"))
    );
  });

  for (let i = 0; i < filterAnalytics.length; i++) {
    for (let j = i; j < filterAnalytics.length; j++) {
      if (filterAnalytics[i]?.userId !== filterAnalytics[j + 1]?.userId) {
        totalUser.push(filterAnalytics[i]);
      }
      break;
    }
  }

  for (let i = 0; i < filterAnalytics.length; i++) {
    switch (filterAnalytics[i].className) {
      case "Anthracnose":
        anthracnose++;
        break;
      case "Oidium Heveae":
        oidium++;
        break;
      case "Leaf Spot":
        leafSpot++;
        break;
    }
  }

  const cityCases = {};

  for (let i = 0; i < filterAnalytics.length; i++) {
    const city = filterAnalytics[i].city;
    if (filterAnalytics[i].className !== "Healthy") {
      if (!city) continue;

      if (cityCases[city] === undefined) {
        cityCases[city] = 1;
      } else {
        cityCases[city]++;
      }
    }
  }

  for (const city in cityCases) {
    leafCases.push({
      city: city,
      count: cityCases[city],
    });
  }

  leafCases.sort((a, b) => b.count - a.count);

  const totalLeafPerUser =
    totalUser.length > 0
      ? (filterAnalytics.length / totalUser.length).toFixed(2)
      : 0;

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  console.log(totalUser);

  const maxCases =
    leafCases.length > 0 ? Math.max(...leafCases.map((c) => c.count)) : 1;

  return (
    <div className="flex overflow-x-hidden h-screen bg-gradient-to-br from-[#F6E6D0] via-[#F5E5CC] to-[#F0DFC8]">
      <Sidebar />
      {loading ? (
        <div className="flex-1 flex flex-col py-6 px-12 ml-0 md:ml-60 pt-32 items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex-1 flex flex-col py-8 px-6 md:px-12 ml-0 md:ml-60 pt-24 md:pt-10 animate-fadeIn">
          <div className="fixed top-0 right-0 w-96 h-96 bg-[#D4A373]/10 rounded-full blur-3xl -z-10" />
          <div className="fixed bottom-0 left-0 w-96 h-96 bg-[#8FAA52]/10 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="space-y-2">
              <h1 className="font-poppins font-bold text-4xl text-[#5D4E37] tracking-tight">
                Data Analytics
              </h1>
              <p className="text-[#8B7355] text-base flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Monitor rubber tree disease trends and insights
              </p>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <div className="bg-white/60 backdrop-blur-md border border-[#D4A373]/30 rounded-2xl px-6 py-4 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-[#8B7355]" />
                  <h2 className="font-poppins font-semibold text-sm text-[#8B7355] uppercase tracking-wide">
                    Period
                  </h2>
                </div>
                <p className="text-[#5D4E37] font-bold text-lg">
                  {dateRange[0]?.format("MMM DD")} -{" "}
                  {dateRange[1]?.format("MMM DD, YYYY")}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => (window.location.href = "/analytics-table")}
                  className="px-4 py-2 italic bg-[#C2794D] hover:bg-[#D4A373] cursor-pointer text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                >
                  View Full Analytics
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 gap-8">
            <div className="bg-white/90 backdrop-blur-md drop-shadow-2xl p-8 rounded-[2rem] flex flex-col border-2 border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-[#C2794D] to-[#D4A373] p-2.5 rounded-xl shadow-lg">
                    <TrendingUp className="text-white w-5 h-5" />
                  </div>
                  <h2 className="font-poppins font-bold text-xl text-[#5D4E37]">
                    Disease Distribution
                  </h2>
                </div>
                <p className="text-[#8B7355] text-sm mb-6 ml-14">
                  Visual breakdown of detected leaf diseases
                </p>

                <div className="relative">
                  <label className="text-xs text-[#8B7355] font-semibold mb-3 block uppercase tracking-wider md:flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Date Range Filter
                  </label>
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    format="MMM DD, YYYY"
                    className="w-full shadow-md hover:shadow-lg transition-shadow duration-200"
                    size="large"
                    placeholder={["Start Date", "End Date"]}
                    allowClear={false}
                    style={{
                      borderRadius: "16px",
                      border: "2px solid rgba(212, 163, 115, 0.2)",
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center py-4">
                <PieChart
                  anthracnose={anthracnose}
                  leafSpot={leafSpot}
                  oidium={oidium}
                  onLegendClick={(diseaseName) => {
                    setSelectedDisease(diseaseName);
                    setModalOpen(true);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-5">
                <div className="group bg-gradient-to-br from-white via-white to-[#C2794D]/5 backdrop-blur-md drop-shadow-xl rounded-[1.5rem] p-5 flex flex-col items-center justify-center border-2 border-white/60 hover:border-[#C2794D]/40 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className="bg-gradient-to-br from-[#C2794D] to-[#D4A373] p-4 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-white" size={28} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl font-black text-[#5D4E37] mb-2">
                    {totalUser.length}
                  </h1>
                  <p className="text-xs font-semibold text-[#8B7355] text-center uppercase tracking-wide">
                    Total Users
                  </p>
                </div>

                {/* Scans per User Card */}
                <div className="group bg-gradient-to-br from-white via-white to-[#8FAA52]/5 backdrop-blur-md drop-shadow-xl rounded-[1.5rem] p-5 flex flex-col items-center justify-center border-2 border-white/60 hover:border-[#8FAA52]/40 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className="bg-gradient-to-br from-[#8FAA52] to-[#A8C686] p-4 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="text-white" size={28} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl font-black text-[#5D4E37] mb-2">
                    {totalLeafPerUser}
                  </h1>
                  <p className="text-xs font-semibold text-[#8B7355] text-center uppercase tracking-wide">
                    Scans/User
                  </p>
                </div>

                {/* Disease Cases Card */}
                <div className="group bg-gradient-to-br from-white via-white to-[#DEB887]/5 backdrop-blur-md drop-shadow-xl rounded-[1.5rem] p-5 flex flex-col items-center justify-center border-2 border-white/60 hover:border-[#DEB887]/40 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className="bg-gradient-to-br from-[#CD853F] to-[#DEB887] p-4 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp
                      className="text-white"
                      size={28}
                      strokeWidth={2.5}
                    />
                  </div>
                  <h1 className="text-4xl font-black text-[#5D4E37] mb-2">
                    {anthracnose + oidium + leafSpot}
                  </h1>
                  <p className="text-xs font-semibold text-[#8B7355] text-center uppercase tracking-wide">
                    Disease Cases
                  </p>
                </div>
              </div>

              {/* Local Occurrence Bar Chart */}
              <div className="flex-1 bg-white/90 backdrop-blur-md drop-shadow-2xl rounded-[2rem] p-8 border-2 border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] transition-all duration-300 overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#8FAA52] to-[#A8C686] p-2.5 rounded-xl shadow-lg">
                    <Leaf className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-poppins font-bold text-xl text-[#5D4E37]">
                      Geographic Distribution
                    </h2>
                    <p className="text-[#8B7355] text-xs">
                      Disease cases by location
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto max-h-[420px] pr-3 custom-scrollbar">
                  {leafCases.length > 0 ? (
                    leafCases.map((data, index) => {
                      const widthPercent = (data.count / maxCases) * 100;
                      const barColors = [
                        "from-[#C2794D] via-[#D4A373] to-[#E6B894]",
                        "from-[#8FAA52] via-[#A8C686] to-[#C5E1A5]",
                        "from-[#CD853F] via-[#DEB887] to-[#F5DEB3]",
                      ];
                      const bgColor = barColors[index % barColors.length];

                      return (
                        <div
                          key={index}
                          className="group hover:bg-gradient-to-r hover:from-[#F5DEB3]/20 hover:to-transparent p-4 rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-[#D4A373]/20"
                          style={{
                            animation: `slideIn 0.5s ease-out ${
                              index * 0.1
                            }s both`,
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-[#5D4E37] truncate max-w-[140px] group-hover:text-[#C2794D] transition-colors">
                              {data.city}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-[#5D4E37]">
                                {data.count}
                              </span>
                              <span className="text-[10px] font-semibold text-white bg-gradient-to-r from-[#C2794D] to-[#D4A373] px-3 py-1.5 rounded-full shadow-md">
                                {data.count === 1 ? "CASE" : "CASES"}
                              </span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-[#E6D5C3]/60 to-[#F5DEB3]/40 h-4 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`bg-gradient-to-r ${bgColor} h-full rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden`}
                              style={{ width: `${widthPercent}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 gap-4">
                      <div className="bg-[#F5DEB3]/20 p-4 rounded-2xl">
                        <Leaf className="text-[#8B7355] w-8 h-8" />
                      </div>
                      <p className="text-[#8B7355] text-sm font-medium">
                        No disease cases found in selected period
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {modalOpen && (
            <DiseaseInfoModal
              open={modalOpen}
              disease={selectedDisease}
              onClose={() => setModalOpen(false)}
            />
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
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

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(212, 163, 115, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #c2794d, #d4a373);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #b36d42, #c2794d);
        }
      `}</style>
    </div>
  );
}
