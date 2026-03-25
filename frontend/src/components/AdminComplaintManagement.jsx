import { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, FileText, CheckCircle, Package, MapPin, Clock } from "lucide-react";

const getStatusBadge = (status) => {
  switch (status) {
    case "SUBMITTED": return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium border border-gray-200">Submitted</span>;
    case "ASSIGNED": return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">Assigned</span>;
    case "IN_PROGRESS": return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">In Progress</span>;
    case "RESOLVED": return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">Resolved</span>;
    case "CLOSED": return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200">Closed</span>;
    default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium border border-gray-200">{status}</span>;
  }
};

const AdminComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cmpRes = await axios.get("http://localhost:8080/api/complaints");
      setComplaints(cmpRes.data);

      const userRes = await axios.get("http://localhost:8080/api/admin/users");
      // Ensure backend returns officers or we just filter by role assuming the DTO includes it
      const officerList = userRes.data.filter(u => u.role === "ROLE_OFFICER" || u.role === "OFFICER");
      setOfficers(officerList);
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchHistory = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/complaints/${id}/history`);
      setHistory(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRowClick = (complaint) => {
    setSelectedComplaint(complaint);
    fetchHistory(complaint.id);
    setSelectedOfficer(complaint.assignedOfficerId || "");
  };

  const handleAssign = async () => {
    if (!selectedOfficer) return;
    setAssigning(true);
    try {
      await axios.put(`http://localhost:8080/api/complaints/${selectedComplaint.id}/assign/${selectedOfficer}`);
      setMessage({ type: "success", text: "Officer assigned successfully!" });
      
      // Refresh local state without full reload
      const updatedComplaint = { 
        ...selectedComplaint, 
        assignedOfficerId: selectedOfficer, 
        assignedOfficerName: officers.find(o => o.id.toString() === selectedOfficer.toString())?.name,
        status: "ASSIGNED" 
      };
      
      setSelectedComplaint(updatedComplaint);
      setComplaints(complaints.map(c => c.id === selectedComplaint.id ? updatedComplaint : c));
      fetchHistory(selectedComplaint.id);

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to assign officer." });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading complaints...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> All Complaints
          </h3>
        </div>
        
        {complaints.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Package className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No complaints found in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white text-gray-800 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Citizen</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Officer</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleRowClick(c)}>
                    <td className="px-6 py-4 text-xs font-mono text-gray-400">#{c.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{c.title}</td>
                    <td className="px-6 py-4">{c.citizenName}</td>
                    <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                    <td className="px-6 py-4">{c.assignedOfficerName || <span className="text-gray-400 italic">Unassigned</span>}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedComplaint && (
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">{selectedComplaint.title}</h3>
                {getStatusBadge(selectedComplaint.status)}
              </div>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Location: {selectedComplaint.latitude?.toFixed(4)}, {selectedComplaint.longitude?.toFixed(4)}
              </p>
            </div>
            <button onClick={() => setSelectedComplaint(null)} className="text-gray-400 hover:text-gray-600 p-2 text-xl">
              &times;
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {selectedComplaint.description}
                </p>
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">Assignment</h4>
                {message && (
                  <div className={`p-2 text-sm rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message.text}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <select 
                    title="Select Officer"
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedOfficer || ""}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                  >
                    <option value="">Select an Officer...</option>
                    {officers.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleAssign}
                    disabled={assigning || !selectedOfficer}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {assigning ? "Assigning..." : "Assign"}
                  </button>
                </div>
              </div>

              {selectedComplaint.imageUrl && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Attachment</h4>
                  <img src={`http://localhost:8080${selectedComplaint.imageUrl}`} alt="Complaint Image" className="w-full max-w-sm rounded-xl border border-gray-200 shadow-sm" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Tracking History</h4>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200">
                {history.map((h, i) => (
                  <div key={h.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-4 border-blue-100 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-gray-900 text-sm">{h.status}</div>
                        <time className="text-[10px] font-medium text-blue-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(h.timestamp).toLocaleDateString()}
                        </time>
                      </div>
                      <div className="text-xs text-gray-600">{h.remarks}</div>
                      <div className="text-[10px] text-gray-400 mt-2">By: {h.updatedByName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintManagement;
