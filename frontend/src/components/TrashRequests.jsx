// src/components/admin/TrashRequests.jsx
import { useState, useEffect } from "react";
import { CalendarRange, Check, X, Trash2, Loader, MapPin, User } from "lucide-react";
import axios from "axios";

const TrashRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ fetch: null, updates: {} });
  const [pendingDates, setPendingDates] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
      setLoading(false);
      setErrors((prev) => ({ ...prev, fetch: null }));
    } catch (error) {
      console.log(error);
      setErrors((prev) => ({ ...prev, fetch: "Failed to fetch requests" }));
      setLoading(false);
    }
  };

  const handleDateSelection = (requestId, date) => {
    setPendingDates((prev) => ({ ...prev, [requestId]: date }));
  };

  const handleServiceDateUpdate = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/requests/${requestId}`,
        { serviceDate: pendingDates[requestId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingDates((prev) => {
        const newPending = { ...prev };
        delete newPending[requestId];
        return newPending;
      });
      setErrors((prev) => ({
        ...prev,
        updates: { ...prev.updates, [requestId]: null },
      }));
      fetchRequests();
    } catch (error) {
      console.error("Failed to update service date:", error);
      setErrors((prev) => ({
        ...prev,
        updates: { ...prev.updates, [requestId]: "Failed to update" },
      }));
    }
  };

  const cancelDateUpdate = (requestId) => {
    setPendingDates((prev) => {
      const newPending = { ...prev };
      delete newPending[requestId];
      return newPending;
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 text-blue-600 animate-spin" />
        <span className="ml-3 text-gray-600 text-sm">Loading requests...</span>
      </div>
    );

  if (errors.fetch)
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-sm">{errors.fetch}</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-black mb-6 flex items-center gap-2">
        <Trash2 className="w-5 h-5 text-blue-600" />
        Trash Pickup Requests
      </h2>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <Trash2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-gray-600">No requests found</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {requests.map((request) => (
            <div key={request.id} className="bg-white border border-gray-300 rounded shadow p-6 rounded-xl p-5">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      request.serviceDate ? "bg-green-500/15" : "bg-orange-500/15"
                    }`}>
                      <Trash2 className={`w-4 h-4 ${
                        request.serviceDate ? "text-green-400" : "text-blue-600"
                      }`} />
                    </div>
                    <div>
                      <p className="text-black font-medium">{request.description}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {request.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {request.sector}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarRange className="w-3 h-3" />{" "}
                          Req: {new Date(request.requestDate).toLocaleDateString()}
                        </span>
                        <span className={`flex items-center gap-1 ${request.serviceDate ? "text-green-400" : "text-blue-600/70"}`}>
                          <CalendarRange className="w-3 h-3" />{" "}
                          {request.serviceDate
                            ? `Service: ${new Date(request.serviceDate).toLocaleDateString()}`
                            : "Not scheduled"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="date"
                    className="input-bg-white border border-gray-200 rounded py-1.5 px-3 text-sm w-40"
                    min={new Date().toISOString().split("T")[0]}
                    value={pendingDates[request.id] || ""}
                    onChange={(e) =>
                      handleDateSelection(request.id, e.target.value)
                    }
                  />
                  {pendingDates[request.id] && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleServiceDateUpdate(request.id)}
                        className="p-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors"
                        title="Confirm"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => cancelDateUpdate(request.id)}
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {errors.updates[request.id] && (
                <p className="text-red-600 text-xs mt-2">{errors.updates[request.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashRequests;
