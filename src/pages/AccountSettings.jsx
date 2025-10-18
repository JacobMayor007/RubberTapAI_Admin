import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { account, database } from "../lib/appwrite";

export default function AccountSettings() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const result = await account.get();
      setUser(result);
    };
    getUser();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 min-h-screen flex-1 bg-[#F6E6D0] p-6">
        <Navbar />
        <main className="p-10 mt-6 mx-7">
          <h2 className="text-4xl text-[#4B2E1E] mb-16 font-bold">Account Settings</h2>
          <div className="rounded-xl bg-[#FFC98B] p-8 shadow mb-8 w-fulls flex justify-between">
            <div className="flex flex-col justify-start">
              <div className="mb-12">
                <span className="text-xl">Username:</span>
                <span className="ml-2 text-xl">{user?.name}</span>
              </div>
              <div className="mb-2">
                <span className="text-xl">Email:</span>
                <span className="ml-2 text-xl">{user?.email}</span>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <button
                className="text-[#4B2E1E] underline font-medium hover:text-[#7CB154] text-xl mt-16"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password?
              </button>
            </div>
          </div>

          {showChangePassword && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-[#FFC98B] rounded-xl shadow-lg w-full max-w-2xl p-0 relative">
                <div className="rounded-t-xl bg-[#FFE0A6] px-8 py-6">
                  <h3 className="text-2xl font-bold text-[#4B2E1E]">
                    System Admin Account Management
                  </h3>
                </div>
                <form className="px-8 py-8">
                  <h4 className="text-xl font-semibold text-[#4B2E1E] mb-6">
                    Change Password
                  </h4>

                  <div className="mb-4 flex items-center">
                    <label className="w-44 text-[#4B2E1E] font-medium">
                      Username:
                    </label>
                    <input
                      type="text"
                      value="admin"
                      readOnly
                      className="flex-1 rounded border border-gray-400 px-3 py-2"
                    />
                  </div>

                  <div className="mb-4 flex items-center">
                    <label className="w-44 text-[#4B2E1E] font-medium">
                      Password:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full rounded border border-gray-400 px-3 py-2 pr-10"
                        defaultValue="***********************"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        <img
                          src={showPassword ? "/eye_off.png" : "/eye.png"}
                          alt={showPassword ? "Hide password" : "Show password"}
                          className="w-10 h-10"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mb-8 flex items-center">
                    <label className="w-44 text-[#4B2E1E] font-medium">
                      Confirm Password:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type={showConfirm ? "text" : "password"}
                        className="w-full rounded border border-gray-400 px-3 py-2 pr-10"
                        defaultValue="***********************"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirm((v) => !v)}
                        tabIndex={-1}
                      >
                        <img
                          src={showConfirm ? "/eye_off.png" : "/eye.png"}
                          alt={showConfirm ? "Hide password" : "Show password"}
                          className="w-10 h-10"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      className="bg-[#FF2D2D] text-white font-semibold px-8 py-2 rounded-lg"
                      onClick={() => setShowChangePassword(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#7CB154] text-white font-semibold px-8 py-2 rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </form>
                <button
                  className="absolute top-4 right-6 text-3xl text-gray-400 hover:text-gray-700"
                  onClick={() => setShowChangePassword(false)}
                  title="Close"
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
