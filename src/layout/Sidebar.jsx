import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const base =
    "flex items-center gap-3 px-8 py-3 text-[#C2E18A] hover:bg-[#6B4226] hover:text-white transition-all";
  const active = "bg-[#A6A06B] text-white font-regular";

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-65 bg-gradient-to-br from-[#7B4B2A] to-[#4B2E1E] shadow flex flex-col rounded-r-2xl">
      {/* Logo and Admin */}
      <div className="flex flex-col items-center py-8">
        <img src="/rubbertap-logo.png" alt="Logo" className="w-20 mb-2" />
        <span className="text-[#C2E18A] text-base font-medium">Admin</span>
      </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${base} ${isActive ? active : ""}`}
        >
          <img
            src="/dashboard-logo.png"
            alt="Dashboard Logo"
            className="w-30 h-30"
          />
          <span className="material-icons mt-5"></span>
          Dashboard
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) => `${base} ${isActive ? active : ""}`}
        >
          <img src="/user-logo.png" alt="Users Logo" className="w-30 h-30" />
          <span className="material-icons"></span>
          User Management
        </NavLink>
        <NavLink
          to="/account"
          className={({ isActive }) => `${base} ${isActive ? active : ""}`}
        >
          <img
            src="/account-logo.png"
            alt="Account Logo"
            className="w-30 h-30"
          />
          <span className="material-icons"></span>
          Account Settings
        </NavLink>
      </nav>
      {/* Log Out */}
      <div className="px-8 py-6 mt-auto">
        <button
          className="flex items-center gap-2 text-[#C2E18A] hover:text-white ml-auto"
          onClick={handleLogout}
        >
          <img src="logout-logo.png" alt="Logout" className="w-30 h-30" />
          <span className="material-icons"></span>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
