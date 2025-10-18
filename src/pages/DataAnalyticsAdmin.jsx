import svgPaths from "./svg-nzx7gzthsn";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";


function SimpleLineIconsArrowDown({ className }) {
  return (
    <div className={className} data-name="simple-line-icons:arrow-down">
      <div className="absolute inset-[23.58%_0.28%_23.31%_0.8%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 10">
          <path d={svgPaths.pc04f100} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function IxUserManagementFilled() {
  return (
    <div className="absolute left-[38px] size-[30px] top-[367px]" data-name="ix:user-management-filled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="ix:user-management-filled">
          <path clipRule="evenodd" d={svgPaths.p1365b980} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function UserManagement() {
  return (
    <div className="absolute contents left-[38px] top-[367px]" data-name="User Management">
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[186.5px] not-italic text-[#cef39e] text-[20px] text-center text-nowrap top-[382px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">User Management</p>
      </div>
      <IxUserManagementFilled />
    </div>
  );
}

function MdiAccountDetails() {
  return (
    <div className="absolute left-[39px] size-[30px] top-[438px]" data-name="mdi:account-details">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="mdi:account-details">
          <path d={svgPaths.p2ff93780} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function AccountDetails() {
  return (
    <div className="absolute contents left-[39px] top-[438px]" data-name="Account Details">
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[173.5px] not-italic text-[#cef39e] text-[20px] text-center text-nowrap top-[453px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Account Details</p>
      </div>
      <MdiAccountDetails />
    </div>
  );
}

function MaterialSymbolsLightAnalyticsOutline() {
  return (
    <div className="absolute left-[39px] size-[30px] top-[509px]" data-name="material-symbols-light:analytics-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="material-symbols-light:analytics-outline">
          <path d={svgPaths.pf199580} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function DataAnalytics() {
  return (
    <div className="absolute contents left-0 top-[496px] font-bold" data-name="Data Analytics">
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[140.5px] not-italic text-[#cef39e] text-[20px] text-center text-nowrap top-[524px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Analytics</p>
      </div>
      <MaterialSymbolsLightAnalyticsOutline />
      <div className="absolute h-[55px] left-0 top-[496px] w-[324px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 324 55">
          <path d={svgPaths.p9916c00} fill="var(--fill-0, #CEF39E)" fillOpacity="0.15" id="Rectangle 31" />
        </svg>
      </div>
    </div>
  );
}

function MaterialSymbolsDashboard() {
  return (
    <div className="absolute left-[39px] size-[30px] top-[295px]" data-name="material-symbols:dashboard">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="material-symbols:dashboard">
          <path d={svgPaths.p235cbf00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="absolute contents left-[39px] top-[295px]" data-name="Dashboard">
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[150.5px] not-italic text-[#cef39e] text-[20px] text-center text-nowrap top-[310px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Dashboard</p>
      </div>
      <MaterialSymbolsDashboard />
    </div>
  );
}

function MaterialSymbolsLogoutRounded() {
  return (
    <div className="absolute left-[42px] size-[30px] top-[861px]" data-name="material-symbols:logout-rounded">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="material-symbols:logout-rounded">
          <path d={svgPaths.pdb98a80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[42px] top-[861px]">
      <MaterialSymbolsLogoutRounded />
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[120.5px] not-italic text-[#cef39e] text-[20px] text-center text-nowrap top-[876px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Log Out</p>
      </div>
    </div>
  );
}

function Filter() {
  return (
    <div className="absolute contents left-[394px] top-[237px]" data-name="Filter">
      <SimpleLineIconsArrowDown className="absolute left-[610px] size-[17.889px] top-[244px]" />
      <div className="absolute h-[32px] left-[394px] rounded-[20px] top-[237px] w-[244px]">
        <div aria-hidden="true" className="absolute border-[#6c6c6c] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[20px]" />
      </div>
      <div className="absolute flex flex-col font-['Montserrat:Regular',_sans-serif] font-normal justify-center leading-[0] left-[505.5px] text-[14px] text-black text-center text-nowrap top-[252.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">September - October, 2025</p>
      </div>
    </div>
  );
}

function Group67() {
  return (
    <div className="absolute contents left-[390px] top-[764px]">
      <div className="absolute bg-[#7cb154] left-[390px] size-[15px] top-[767px]" />
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[468px] not-italic text-[14px] text-black text-center text-nowrap top-[774.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Oidium Heveae</p>
      </div>
    </div>
  );
}

function Group66() {
  return (
    <div className="absolute contents left-[390px] top-[729px]">
      <div className="absolute bg-[#cef39e] left-[390px] size-[15px] top-[732px]" />
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[459px] not-italic text-[14px] text-black text-center text-nowrap top-[739.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Anthracnose</p>
      </div>
    </div>
  );
}

function Group65() {
  return (
    <div className="absolute contents left-[390px] top-[697px]">
      <div className="absolute bg-[rgba(255,78,0,0.35)] left-[390px] size-[15px] top-[700px]" />
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[475.5px] not-italic text-[14px] text-black text-center text-nowrap top-[707.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Leaf Spot Disease</p>
      </div>
    </div>
  );
}

function Group69() {
  return (
    <div className="absolute contents left-[386px] top-[663px]">
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[419.5px] not-italic text-[#3f1f11] text-[16px] text-center text-nowrap top-[675px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Legends</p>
      </div>
      <Group67 />
      <Group66 />
      <Group65 />
    </div>
  );
}

function PieChart() {
  return (
    <div className="absolute contents left-[481px] top-[312px]" data-name="Pie Chart">
      <div className="absolute left-[481px] size-[290px] top-[312px]">
        <div className="absolute bottom-0 left-[34.55%] right-[2.45%] top-1/2">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 183 145">
            <path d={svgPaths.p16ac4700} fill="var(--fill-0, #CEF39E)" id="Ellipse 9" />
          </svg>
        </div>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[648.61px] not-italic text-[#3f1f11] text-[16px] text-center text-nowrap top-[519.03px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">25%</p>
      </div>
      <div className="absolute left-[481px] size-[290px] top-[312px]">
        <div className="absolute bottom-[34.55%] left-1/2 right-0 top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 145 190">
            <path d={svgPaths.pd75b600} fill="var(--fill-0, #7CB154)" id="Ellipse 11" />
          </svg>
        </div>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[670.99px] not-italic text-[#3f1f11] text-[16px] text-center text-nowrap top-[420.43px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">30%</p>
      </div>
      <div className="absolute left-[481px] size-[290px] top-[312px]">
        <div className="absolute bottom-[2.45%] left-0 right-1/2 top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 145 283">
            <path d={svgPaths.p2450d500} fill="var(--fill-0, #FF4E00)" fillOpacity="0.35" id="Ellipse 10" />
          </svg>
        </div>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[557.97px] not-italic text-[#3f1f11] text-[16px] text-center text-nowrap top-[440.31px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">45%</p>
      </div>
    </div>
  );
}

function Group62() {
  return (
    <div className="absolute contents left-[761px] top-[310px]">
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[normal] left-[806px] not-italic text-[#3f1f11] text-[14px] text-center text-nowrap top-[341.5px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">Anthracnose</p>
        <p className="font-['Poppins:Medium',_sans-serif] mb-0">30%</p>
        <p className="font-['Poppins:Medium',_sans-serif]">300 Cases</p>
      </div>
    </div>
  );
}

function Group71() {
  return (
    <div className="absolute contents left-[378px] top-[310px]">
      <PieChart />
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[normal] left-[439.5px] not-italic text-[#3f1f11] text-[14px] text-center text-nowrap top-[566.5px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">Leaf Spot Disease</p>
        <p className="mb-0">45%</p>
        <p>450 Cases</p>
      </div>
      <Group62 />
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[normal] left-[797px] not-italic text-[#3f1f11] text-[14px] text-center text-nowrap top-[619.5px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">Oidium Heveae</p>
        <p className="font-['Poppins:Medium',_sans-serif]">
          25%
          <br aria-hidden="true" />
          250 Cases
        </p>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.4836861193180084)+(var(--transform-inner-height)*0.8752415180206299)))] items-center justify-center left-[411px] top-[432px] w-[calc(1px*((var(--transform-inner-height)*0.4836861193180084)+(var(--transform-inner-width)*0.8752415180206299)))]" style={{ "--transform-inner-width": "160", "--transform-inner-height": "29" }}>        <div className="flex-none rotate-[331.074deg]">
        <div className="h-[29.238px] relative w-[160.042px]">
          <div className="absolute inset-[-1.88%_-0.05%_-0.74%_-0.28%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 162 31">
              <path d={svgPaths.p8dbde80} id="Line 1" stroke="var(--stroke-0, #3F1F11)" />
            </svg>
          </div>
        </div>
      </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.3568045198917389)+(var(--transform-inner-height)*0.9341790676116943)))] items-center justify-center left-[647px] top-[516px] w-[calc(1px*((var(--transform-inner-height)*0.3568045198917389)+(var(--transform-inner-width)*0.9341790676116943)))]" style={{ "--transform-inner-width": "154", "--transform-inner-height": "17" }}>        <div className="flex-none rotate-[20.904deg]">
        <div className="h-[16.627px] relative w-[154.146px]">
          <div className="absolute inset-[-3.11%_-0.15%_-2.98%_-0.04%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 156 19">
              <path d={svgPaths.p371ee300} id="Line 2" stroke="var(--stroke-0, #3F1F11)" />
            </svg>
          </div>
        </div>
      </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.38461539149284363)+(var(--transform-inner-height)*0.9230769276618958)))] items-center justify-center left-[690px] top-[371px] w-[calc(1px*((var(--transform-inner-height)*0.38461539149284363)+(var(--transform-inner-width)*0.9230769276618958)))]" style={{ "--transform-inner-width": "130", "--transform-inner-height": "19" }}>        <div className="flex-none rotate-[337.38deg]">
        <div className="h-[18.887px] relative w-[130px]">
          <div className="absolute inset-[-2.62%_-0.36%_-2.93%_-0.06%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 132 21">
              <path d="M1 1L123.13 19.8875L131 1" id="Line 3" stroke="var(--stroke-0, #3F1F11)" />
            </svg>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function Group72() {
  return (
    <div className="absolute contents left-[927px] top-[284px]">
      <div className="absolute bg-[rgba(63,31,17,0.35)] left-[927px] rounded-[10px] shadow-[0px_0px_10px_1px_rgba(63,31,17,0.5)] size-[150px] top-[284px]" />
      <div className="absolute flex flex-col font-['Poppins:Bold',_sans-serif] justify-center leading-[0] left-[1001.5px] not-italic text-[#fde8c6] text-[30px] text-center text-nowrap top-[372.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">10,000</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] h-[36px] justify-center leading-[0] left-[1001.5px] not-italic text-[#fde8c6] text-[14px] text-center top-[314px] translate-x-[-50%] translate-y-[-50%] w-[123px]">
        <p className="leading-[normal]">Total Users</p>
      </div>
    </div>
  );
}

function Group73() {
  return (
    <div className="absolute contents left-[1092px] top-[284px]">
      <div className="absolute bg-[rgba(63,31,17,0.35)] left-[1092px] rounded-[10px] shadow-[0px_4px_10px_1px_rgba(63,31,17,0.5)] size-[150px] top-[284px]" />
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] h-[36px] justify-center leading-[0] left-[1166.5px] not-italic text-[#fde8c6] text-[14px] text-center top-[317px] translate-x-[-50%] translate-y-[-50%] w-[123px]">
        <p className="leading-[normal]">Leaf scans per user</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Bold',_sans-serif] justify-center leading-[0] left-[1166.5px] not-italic text-[#fde8c6] text-[30px] text-center text-nowrap top-[372.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">1,000</p>
      </div>
    </div>
  );
}

function Group74() {
  return (
    <div className="absolute contents left-[1257px] top-[284px]">
      <div className="absolute bg-[rgba(63,31,17,0.35)] left-[1257px] rounded-[10px] shadow-[0px_4px_10px_1px_rgba(63,31,17,0.5)] size-[150px] top-[284px]" />
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] h-[36px] justify-center leading-[0] left-[1331.5px] not-italic text-[#fde8c6] text-[14px] text-center top-[317px] translate-x-[-50%] translate-y-[-50%] w-[123px]">
        <p className="leading-[normal]">Total leaf disease cases</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Bold',_sans-serif] justify-center leading-[0] left-[1331.5px] not-italic text-[#fde8c6] text-[30px] text-center text-nowrap top-[372.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">1,000</p>
      </div>
    </div>
  );
}

function Group70() {
  return (
    <div className="absolute contents left-[367px] top-[168px]">
      <div className="absolute h-[750px] left-[367px] rounded-[20px] shadow-[0px_0px_25px_2px_rgba(63,31,17,0.3)] top-[168px] w-[1062px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(250, 177, 55, 0.2) 0%, rgba(250, 177, 55, 0.2) 100%), linear-gradient(90deg, rgb(255, 236, 204) 0%, rgb(255, 236, 204) 100%)" }} />
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[1112.5px] not-italic text-[#3f1f11] text-[20px] text-center text-nowrap top-[545px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Regional occurrence of leaf diseases</p>
      </div>
      <Filter />
      <Group69 />
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[1004px] not-italic text-[#3f1f11] text-[20px] text-center text-nowrap top-[252px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Data Summary</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[647px] not-italic text-[#3f1f11] text-[20px] text-center text-nowrap top-[210px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Distribution of Rubber Tree Leaf Diseases Detected</p>
      </div>
      <Group71 />
      <Group72 />
      <Group73 />
      <Group74 />
    </div>
  );
}

function Group57() {
  return (
    <div className="absolute contents left-[1082px] top-[746px]">
      <div className="absolute left-[1082px] size-[20px] top-[746px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <circle cx="10" cy="10" fill="var(--fill-0, #2E160C)" id="Ellipse 8" r="10" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Light',_sans-serif] justify-center leading-[0] left-[1090px] not-italic text-[13px] text-nowrap text-white top-[755.5px] tracking-[0.65px] translate-y-[-50%]">
        <p className="leading-[15px] whitespace-pre">1</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Light',_sans-serif] justify-center leading-[0] left-[1112px] not-italic text-[#26130a] text-[13px] text-nowrap top-[755.5px] tracking-[0.65px] translate-y-[-50%]">
        <p className="leading-[15px] whitespace-pre">2</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Light',_sans-serif] justify-center leading-[0] left-[1138px] not-italic text-[#26130a] text-[13px] text-nowrap top-[755.5px] tracking-[0.65px] translate-y-[-50%]">
        <p className="leading-[15px] whitespace-pre">3</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Light',_sans-serif] justify-center leading-[0] left-[1164px] not-italic text-[#26130a] text-[13px] text-nowrap top-[755.5px] tracking-[0.65px] translate-y-[-50%]">
        <p className="leading-[15px] whitespace-pre">4</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Light',_sans-serif] justify-center leading-[0] left-[1190px] not-italic text-[#26130a] text-[13px] text-nowrap top-[755.5px] tracking-[0.65px] translate-y-[-50%]">
        <p className="leading-[15px] whitespace-pre">...</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Light',_sans-serif] justify-center leading-[0] left-[1217px] not-italic text-[#26130a] text-[13px] text-nowrap top-[755.5px] tracking-[0.65px] translate-y-[-50%]">
        <p className="leading-[15px] whitespace-pre">8</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Light',_sans-serif] justify-center leading-[0] left-[1244px] not-italic text-[#26130a] text-[13px] text-nowrap top-[755.5px] tracking-[0.65px] translate-y-[-50%]">
        <p className="leading-[15px] whitespace-pre">{`>`}</p>
      </div>
    </div>
  );
}

function Group75() {
  return (
    <div className="absolute contents left-[927px] top-[578px]">
      <div className="absolute bg-[rgba(63,31,17,0.35)] h-[200px] left-[927px] rounded-[10px] shadow-[0px_0px_10px_1px_rgba(63,31,17,0.5)] top-[578px] w-[480px]" />
      <Group57 />
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[987px] not-italic text-[#fde8c6] text-[14px] text-center text-nowrap top-[647.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Zamboanga</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[994px] not-italic text-[#fde8c6] text-[14px] text-center text-nowrap top-[616.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Cebu Province</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[966px] not-italic text-[#fde8c6] text-[14px] text-center text-nowrap top-[678.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Davao</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[995.5px] not-italic text-[#fde8c6] text-[14px] text-center text-nowrap top-[709.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Agusan del sur</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[1349px] not-italic text-[#fde8c6] text-[14px] text-center text-nowrap top-[616.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">150 Cases</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[1349.5px] not-italic text-[#fde8c6] text-[14px] text-center text-nowrap top-[647.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">200 Cases</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[1349px] not-italic text-[#fde8c6] text-[14px] text-center text-nowrap top-[678.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">300 Cases</p>
      </div>
      <div className="absolute flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] left-[1351px] not-italic text-[#fde8c6] text-[14px] text-center text-nowrap top-[709.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">350 Cases</p>
      </div>
      <div className="absolute bg-[rgba(63,31,17,0.35)] h-[10px] left-[1057px] top-[612px] w-[61px]" />
      <div className="absolute bg-[rgba(63,31,17,0.35)] h-[10px] left-[1057px] top-[643px] w-[220px]" />
      <div className="absolute bg-[rgba(63,31,17,0.35)] h-[10px] left-[1057px] top-[674px] w-[200px]" />
      <div className="absolute bg-[rgba(63,31,17,0.35)] h-[10px] left-[1057px] top-[705px] w-[143px]" />
    </div>
  );
}

export default function DataAnalyticsAdmin() {
  return (
    <div className="bg-[#F6E6D0] relative size-full font-bold" data-name="Data Analytics - Admin">
      <Sidebar>
        <div className="absolute h-[982px] left-0 top-0 w-[324px]" data-name="SIDE BAR">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 324 982">
            <path d={svgPaths.p3e0f0900} fill="url(#paint0_linear_4_165)" id="SIDE BAR" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_4_165" x1="310.5" x2="-2.68002e-05" y1="-7.47925e-06" y2="982">
                <stop offset="0.559013" stopColor="#81523D" />
                <stop offset="1" stopColor="#3F1F11" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[161.5px] not-italic text-[#cef39e] text-[14px] text-center text-nowrap top-[206.5px] translate-x-[-50%] translate-y-[-50%]">
          <p className="leading-[normal] whitespace-pre">Admin</p>
        </div>
        <UserManagement />
        <AccountDetails />
        <DataAnalytics />
        <Dashboard />
        <Group10 />
        <div className="absolute left-[99px] size-[125px] top-[63px]" data-name="LOGO">
          <img
            alt="RubberTap Logo"
            className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
            src="/rubbertap-logo.png"
          />
        </div>
      </Sidebar>

      <Navbar />

      <div className="absolute flex flex-col font-['Poppins:SemiBold',_sans-serif] justify-center leading-[0] left-[537px] not-italic text-[#3f1f11] text-[45px] text-center text-nowrap top-[110px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Data Analytics</p>
      </div>
      <Group70 />
      <Group75 />
    </div>
  );
}