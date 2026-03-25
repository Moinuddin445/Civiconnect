import {
  User,
  Settings,
  Trash2,
  LogOut,
  Calendar,
  ClipboardList,
  Home,
  Users,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState({ name: "" });
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!userId || !token) {
          navigate("/signin");
          return;
        }

        const profileRole = (role === "ROLE_ADMIN" || role === "ROLE_OFFICER") ? "admin" : "citizen";
        const response = await axios.get(
          `http://localhost:8080/api/${profileRole}/profile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          navigate("/");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHomeClick = () => {
    const userRole = localStorage.getItem("role");
    if (userRole === "ROLE_ADMIN") {
      navigate("/admin");
    } else if (userRole === "ROLE_OFFICER") {
      navigate("/officer/dashboard");
    } else {
      navigate("/user");
    }
  };

  const isAdmin = localStorage.getItem("role") === "ROLE_ADMIN";

  return (
    <header className="sticky top-0 z-50 bg-white border border-gray-200 rounded border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500 from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow">
              <Users className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold text-black hidden sm:block">
              Civic<span className="text-blue-600 font-bold">Connect</span>
            </span>
          </button>

          <div className="hidden sm:block h-6 w-px bg-gray-200"></div>

          <span className="text-sm text-gray-600">
            Welcome,{" "}
            <span className="text-black font-medium">
              {user.name?.split(" ")[0]}
            </span>
            {isAdmin && (
              <span className="ml-2 badge badge-orange text-[10px]">Admin</span>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <NavLink icon={Home} label="Home" onClick={handleHomeClick} />

          <NavLink icon={ClipboardList} label="Trash" to="/trash" />

          {/* Profile Dropdown */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500 from-blue-500/20 to-blue-600/20 border border-orange-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-300 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <DropDownMenu
                onClose={() => setShowDropdown(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ icon: Icon, label, to, onClick }) => {
  const Component = to ? Link : "button";
  const props = to ? { to } : { onClick };

  return (
    <Component
      {...props}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-all duration-300"
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:block">{label}</span>
    </Component>
  );
};

export default NavBar;

function DropDownMenu({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post(
        `http://localhost:8080/api/auth/logout/${localStorage.getItem(
          "userId"
        )}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        console.log("Logout successful:", response.data);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout error:", err);
        // Still clear storage and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        navigate("/");
      });
  };

  return (
    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-300 rounded shadow p-6 rounded-xl p-1.5  z-50 shadow-2xl">
      <DropdownItem
        icon={Settings}
        label="Profile Settings"
        onClick={() => {
          onClose();
          navigate("/updateProfile");
        }}
      />
      <DropdownItem
        icon={Home} // Changed icon to Home for dashboard
        label="Dashboard" // Changed label to Dashboard
        onClick={() => {
          onClose();
          const userRole = localStorage.getItem("role");
          if (userRole === "ROLE_ADMIN") {
            navigate("/admin");
          } else if (userRole === "ROLE_OFFICER") {
            navigate("/officer/dashboard");
          } else {
            navigate("/user");
          }
        }}
      />
      <div className="h-px bg-gray-100 my-1"></div>
      <DropdownItem
        icon={LogOut}
        label="Sign Out"
        onClick={handleLogout}
        variant="danger"
      />
    </div>
  );
}

const DropdownItem = ({ icon: Icon, label, onClick, variant }) => (
  <button
    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
      variant === "danger"
        ? "text-red-600 hover:bg-red-100"
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
    }`}
    onClick={onClick}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);
