import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { account } from "../lib/appwrite";

// SVG Paths for the data analytics components
const svgPaths = {
  p1365b980: "M11.7701 16.2499C11.4427 16.9993 11.258 17.8252 11.2502 18.6933L11.25 18.75V26.25H3.75V21.25C3.75 18.5151 5.94299 16.2948 8.6673 16.2507L8.74998 16.25L11.7701 16.2499ZM21.25 13.75C24.0115 13.75 26.25 15.9886 26.25 18.75V26.25H12.5V18.75C12.5 15.9886 14.7386 13.75 17.5 13.75H21.25ZM10 7.5C12.0676 7.5 13.75 9.18252 13.75 11.25C13.75 13.3175 12.0676 15 10 15C7.93254 15 6.25002 13.3175 6.25002 11.25C6.25002 9.18252 7.93254 7.5 10 7.5ZM19.375 3.75C21.7876 3.75 23.75 5.71248 23.75 8.12502C23.75 10.5376 21.7876 12.5 19.3751 12.5C16.9625 12.5 15.0001 10.5375 15.0001 8.12502C15 5.71248 16.9625 3.75 19.375 3.75Z",
  p16ac4700: "M182.903 44.8075C177.019 62.9172 167.625 79.6906 155.259 94.17C142.892 108.649 127.795 120.551 110.829 129.196C93.8624 137.841 75.3595 143.059 56.3766 144.553C37.3936 146.047 18.3022 143.787 0.192523 137.903L45 1.52588e-05L182.903 44.8075Z",
  p235cbf00: "M16.25 11.25V3.75H26.25V11.25H16.25ZM3.75 16.25V3.75H13.75V16.25H3.75ZM16.25 26.25V13.75H26.25V26.25H16.25ZM3.75 26.25V18.75H13.75V26.25H3.75Z",
  p2450d500: "M100.193 282.903C67.3574 272.234 39.4064 250.2 21.3672 220.762C3.32794 191.325 -3.6157 156.417 1.78519 122.317C7.18609 88.2171 24.5771 57.1633 50.83 34.7411C77.083 12.319 110.475 -4.11706e-07 145 0L145 145L100.193 282.903Z",
  p2ff93780: "M13.75 11.25C13.75 13.325 12.075 15 10 15C7.925 15 6.25 13.325 6.25 11.25C6.25 9.175 7.925 7.5 10 7.5C12.075 7.5 13.75 9.175 13.75 11.25ZM17.5 25H2.5V22.5C2.5 19.7375 5.8625 17.5 10 17.5C14.1375 17.5 17.5 19.7375 17.5 22.5M27.5 15V17.5H16.25V15M27.5 10V12.5H16.25V10M27.5 5V7.5H16.25V5H27.5Z",
  p371ee300: "M1 17.6265L122.913 1L155.146 17.6265",
  p3e0f0900: "M0 0H304C313.428 0 318.142 0 321.071 2.92893C324 5.85786 324 10.5719 324 20V181.5V616.5V691.5V962C324 971.428 324 976.142 321.071 979.071C318.142 982 313.428 982 304 982H0V0Z",
  p8dbde80: "M1 30.2375L14.936 1.00002L161.042 22.5283",
  p9916c00: "M0 0H319C321.761 0 324 2.23858 324 5V50C324 52.7614 321.761 55 319 55H0V0Z",
  pc04f100: "M0 0.592226C0 0.44199 0.0593956 0.288243 0.174693 0.172946C0.405287 -0.0576486 0.782624 -0.0576486 1.01322 0.172946L8.90584 8.06557L16.6832 0.288243C16.9138 0.0576485 17.2911 0.0576485 17.5217 0.288243C17.7523 0.518837 17.7523 0.896174 17.5217 1.12677L9.3251 9.32685C9.09451 9.55744 8.71717 9.55744 8.48658 9.32685L0.174693 1.01497C0.0559017 0.896174 0 0.745938 0 0.592226Z",
  pd75b600: "M1.69879e-05 0C22.8825 2.72871e-07 45.4402 5.41561 65.8286 15.8041C86.2171 26.1925 103.857 41.2588 117.307 59.7711C130.757 78.2835 139.635 99.7162 143.215 122.317C146.794 144.918 144.974 168.045 137.903 189.807L1.52588e-05 145L1.69879e-05 0Z",
  pdb98a80: "M6.25 26.25C5.5625 26.25 4.97417 26.0054 4.485 25.5163C3.99583 25.0271 3.75083 24.4383 3.75 23.75V6.25C3.75 5.5625 3.995 4.97417 4.485 4.485C4.975 3.99583 5.56333 3.75083 6.25 3.75H13.75C14.1042 3.75 14.4013 3.87 14.6413 4.11C14.8813 4.35 15.0008 4.64667 15 5C14.9992 5.35333 14.8792 5.65042 14.64 5.89125C14.4008 6.13208 14.1042 6.25167 13.75 6.25H6.25V23.75H13.75C14.1042 23.75 14.4013 23.87 14.6413 24.11C14.8813 24.35 15.0008 24.6467 15 25C14.9992 25.3533 14.8792 25.6504 14.64 25.8912C14.4008 26.1321 14.1042 26.2517 13.75 26.25H6.25ZM21.4687 16.25H12.5C12.1458 16.25 11.8492 16.13 11.61 15.89C11.3708 15.65 11.2508 15.3533 11.25 15C11.2492 14.6467 11.3692 14.35 11.61 14.11C11.8508 13.87 12.1475 13.75 12.5 13.75H21.4687L19.125 11.4062C18.8958 11.1771 18.7812 10.8958 18.7812 10.5625C18.7812 10.2292 18.8958 9.9375 19.125 9.6875C19.3542 9.4375 19.6458 9.30708 20 9.29625C20.3542 9.28542 20.6563 9.40542 20.9063 9.65625L25.375 14.125C25.625 14.375 25.75 14.6667 25.75 15C25.75 15.3333 25.625 15.625 25.375 15.875L20.9063 20.3437C20.6563 20.5937 20.3596 20.7137 20.0163 20.7037C19.6729 20.6937 19.3758 20.5633 19.125 20.3125C18.8958 20.0625 18.7867 19.7658 18.7975 19.4225C18.8083 19.0792 18.9279 18.7925 19.1562 18.5625L21.4687 16.25Z",
  pf199580: "M9.6625 20.625H10.9125V15H9.6625V20.625ZM19.0875 20.625H20.3375V8.75H19.0875V20.625ZM14.375 20.625H15.625V17.5H14.375V20.625ZM14.375 15H15.625V12.5H14.375V15ZM7.02 25C6.44417 25 5.96375 24.8075 5.57875 24.4225C5.19375 24.0375 5.00083 23.5567 5 22.98V7.02C5 6.44417 5.19292 5.96375 5.57875 5.57875C5.96458 5.19375 6.445 5.00083 7.02 5H22.9813C23.5563 5 24.0367 5.19292 24.4225 5.57875C24.8083 5.96458 25.0008 6.445 25 7.02V22.9813C25 23.5563 24.8075 24.0367 24.4225 24.4225C24.0375 24.8083 23.5567 25.0008 22.98 25H7.02ZM7.02 23.75H22.9813C23.1729 23.75 23.3492 23.67 23.51 23.51C23.6708 23.35 23.7508 23.1733 23.75 22.98V7.02C23.75 6.8275 23.67 6.65083 23.51 6.49C23.35 6.32917 23.1733 6.24917 22.98 6.25H7.02C6.8275 6.25 6.65083 6.33 6.49 6.49C6.32917 6.65 6.24917 6.82667 6.25 7.02V22.9813C6.25 23.1729 6.33 23.3492 6.49 23.51C6.65 23.6708 6.82625 23.7508 7.01875 23.75",
};

// Data Analytics Components
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
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.4836861193180084)+(var(--transform-inner-height)*0.8752415180206299)))] items-center justify-center left-[411px] top-[432px] w-[calc(1px*((var(--transform-inner-height)*0.4836861193180084)+(var(--transform-inner-width)*0.8752415180206299)))]" style={{ "--transform-inner-width": "160", "--transform-inner-height": "29" } }>
        <div className="flex-none rotate-[331.074deg]">
          <div className="h-[29.238px] relative w-[160.042px]">
            <div className="absolute inset-[-1.88%_-0.05%_-0.74%_-0.28%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 162 31">
                <path d={svgPaths.p8dbde80} id="Line 1" stroke="var(--stroke-0, #3F1F11)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.3568045198917389)+(var(--transform-inner-height)*0.9341790676116943)))] items-center justify-center left-[647px] top-[516px] w-[calc(1px*((var(--transform-inner-height)*0.3568045198917389)+(var(--transform-inner-width)*0.9341790676116943)))]" style={{ "--transform-inner-width": "154", "--transform-inner-height": "17" } }>
        <div className="flex-none rotate-[20.904deg]">
          <div className="h-[16.627px] relative w-[154.146px]">
            <div className="absolute inset-[-3.11%_-0.15%_-2.98%_-0.04%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 156 19">
                <path d={svgPaths.p371ee300} id="Line 2" stroke="var(--stroke-0, #3F1F11)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.38461539149284363)+(var(--transform-inner-height)*0.9230769276618958)))] items-center justify-center left-[690px] top-[371px] w-[calc(1px*((var(--transform-inner-height)*0.38461539149284363)+(var(--transform-inner-width)*0.9230769276618958)))]" style={{ "--transform-inner-width": "130", "--transform-inner-height": "19" } }>
        <div className="flex-none rotate-[337.38deg]">
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

function DataAnalyticsContent() {
  return (
    <div className="bg-[#fae4cb] relative size-full" data-name="Data Analytics - Admin">
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
      
      <div className="absolute left-[99px] size-[125px] top-[63px]" data-name="LOGO">
        <img
          alt="RubberTap Logo"
          className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
          src="/rubbertap-logo.png"
        />
      </div>
      <div className="absolute flex flex-col font-['Poppins:SemiBold',_sans-serif] justify-center leading-[0] left-[537px] not-italic text-[#3f1f11] text-[45px] text-center text-nowrap top-[110px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">Data Analytics</p>
      </div>
      
      {/* Main Analytics Content */}
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
      
      <Group75 />
    </div>
  );
}

// Main Analytics Component
export default function Analytics() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await account.get();
        setUser(result);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getUser();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 min-h-screen flex-1 bg-[#F6E6D0] p-6">
        <Navbar />
        <main className="p-10 mt-6 mx-7">
          <h2 className="text-4xl text-[#4B2E1E] mb-16">Data Analytics</h2>
          <div className="rounded-xl bg-white p-8 shadow mb-8 w-full">
            <DataAnalyticsContent />
          </div>
        </main>
      </div>
    </div>
  );
}