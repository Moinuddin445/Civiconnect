/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Filter, ClipboardList } from "lucide-react";
import TrashReqCard from "../cards/TrashReqCard";

const RequestList = ({ requests }) => {
  const [selectedSector, setSelectedSector] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState(requests);

  const sectors = ["all", ...new Set(requests.map((req) => req.sector))];

  useEffect(() => {
    if (selectedSector === "all") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(
        requests.filter((req) => req.sector === selectedSector)
      );
    }
  }, [selectedSector, requests]);

  return (
    <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-black flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-blue-600" />
          Pickup Requests
        </h2>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded rounded-lg px-3 py-1.5">
          <Filter className="w-4 h-4 text-gray-600" />
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector} className="bg-gray-200">
                {sector === "all" ? "All Sectors" : sector}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">No requests found in this sector.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <TrashReqCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestList;
