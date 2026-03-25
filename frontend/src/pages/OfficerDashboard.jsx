import NavBar from "../components/Navbar";
import OfficerComplaintManagement from "../components/OfficerComplaintManagement";

export const OfficerDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 ">
          <h2 className="text-2xl font-bold text-black mb-2">Officer Portal</h2>
          <p className="text-gray-600 text-sm">Review, process, and resolve community complaints</p>
        </div>

        <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-6 delay-100">
            <OfficerComplaintManagement />
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
