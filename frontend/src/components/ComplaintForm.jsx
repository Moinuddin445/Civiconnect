import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { AlertCircle, MapPin, Upload } from "lucide-react";

// Fix Leaflet's default icon path issues
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationSelector = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
};

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "ROADS",
  });
  const [position, setPosition] = useState(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage({ text: "Please log in to submit a complaint.", type: "error" });
      return;
    }
    
    if (!position) {
      setMessage({ text: "Please select a location on the map.", type: "error" });
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append("citizenId", userId);
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("category", formData.category);
    submitData.append("latitude", position.lat);
    submitData.append("longitude", position.lng);
    
    if (image) {
      submitData.append("image", image);
    }

    try {
      const response = await axios.post("http://localhost:8080/api/complaints/submit", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ text: response.data.message || "Complaint submitted successfully!", type: "success" });
      setFormData({ title: "", description: "", category: "ROADS" });
      setPosition(null);
      setImage(null);
      
      // Reset after 3 seconds
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to submit complaint.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const defaultCenter = [28.6139, 77.2090]; // Default: New Delhi, India

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Report an Issue</h2>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="E.g., Deep pothole on Main St"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ROADS">Roads & Transport</option>
                <option value="WATER">Water Supply</option>
                <option value="ELECTRICITY">Electricity</option>
                <option value="SANITATION">Sanitation & Garbage</option>
                <option value="OTHER">Other Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Provide detailed information about the issue..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label 
                  htmlFor="imageUpload"
                  className="flex items-center gap-2 cursor-pointer w-full px-4 py-2 bg-gray-50 border border-gray-200 border-dashed rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  {image ? image.name : "Click to select a photo"}
                </label>
              </div>
            </div>
          </div>

          <div className="h-[400px] border border-gray-200 rounded-lg overflow-hidden relative">
            <div className="absolute top-4 left-0 right-0 z-[1000] px-4 pointer-events-none text-center">
              <span className="inline-block bg-white/90 px-3 py-1 rounded-full text-sm font-medium shadow text-gray-800">
                <MapPin className="w-4 h-4 inline-block mr-1 text-blue-600" />
                Click on the map to mark location
              </span>
            </div>
            <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationSelector position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 w-full md:w-auto"
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
