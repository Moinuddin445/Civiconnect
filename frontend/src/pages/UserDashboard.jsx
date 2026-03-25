import NavBar from "../components/Navbar";
import ComplaintForm from "../components/ComplaintForm";
import ComplaintTracking from "../components/ComplaintTracking";

export const UserDashBoard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-2">Citizen Dashboard</h2>
          <p className="text-gray-600 text-sm">Report issues and track their resolution progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="col-span-1">
            <ComplaintForm />
          </div>
          <div className="col-span-1">
            <ComplaintTracking />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashBoard;
