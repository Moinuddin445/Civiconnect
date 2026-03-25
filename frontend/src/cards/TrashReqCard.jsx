/* eslint-disable react/prop-types */
import { CalendarDays, User, MapPin, Trash2 } from "lucide-react";

const TrashReqCard = ({ request }) => {
  const isApproved = !!request.serviceDate;

  return (
    <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-xl p-4 ">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            isApproved 
              ? "bg-green-500/15" 
              : "bg-orange-500/15"
          }`}>
            <Trash2 className={`w-4 h-4 ${isApproved ? "text-green-400" : "text-blue-600"}`} />
          </div>
          <p className="text-black font-medium">{request.description}</p>
        </div>
        <span className={`badge ${isApproved ? "badge-green" : "badge-orange"}`}>
          {isApproved ? "Scheduled" : "Pending"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-3.5 h-3.5 text-gray-500" />
          <span>{request.user}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-gray-500" />
          <span>{request.sector}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarDays className="w-3.5 h-3.5 text-gray-500" />
          <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
        </div>
        {request.serviceDate && (
          <div className="flex items-center gap-2 text-green-400">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Service: {new Date(request.serviceDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashReqCard;
