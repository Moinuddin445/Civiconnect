/* eslint-disable react/prop-types */
import { useState } from "react";
import UserManagement from "../components/UserManagement";
import TrashRequests from "../components/TrashRequests";
import NavBar from "../components/Navbar";
import AdminAnalytics from "../components/AdminAnalytics";
import AdminComplaintManagement from "../components/AdminComplaintManagement";
import { Users, ClipboardList, BarChart3, AlertTriangle } from "lucide-react";

export const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "complaints", label: "Complaints", icon: AlertTriangle },
    { id: "users", label: "User Management", icon: Users },
  ];

  return (
    <div className="bg-gray-100 min-h-screen min-h-screen">
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 ">
          <h2 className="text-2xl font-bold text-black mb-2">Admin Panel</h2>
          <p className="text-gray-600 text-sm">Manage users and complaints</p>
        </div>

        <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-6  delay-100">
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white border border-gray-200 rounded rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-blue-600 from-blue-500 to-blue-600 text-black shadow-lg shadow"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="">
            {activeTab === "analytics" && <AdminAnalytics />}
            {activeTab === "complaints" && <AdminComplaintManagement />}
            {activeTab === "users" && <UserManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
