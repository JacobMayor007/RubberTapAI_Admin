import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { Leaf } from "lucide-react";

const DATA_CARD_BG = 'rgba(255, 255, 255, 0.7)';
const CARD_SHADOW = '0px 0px 25px 2px rgba(63,31,17,0.15)';
const SIDEBAR_WIDTH = '324px';
const MAIN_TEXT_COLOR = '#3f1f11';

const DATE_OPTIONS = [
  "September - October 2025",
  "July - August 2025",
  "May - June 2025",
  "March - April 2025",
  "January - February 2025",
  "November - December 2024",
];

const diseaseData = [
  {
    label: "Leaf Spot Disease",
    cases: 450,
    percentage: 45,
    color: '#FCD1C1',
    legendColor: '#FCD1C1',
    start: 0,
    end: 45,
    pathKey: 'p8dbde80'
  },
  {
    label: "Anthracnose",
    cases: 300,
    percentage: 30,
    color: '#CFF39E',
    legendColor: '#CFF39E',
    start: 45,
    end: 75,
    pathKey: 'p8dbde80'
  },
  {
    label: "Oidium Heveae",
    cases: 250,
    percentage: 25,
    color: '#7CB154',
    legendColor: '#7CB154',
    start: 75,
    end: 100,
    pathKey: 'p371ee300'
  },
];

const allLocalOccurrenceData = [
  {
    city: "Cebu City",
    cases: 150
  },
  {
    city: "Carmen",
    cases: 300
  },
  {
    city: "Santander",
    cases: 250
  },
  {
    city: "Toledo",
    cases: 250
  },
  {
    city: "Danao",
    cases: 180
  },
  {
    city: "Carcar",
    cases: 220
  },
  {
    city: "Moalboal",
    cases: 90
  },
  {
    city: "Bogo",
    cases: 120
  },
  {
    city: "Talisay",
    cases: 280
  },
  {
    city: "Liloan",
    cases: 110
  },
];


const UserIcon = ({ className, ...restProps }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={MAIN_TEXT_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...restProps}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LeafIcon = ({ className, ...restProps }) => (
  <Leaf stroke={MAIN_TEXT_COLOR} className={className} {...restProps} />
);

const DiseaseIcon = ({ className, ...restProps }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={MAIN_TEXT_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...restProps}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#D94B3F" fillOpacity="0.5" />
    <circle cx="12" cy="12" r="10" stroke={MAIN_TEXT_COLOR} strokeWidth="2" />
    <path d="M12 16V8M8 12h8" stroke={MAIN_TEXT_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDownIcon = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="10" viewBox="0 0 18 10" fill="none" className={`ml-2 transition-transform duration-200 ${className}`}>
    <path d="M16 2L9.04907 9L2 2" stroke={MAIN_TEXT_COLOR} strokeWidth="1.5" />
  </svg>
);

const DataSummaryCard = ({ title, value, IconComponent }) => (
  <div
    className="flex flex-col items-center justify-center rounded-[20px] p-4 h-[140px] w-full min-w-[150px] text-center"
    style={{
      backgroundColor: DATA_CARD_BG,
      boxShadow: CARD_SHADOW,
    }}
  >
    <div className="flex flex-row items-center justify-center gap-2 mb-2">
      <IconComponent className="w-5 h-5 opacity-70" />
      <span className="font-['Poppins:Bold',_sans-serif] text-[12px]" style={{ color: MAIN_TEXT_COLOR }}>{title}</span>
    </div>
    <div className="font-['Poppins:Bold',_sans-serif] text-[30px] leading-none" style={{ color: MAIN_TEXT_COLOR }}>
      {value}
    </div>
  </div>
);

const LocalOccurrenceBar = ({ city, cases, maxCases = 300 }) => {
  const barColor = 'rgba(129,82,61,0.35)';
  const barWidthPercentage = `${(cases / maxCases) * 100}%`;

  return (
    <div className="flex justify-between items-center py-1 font-['Poppins:Regular',_sans-serif] text-[14px]" style={{ color: MAIN_TEXT_COLOR }}>
      <div className="w-24 text-left">{city}</div>
      <div className="flex-grow h-[10px] mx-4 flex items-center bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: barWidthPercentage, backgroundColor: barColor }}
        />
      </div>
      <div className="w-20 text-right">{cases} Cases</div>
    </div>
  );
};

const PieChartVisual = () => (
  <div className="relative size-[290px]" style={{ borderRadius: '50%' }}>
    <div className="absolute inset-0 size-full" style={{
      background: `conic-gradient(
                ${diseaseData[0].color} ${diseaseData[0].start}% ${diseaseData[0].end}%,
                ${diseaseData[1].color} ${diseaseData[1].start}% ${diseaseData[1].end}%,
                ${diseaseData[2].color} ${diseaseData[2].start}% ${diseaseData[2].end}%
            )`,
      borderRadius: '50%',
    }} />
    <div className="absolute size-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
  </div>
);

const PieChartLeaderLines = () => {
  const lines = [
    {
      d: "M -500 50 L 130 30",
      stroke: MAIN_TEXT_COLOR,
    },
    {
      d: "M 270 100 L 500 50",
      stroke: MAIN_TEXT_COLOR,
    },
    {
      d: "M 50 230 L 150 160",
      stroke: MAIN_TEXT_COLOR,
    },
  ];

  return (
    <svg
      width="400"
      height="320"
      viewBox="0 0 400 320"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ pointerEvents: 'none' }}
    >
      <g transform="translate(0, 0)">
        {lines.map((line, index) => (
          <path key={index} d={line.d} stroke={line.stroke} strokeWidth="1" fill="none" />
        ))}
      </g>
    </svg>
  );
};

const PieChartDataLabels = () => {
  const internalLabelData = [
    {
      percentageText: '45%',
      style: { top: '35%', left: '80%', transform: 'translate(-50%, -50%)', fontWeight: 600 }
    },
    {
      percentageText: '25%', style:
        { top: '70%', left: '30%', transform: 'translate(-50%, -50%)', fontWeight: 600 }
    },
    {
      percentageText: '30%', style:
        { top: '21%', left: '25%', transform: 'translate(-50%, -50%)', fontWeight: 600 }
    }
  ];

  const externalLabelData = [
    {
      label: "Leaf Spot Disease",
      percentage: '45%',
      cases: '450 Cases',
      style: { top: '100px', left: '340px', transform: 'translate(0, -50%)', textAlign: 'left', whiteSpace: 'nowrap' },
      align: 'items-start'
    },
    {
      label: "Anthracnose",
      percentage: '30%',
      cases: '300 Cases',
      style: { top: '300px', left: '-80px', transform: 'translate(0, -50%)', textAlign: 'right' },
      align: 'items-end'
    },
    {
      label: "Oidium Heveae",
      percentage: '25%',
      cases: '250 Cases',
      style: { top: '70px', left: '-150px', transform: 'translate(0, -50%)', textAlign: 'center' },
      align: 'items-center'
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ color: MAIN_TEXT_COLOR, zIndex: 10 }}>

      {internalLabelData.map((data, index) => (
        <div
          key={`internal-${index}`}
          className="absolute font-['Poppins:Bold',_sans-serif] text-[16px] pointer-events-auto text-center"
          style={data.style}
        >
          {data.percentageText}
        </div>
      ))}

      {externalLabelData.map((data, index) => (
        <div
          key={`external-${index}`}
          className={`absolute flex flex-col pointer-events-auto ${data.align}`}
          style={data.style}
        >
          <span className="font-['Poppins:Medium',_sans-serif] text-[14px] leading-tight mb-1">{data.label}</span>
          <span className="font-['Poppins:Medium',_sans-serif] text-[14px] leading-tight" style={{ color: '#3F1F11' }}>
            {data.percentage}
          </span>
          <span className="font-['Poppins:Regular',_sans-serif] text-[14px] leading-tight">
            {data.cases}
          </span>
        </div>
      ))}
    </div>
  );
};

const PieChartLegends = () => (
  <div className="mt-8 space-y-2">
    <h4 className="font-['Poppins:Regular',_sans-serif] text-[16px] mb-2" style={{ color: MAIN_TEXT_COLOR }}>Legends</h4>
    {diseaseData.map((d, index) => (
      <div key={index} className="flex items-center gap-2">
        <div className="size-[15px] rounded-sm" style={{ backgroundColor: d.legendColor }} />
        <span className="font-['Poppins:Regular',_sans-serif] text-[14px]" style={{ color: MAIN_TEXT_COLOR }}>{d.label}</span>
      </div>
    ))}
  </div>
);


export default function DataAnalyticsAdmin() {
  const [occurrencePage, setOccurrencePage] = useState(1);
  const localItemsPerPage = 4;

  // --- Dropdown State ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0]); // Initialize with the first option

  const occurrenceTotalPages = Math.ceil(allLocalOccurrenceData.length / localItemsPerPage);
  const occurrenceStartIndex = (occurrencePage - 1) * localItemsPerPage;
  const currentOccurrenceData = allLocalOccurrenceData.slice(
    occurrenceStartIndex,
    occurrenceStartIndex + localItemsPerPage
  );

  const handleOccurrencePageChange = (page) => {
    if (page === '...') return;
    setOccurrencePage(page);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsDropdownOpen(false);
    // Add logic here to fetch new data based on the selected date range if needed
  };

  const goToPrevPage = () => {
    if (occurrencePage > 1) {
      setOccurrencePage(occurrencePage - 1);
    }
  };

  const goToNextPage = () => {
    if (occurrencePage < occurrenceTotalPages) {
      setOccurrencePage(occurrencePage + 1);
    }
  };

  const getOccurrencePageNumbers = (totalPages, currentPage) => {
    const pageNumbers = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push('...');

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) pageNumbers.push('...');
      if (totalPages > 1) pageNumbers.push(totalPages);
    }

    return Array.from(new Set(pageNumbers));
  };

  return (
    <div className="bg-[#FAE4CB] min-h-screen font-sans">
      <Sidebar />
      <div className="relative" style={{ minHeight: '100vh', paddingLeft: SIDEBAR_WIDTH }}>
        <header className="px-10 py-10">
          <h1 className="font-['Poppins:SemiBold',_sans-serif] text-[45px]" style={{ color: MAIN_TEXT_COLOR }}>Dashboard</h1>
        </header>
        <main className="px-10 pb-10 grid grid-cols-7 gap-8">

          <div className="col-span-4">
            <h2 className="font-['Poppins:Bold',_sans-serif] text-[24px] border-b-[3px] border-[#81523d] pb-1 inline-block pr-4 mb-4" style={{ color: MAIN_TEXT_COLOR }}>
              Data analytics
            </h2>

            <div className="p-6 rounded-[20px] w-full"
              style={{ backgroundColor: DATA_CARD_BG, boxShadow: CARD_SHADOW }}
            >
              <h3 className="font-['Poppins:Medium',_sans-serif] text-[20px] mb-4" style={{ color: MAIN_TEXT_COLOR }}>
                Distribution of Rubber Tree Leaf Diseases Detected
              </h3>

              {/* --- Dropdown Container (Relative for absolute positioning) --- */}
              <div className="relative w-[244px] mb-6 z-20">
                {/* --- Dropdown Trigger --- */}
                <div
                  className="flex items-center justify-between h-[32px] rounded-[20px] border border-[#6c6c6c] px-4 cursor-pointer transition-shadow duration-150 active:shadow-md"
                  style={{ backgroundColor: DATA_CARD_BG }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="font-['Montserrat:Regular',_sans-serif] text-[14px] text-black">
                    {selectedDate}
                  </span>
                  <ArrowDownIcon className={isDropdownOpen ? 'rotate-180' : 'rotate-0'} />
                </div>

                {/* --- Dropdown List --- */}
                {isDropdownOpen && (
                  <div
                    className="absolute top-full mt-1 w-full rounded-[10px] border border-[#6c6c6c] overflow-hidden"
                    style={{ backgroundColor: DATA_CARD_BG, boxShadow: CARD_SHADOW }}
                  >
                    {DATE_OPTIONS.map((date, index) => (
                      <div
                        key={index}
                        className={`px-4 py-2 text-[14px] font-['Montserrat:Regular',_sans-serif] cursor-pointer hover:bg-gray-100 ${date === selectedDate ? 'bg-[#81523d] text-white hover:bg-[#81523d]/80' : 'text-black'}`}
                        onClick={() => handleDateSelect(date)}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative flex justify-center items-center h-[500px]">
                <div className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <PieChartVisual />
                </div>
                <PieChartLeaderLines />
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 size-[290px]">
                  <PieChartDataLabels />
                </div>
                <div className="absolute bottom-0 left-0">
                  <PieChartLegends />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3 space-y-8">
            <h2 className="font-['Poppins:Medium',_sans-serif] text-[24px] pt-1" style={{ color: MAIN_TEXT_COLOR }}>
              Data Summary
            </h2>

            <div className="flex justify-between space-x-4">
              <DataSummaryCard title="Total Users" value="10,539" IconComponent={UserIcon} />
              <DataSummaryCard title="Leaf scans per user" value="956" IconComponent={LeafIcon} />
              <DataSummaryCard title="Leaf disease cases" value="1,000" IconComponent={DiseaseIcon} />
            </div>

            <div className="p-6 rounded-[20px] space-y-4"
              style={{ backgroundColor: DATA_CARD_BG, boxShadow: CARD_SHADOW }}
            >
              <h3 className="font-['Poppins:Medium',_sans-serif] text-[20px]" style={{ color: MAIN_TEXT_COLOR }}>
                Local Occurrence of leaf disease
              </h3>

              <div className="flex flex-col space-y-3">
                {currentOccurrenceData.map((data, index) => (
                  <LocalOccurrenceBar
                    key={index}
                    city={data.city}
                    cases={data.cases}
                    maxCases={300}
                  />
                ))}
              </div>

              {occurrenceTotalPages > 1 && (
                <div className="flex justify-end pt-2">
                  <div className="flex space-x-2 items-center font-['Poppins:Light',_sans-serif] text-[13px] text-[#26130a]">

                    <div
                      onClick={goToPrevPage}
                      className={`cursor-pointer text-[15px] font-semibold ${occurrencePage === 1 ? 'opacity-50 pointer-events-none' : 'hover:text-[#3F1F11]'}`}
                    >
                      {'<'}
                    </div>

                    {getOccurrencePageNumbers(occurrenceTotalPages, occurrencePage).map((page, index) => (
                      <div
                        key={index}
                        onClick={() => handleOccurrencePageChange(page)}
                        className={`cursor-pointer size-5 rounded-full flex items-center justify-center transition-colors duration-150 ${page === occurrencePage
                          ? 'bg-[#3F1F11] text-white font-semibold'
                          : page === '...'
                            ? 'text-[#26130a] cursor-default'
                            : 'text-[#26130a] hover:bg-[#EAEAEA]'
                          }`}
                      >
                        {page}
                      </div>
                    ))}

                    <div
                      onClick={goToNextPage}
                      className={`cursor-pointer text-[15px] font-semibold ${occurrencePage === occurrenceTotalPages ? 'opacity-50 pointer-events-none' : 'hover:text-[#3F1F11]'}`}
                    >
                      {'>'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}