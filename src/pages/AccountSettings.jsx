import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AccountSettings() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const result = await fetch(`${BASE_URL}/api/v1/users/user/${userId}`);
        const dataAdmin = await result.json();
        setUser(dataAdmin);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="ml-60 min-h-screen flex-1 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
        <Navbar />

        <main className="p-10 mt-6 mx-7">
          {/* Header */}
          <h2 className="text-4xl text-[#4B2E1E] font-bold mb-10">
            Account Settings
          </h2>

          {/* ACCOUNT CARD */}
          <div className="bg-[#FFF1DD] rounded-2xl shadow-lg p-10 flex justify-between items-start border border-[#E5C9A3]">
            <div>
              <div className="mb-8">
                <p className="text-lg text-[#4B2E1E] font-semibold">
                  Username:
                </p>
                <p className="text-xl text-[#4B2E1E]">{user?.fullName}</p>
              </div>

              <div>
                <p className="text-lg text-[#4B2E1E] font-semibold">Email:</p>
                <p className="text-xl text-[#4B2E1E]">{user?.email}</p>
              </div>
            </div>

            {/* Change password link */}
            <button
              onClick={() => setShowChangePassword(true)}
              className="text-[#4B2E1E] font-semibold underline hover:text-[#7CB154] text-xl"
            >
              Change Password?
            </button>
          </div>

          {/* PASSWORD MODAL */}
          {showChangePassword && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
              <div className="bg-[#FFF4E1] w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden relative">
                {/* MODAL HEADER */}
                <div className="bg-[#FFE9C0] px-8 py-5 border-b border-[#e5d3ad]">
                  <h3 className="text-2xl font-bold text-[#4B2E1E]">
                    System Admin Account Management
                  </h3>
                </div>

                {/* FORM BODY */}
                <form className="px-8 py-8">
                  <h4 className="text-xl font-semibold text-[#4B2E1E] mb-6">
                    Change Password
                  </h4>

                  <div className="mb-5 flex items-center">
                    <label className="w-44 text-[#4B2E1E] font-medium">
                      Username:
                    </label>
                    <input
                      type="text"
                      value={user?.username || ""}
                      readOnly
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 bg-white shadow-sm"
                    />

                  </div>

                  <div className="mb-5 flex items-center">
                    <label className="w-44 text-[#4B2E1E] font-medium">
                      Password:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-12 shadow-sm"
                      />


                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        tabIndex={-1}
                      >
                        <img
                          src={showPassword ? "/eye_off.png" : "/eye.png"}
                          alt="toggle"
                          className="w-8 h-8 opacity-80"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mb-10 flex items-center">
                    <label className="w-44 text-[#4B2E1E] font-medium">
                      Confirm Password:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-12 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        tabIndex={-1}
                      >
                        <img
                          src={showConfirm ? "/eye_off.png" : "/eye.png"}
                          alt="toggle"
                          className="w-8 h-8 opacity-80"
                        />
                      </button>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowChangePassword(false)}
                      className="px-10 py-2 rounded-xl font-semibold bg-[#FF6B6B] text-white shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-10 py-2 rounded-xl font-semibold bg-[#7CB154] text-white shadow-md"
                    >
                      Save
                    </button>
                  </div>
                </form>

                {/* CLOSE BUTTON */}
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="absolute top-4 right-6 text-4xl leading-none text-gray-400 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
