import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      if (response.data.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else if (response.data.role === "ROLE_OFFICER") {
        navigate("/officer/dashboard");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center min-h-screen p-4">
      {/* Background accent */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-500/8 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md ">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500 from-blue-500 to-blue-600 shadow-lg shadow mb-4">
            <LogIn className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm">
            Sign in to your CivicConnect account
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-text flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email
              </label>
              <input
                type="email"
                id="signin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-bg-white border border-gray-200 rounded"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="label-text flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                Password
              </label>
              <input
                type="password"
                id="signin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-bg-white border border-gray-200 rounded"
                placeholder="Enter your password"
                required
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-blue-600 hover:text-orange-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              id="signin-submit"
              disabled={isLoading}
              className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:text-orange-300 font-medium transition-colors"
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
