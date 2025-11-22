import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import PieChart from "../components/ui/PieChart";
import dayjs from "dayjs";
import { ChevronDown, ChevronUp, Leaf, Users } from "lucide-react";
import Loading from "../components/ui/Loading";

const BASE_URL = import.meta.env.VITE_API_URL;
const userId = localStorage.getItem("userId");

const choices = [
  {
    key: 0,
    filter: "day",
    label: "Today",
  },
  {
    key: 1,
    filter: "month",
    label: `${dayjs().subtract(1, "month").format("MMMM")} - ${dayjs().format(
      "MMMM"
    )}, ${dayjs().format("YYYY")}`,
  },
  {
    key: 2,
    filter: "year",
    label: `${dayjs()
      .subtract(1, "year")
      .format("MMMM, YYYY")} - ${dayjs().format("MMMM")}, ${dayjs().format(
      "YYYY"
    )}`,
  },
];

export default function AllAnalytics() {
  const btnRef = useRef(null);
  const [analytics, setAnalytics] = useState([]);
  const [dropdown, setDropdown] = useState(false);
  const [filter, setFilter] = useState(`${choices[1].label}`);
  const [loading, setLoading] = useState(false);
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

  const getDateRange = (filter) => {
    const now = dayjs();
    switch (filter) {
      case "day":
        return {
          start: now.startOf("day"),
          end: now.endOf("day"),
        };

      case "month":
        return {
          start: dayjs().subtract(1, "month").startOf("month"),
          end: now.endOf("month"),
        };

      case "year":
        return {
          start: dayjs().subtract(1, "year").startOf("month"),
          end: now.endOf("month"),
        };

      default:
        return null;
    }
  };

  const filterAnalytics = analytics.filter((data) => {
    const selectedChoice = choices.find((c) => c.label === filter);

    if (!selectedChoice) return true;

    const range = getDateRange(selectedChoice.filter);

    return (
      data.$createdAt.isAfter(range.start) &&
      data.$createdAt.isBefore(range.end)
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
    switch (analytics[i].className) {
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

  const totalLeafPerUser = filterAnalytics.length / totalUser.length;

  return (
    <div className="flex overflow-x-hidden h-screen">
      <Sidebar />
      {loading ? (
        <div className="flex-1 flex flex-col bg-[#F6E6D0] py-6 px-12 ml-0 md:ml-60 pt-32 items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-[#F6E6D0] py-6 px-12 ml-0 md:ml-60 pt-32">
          <div className="flex flex-row items-center justify-around mb-4">
            <h1 className="font-poppins font-bold text-2xl">Data Analytics</h1>
            <h1 className="font-poppins font-semibold text-xl">Data Summary</h1>
          </div>
          <div className="grid grid-cols-2 flex-1 gap-8">
            <div className="bg-white/70 drop-shadow-md p-4 rounded-3xl flex flex-col px-12">
              <h1 className="font-poppins font-medium text-base">
                Distribution of Rubber Tree Leaf Diseases Detected
              </h1>
              <div ref={btnRef} className="relative">
                <button
                  type="button"
                  onClick={() => setDropdown((prev) => !prev)}
                  className="border-[#6C6C6C] border-[1px] px-5 py-1 rounded-full font-medium hover:cursor-pointer active:scale-95 flex flex-row items-center gap-4"
                >
                  {filter}
                  {dropdown ? <ChevronUp /> : <ChevronDown />}
                </button>
                {dropdown && (
                  <div className="w-96 bg-white absolute z-10 top-10 rounded-2xl p-4 flex flex-col ">
                    {choices.map((data, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            setFilter(data.label);
                            setDropdown((prev) => !prev);
                          }}
                          className="hover:bg-slate-400 py-2 rounded-xl px-4 hover:cursor-pointer"
                        >
                          <h1 className="text-slate-600 font-medium ">
                            {data?.label}
                          </h1>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <PieChart
                anthracnose={anthracnose}
                leafSpot={leafSpot}
                oidium={oidium}
              />
            </div>

            <div className="h-full bg-white/70 drop-shadow-md p-4 rounded-3xl grid grid-cols-3 grid-rows-8 gap-2">
              <div className="bg-white/70 drop-shadow-lg rounded-2xl row-span-2 flex items-center justify-evenly flex-col">
                <h1 className="text-2xl font-black">{totalUser.length}</h1>
                <div className="w-full px-4 gap-2 flex flex-col">
                  <Users />
                  <h1 className="font-medium ">Total Users</h1>
                </div>
              </div>
              <div className="bg-white/70 drop-shadow-lg rounded-2xl row-span-2 flex items-center justify-evenly flex-col">
                <h1 className="text-2xl font-black">{totalLeafPerUser}</h1>
                <div className="w-full px-4 gap-2 flex flex-col">
                  <Leaf />
                  <h1 className="font-medium ">Leaf scans per user</h1>
                </div>
              </div>
              <div className="bg-white/70 drop-shadow-lg rounded-2xl row-span-2 flex items-center justify-evenly flex-col">
                <h1 className="text-2xl font-black">
                  {anthracnose + oidium + leafSpot}
                </h1>
                <div className="w-full px-4 gap-2 flex flex-col">
                  <Leaf />
                  <h1 className="font-medium ">Leaf disease cases</h1>
                </div>
              </div>

              <div className="p-3 col-span-3 bg-white/70 drop-shadow-lg rounded-2xl row-span-6 ">
                <h1 className="font-sans text-lg font-medium">
                  Local Occurence of leaf disease
                </h1>
                <div className="flex flex-col">
                  {leafCases.map((data, index) => {
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-12 items-center gap-4"
                      >
                        {data.city.length > 8 ? (
                          <h1 className="text-black col-span-2">
                            {data.city.slice(0, 8)}...
                          </h1>
                        ) : (
                          <h1 className="text-black col-span-2">{data.city}</h1>
                        )}
                        <div
                          className={`col-span-8 bg-slate-400 h-full ${`w-[${
                            (data?.count / leafCases.length) * 100
                          }%]`}`}
                        />
                        <h1 className="col-span-2">{data.count} Cases</h1>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
