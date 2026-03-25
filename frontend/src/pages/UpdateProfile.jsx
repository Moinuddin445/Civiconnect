import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, MapPin, Save } from "lucide-react";
import Dialog from "../components/Dailog";
import NavBar from "../components/Navbar";

export const UpdateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [includeAddress, setIncludeAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: { street: "", city: "", state: "", sector: "" },
  });
  const [sectors, setSectors] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");

        const userResponse = await axios.get(
          `http://localhost:8080/api/${role === "ROLE_ADMIN" ? "admin" : "citizen"}/profile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sectorsResponse = await axios.get(
          `http://localhost:8080/api/${role === "ROLE_ADMIN" ? "admin" : "citizen"}/sectors`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFormData({
          name: userResponse.data.name || "",
          email: userResponse.data.email || "",
          address: userResponse.data.address || { street: "", city: "", state: "", sector: "" },
        });
        setIncludeAddress(!!userResponse.data.address);
        setSectors(sectorsResponse.data.map((sector) => sector.sectorName));
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const updateData = {
        name: formData.name,
        email: formData.email,
        address: includeAddress ? formData.address : null,
      };

      const response = await axios.put(
        `http://localhost:8080/api/${role === "ROLE_ADMIN" ? "admin" : "citizen"}/profile/${userId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setShowSuccessDialog(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen min-h-screen">
      <NavBar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8 ">
          <h2 className="text-2xl font-bold text-black mb-2">Update Profile</h2>
          <p className="text-gray-600 text-sm">Manage your account information</p>
        </div>

        <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-8  delay-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-text flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-bg-white border border-gray-200 rounded"
                required
              />
            </div>

            <div>
              <label className="label-text flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-bg-white border border-gray-200 rounded"
                required
              />
            </div>

            {/* Address Section */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border transition-all duration-300 flex items-center justify-center ${
                  includeAddress
                    ? "bg-orange-500 border-orange-500"
                    : "border-white/20 group-hover:border-white/40"
                }`}>
                  {includeAddress && <span className="text-black text-xs">✓</span>}
                </div>
                <input
                  type="checkbox"
                  checked={includeAddress}
                  onChange={(e) => setIncludeAddress(e.target.checked)}
                  className="hidden"
                />
                <span className="text-sm text-gray-700 font-medium">
                  Update Address Information
                </span>
              </label>

              {includeAddress && (
                <div className="mt-5 space-y-4 ">
                  <div>
                    <label className="label-text flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      Street
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="input-bg-white border border-gray-200 rounded"
                      required={includeAddress}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-text">City</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="input-bg-white border border-gray-200 rounded"
                        required={includeAddress}
                      />
                    </div>
                    <div>
                      <label className="label-text">State</label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="input-bg-white border border-gray-200 rounded"
                        required={includeAddress}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Sector</label>
                    <select
                      name="address.sector"
                      value={formData.address.sector}
                      onChange={handleChange}
                      className="input-bg-white border border-gray-200 rounded"
                      required={includeAddress}
                    >
                      <option value="">Select Sector</option>
                      {sectors.map((sectorName) => (
                        <option key={sectorName} value={sectorName}>
                          {sectorName.replace("SECTOR", "Sector ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center gap-2 py-3 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Profile
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <Dialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          const role = localStorage.getItem("role");
          navigate(role === "ROLE_ADMIN" ? "/admin" : "/user");
        }}
        title="Profile Updated"
        message="Your profile has been successfully updated!"
        type="success"
        confirmText="OK"
      />
    </div>
  );
};

export default UpdateProfile;
