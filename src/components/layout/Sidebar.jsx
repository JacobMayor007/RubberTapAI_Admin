import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);

  const base =
    "flex items-center gap-3 px-8 py-3 text-[#C2E18A] hover:bg-[#6B4226] hover:text-white transition-all";
  const active = "bg-[#A6A06B] text-white font-regular";

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Close when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {!open && (
        <button
          className="md:hidden fixed top-4 left-4 z-[60] bg-[#7B4B2A] p-3 rounded-xl shadow-lg"
          onClick={() => setOpen(true)}
        >
          <Menu className="text-white" size={24} />
        </button>
      )}

      {/* 🟠 Mobile Backdrop */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"></div>
      )}

      {/* 🟤 Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen bg-gradient-to-br from-[#7B4B2A] to-[#4B2E1E]
          shadow flex flex-col rounded-r-2xl z-50 w-64
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ❌ Close Button (Mobile Only) */}
        <button
          className="md:hidden absolute top-4 right-4 bg-[#6B4226] p-2 rounded-lg"
          onClick={() => setOpen(false)}
        >
          <X className="text-white" size={20} />
        </button>

        {/* Logo + Admin */}
        <div className="flex flex-col items-center py-8 mt-4 md:mt-0">
          <img src="/rubbertap-logo.png" alt="Logo" className="w-20 mb-2" />
          <span className="text-[#C2E18A] text-base font-medium">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `${base} ${isActive ? active : ""}`}
          >
            <img
              src="/dashboard-logo.png"
              alt="Dashboard Logo"
              className="w-10 h-10"
            />
            Dashboard
          </NavLink>

          <NavLink
            to="/users"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `${base} ${isActive ? active : ""}`}
          >
            <img src="/user-logo.png" alt="Users Logo" className="w-10 h-10" />
            Reported Users
          </NavLink>

          <NavLink
            to="/account"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `${base} ${isActive ? active : ""}`}
          >
            <img
              src="/account-logo.png"
              alt="Account Logo"
              className="w-10 h-10"
            />
            Account Settings
          </NavLink>

          <NavLink
            to="/analytics"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `${base} ${isActive ? active : ""}`}
          >
            <img
              src="/analytics.png"
              alt="Analytics Logo"
              className="w-10 h-10"
            />
            Feedback
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="flex-row justify-end flex py-6 pr-10 mt-auto">
          <button
            className="flex items-center gap-2 text-[#C2E18A] hover:text-white"
            onClick={handleLogout}
          >
            <img src="/logout-logo.png" alt="Logout" className="w-10 h-10" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
