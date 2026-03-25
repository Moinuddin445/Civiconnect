import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Homepage from "./pages/Homepage";
import { UserDashBoard } from "./pages/UserDashboard";
import { AdminDashBoard } from "./pages/AdminDashboard";
import { UpdateProfile } from "./pages/UpdateProfile";
import TrashRequestPage from "./pages/TrashRequestPage";
import OfficerDashboard from "./pages/OfficerDashboard";
import RoleBasedRoute from "./components/RoleBasedRoute";

import ForgotPassword from "./components/ForgotPassword";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/user"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_CITIZEN"]}>
                <UserDashBoard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_ADMIN"]}>
                <AdminDashBoard />
              </RoleBasedRoute>
            }
          />
          <Route path="/updateProfile" element={<UpdateProfile />} />
          <Route path="/trash" element={<TrashRequestPage />} />
          <Route
            path="/officer/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["ROLE_OFFICER"]}>
                <OfficerDashboard />
              </RoleBasedRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
