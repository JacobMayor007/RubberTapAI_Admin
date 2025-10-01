import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../lib/appwrite";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    // try {
    //   event.preventDefault();

    //   setLoading(true);

    //   const result = await account.createEmailPasswordSession({
    //     email,
    //     password,
    //   });

    //   if (!result) {
    //     return;
    //   }

    //   // Optionally generate JWT if your backend needs it
    //   const jwtResponse = await account.createJWT();
    //   localStorage.setItem("token", jwtResponse.jwt);
    //   navigate("/dashboard");
    // } catch (err) {
    //   console.error("Login request failed:", err);
    //   setError(err);
    //   throw err;
    // }
    event.preventDefault();

    setLoading(true);
    try {
      console.log("API URL:", `${import.meta.env.VITE_API_URL}/api/v1/admin`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await res.json();

      alert(json.title, json.message);

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || `Login failed (${res.status})`);
      }

      // ✅ Store the session data from backend response
      localStorage.setItem("sessionId", json.data.sessionId);
      localStorage.setItem("userId", json.data.userId);

      // ✅ Navigate to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      console.error("Login request failed:", err);

      if (err.name === "AbortError") {
        setError("Request timeout - server is not responding");
      } else if (err.message.includes("Failed to fetch")) {
        setError(
          "Cannot connect to server. Please check if the server is running."
        );
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  console.log("API URL:", `${import.meta.env.VITE_API_URL}/api/v1/admin`);

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE IMAGE */}
      <div
        className="hidden w-2/3 bg-cover bg-center md:block"
        style={{ backgroundImage: "url('/rubber-trees.png')" }}
      ></div>

      {/* RIGHT SIDE LOGIN AREA */}
      <div
        className="flex w-full md:w-1/3 flex-col items-center justify-center bg-cover bg-center px-10"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      >
        <div className="w-full max-w-md space-y-8 text-center">
          {/* LOGO + TITLE */}
          <div className="relative inline-block">
            {/* logo image */}
            <img
              src="/rubbertap-logo.png"
              alt="RubberTapAI"
              className="mx-auto mb-2 w-20"
            />

            {/* RUBBERTAP + AI */}
            <h1
              className="bg-gradient-to-r from-[#75A90A] to-[#7CB154] bg-clip-text 
                         font-poppins text-[30px] font-black leading-none text-transparent"
            >
              RUBBERTAP
            </h1>
            <span
              className="absolute bottom-1 right-0 bg-gradient-to-r from-[#75A90A] to-[#557A08] bg-clip-text
                         font-poppins text-[20px] font-medium leading-none text-transparent"
            >
              AI
            </span>

            {/* ADMIN TEXT */}
            <p className="mt-1 text-sm text-gray-100">Admin</p>
          </div>

          {/* LOGIN FORM */}
          <form
            onSubmit={handleLogin}
            className="flex flex-col items-center space-y-5"
          >
            {/* EMAIL FIELD */}
            <div
              className="flex items-center w-[317px] h-[45px] px-3 rounded-md
                      bg-[#FFFFFF80] border border-[#FFFFFF33]
                      focus-within:bg-[#FFFFFFA6] focus-within:shadow-[0_0_4px_#202020] 
                      focus-within:ring-1 focus-within:ring-[#0000D066]
                      transition-colors duration-200"
            >
              <Mail className="w-5 h-5 text-gray-700 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div
              className="flex items-center w-[317px] h-[45px] px-3 rounded-md
                      bg-[#FFFFFF80] border border-[#FFFFFF33]
                      focus-within:bg-[#FFFFFFA6] focus-within:shadow-[0_0_4px_#202020] 
                      focus-within:ring-1 focus-within:ring-[#0000D066]
                      transition-colors duration-200"
            >
              <Lock className="w-5 h-5 text-gray-700 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none"
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-[317px] h-[45px] rounded-md bg-[#C9F24E]
                   text-gray-900 font-semibold hover:brightness-95 transition"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
