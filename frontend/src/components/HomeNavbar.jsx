import { Link } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";

const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border border-gray-200 rounded">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500 from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow group-hover:shadow transition-all duration-300">
              <Users className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-black tracking-tight">
              Civic<span className="text-blue-600 font-bold">Connect</span>
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              to="/signin"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 from-blue-500 to-blue-600 text-black text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
