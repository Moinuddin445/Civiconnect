import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Temporarily bypass token for development if needed, or pass it
      const response = await axios.get("http://localhost:8080/api/complaints/analytics");
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;

  const resolutionRate = stats.totalComplaints > 0 
    ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">System Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Complaints */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Complaints</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</h3>
          </div>
        </div>

        {/* Pending / Active */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active / Pending</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingComplaints}</h3>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Resolved</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.resolvedComplaints}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Resolution Rate</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className="bg-green-500 h-4 rounded-full transition-all duration-1000" 
            style={{ width: `${resolutionRate}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 text-right">{resolutionRate}% of all complaints have been resolved.</p>
      </div>
    </div>
  );
};

export default AdminAnalytics;
