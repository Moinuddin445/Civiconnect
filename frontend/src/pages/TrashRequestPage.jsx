import { useState, useEffect } from "react";
import TrashRequestForm from "../components/TrashReqForm";
import RequestList from "../components/RequestList";
import { ClipboardList, Calendar, Trash2, Loader } from "lucide-react";
import axios from "axios";
import NavBar from "../components/Navbar";

const TrashRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [sector, setSector] = useState();
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem("role");

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setRequests(response.data);
      if (response.data.length > 0) setSector(response.data[0].sector);
    } catch (error) {
      console.error("Error fetching requests:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const AdminStats = () => (
    <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-black flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-blue-600" />
        Request Overview
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-black">{requests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-black">
                {requests.filter((req) => !req.serviceDate).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen min-h-screen">
        <NavBar />
        <div className="flex items-center justify-center py-24">
          <Loader className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen min-h-screen">
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 ">
          <h2 className="text-2xl font-bold text-black mb-2 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-blue-600" />
            Trash Pickups {sector ? `— ${sector}` : ""}
          </h2>
          <p className="text-gray-600 text-sm">
            {userRole === "ROLE_ADMIN"
              ? "Manage trash pickup requests across all sectors"
              : "Submit and track your trash pickup requests"}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2  delay-100">
            {userRole === "ROLE_ADMIN" ? (
              <AdminStats />
            ) : (
              <TrashRequestForm onSuccess={fetchRequests} />
            )}
          </div>
          <div className="lg:col-span-3  delay-200">
            <RequestList requests={requests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashRequestPage;
