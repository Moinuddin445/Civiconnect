import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, Users, UserPlus } from "lucide-react";

const Signup = () => {
  const [role, setRole] = useState("ROLE_CITIZEN");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/register`,
        { name, email, password, confirmPassword, role }
      );

      if (response.status === 200) {
        navigate("/signin");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center min-h-screen p-4">
      {/* Background accent */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-500 from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-teal-500/8 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md ">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500 from-blue-500 to-blue-600 shadow-lg shadow mb-4">
            <UserPlus className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
          <p className="text-gray-600 text-sm">
            Join the CivicConnect community
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="label-text flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("ROLE_CITIZEN")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    role === "ROLE_CITIZEN"
                      ? "bg-blue-600 from-blue-500 to-blue-600 text-black shadow-lg shadow"
                      : "bg-white border border-gray-200 rounded text-gray-600 hover:text-black hover:border-white/20"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => setRole("ROLE_OFFICER")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    role === "ROLE_OFFICER"
                      ? "bg-blue-600 from-blue-500 to-blue-600 text-black shadow-lg shadow"
                      : "bg-white border border-gray-200 rounded text-gray-600 hover:text-black hover:border-white/20"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Officer
                </button>
              </div>
            </div>

            <div>
              <label className="label-text flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Full Name
              </label>
              <input
                type="text"
                id="signup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-bg-white border border-gray-200 rounded"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="label-text flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email
              </label>
              <input
                type="email"
                id="signup-email"
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
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-bg-white border border-gray-200 rounded"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="label-text flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                Confirm Password
              </label>
              <input
                type="password"
                id="signup-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-bg-white border border-gray-200 rounded"
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              id="signup-submit"
              disabled={isLoading}
              className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/signin"
                className="text-blue-600 hover:text-orange-300 font-medium transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
