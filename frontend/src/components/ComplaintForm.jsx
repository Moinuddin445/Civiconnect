import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { AlertCircle, MapPin, Camera, Shield, ShieldCheck, ShieldAlert, Loader2, Navigation } from "lucide-react";

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

// Custom icon for device location (blue pulsing dot)
const deviceIcon = L.divIcon({
  className: "device-location-marker",
  html: `<div style="
    width: 16px; height: 16px;
    background: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Maximum allowed distance (meters) between device GPS and map pin
const MAX_RADIUS_METERS = 500;

/**
 * Calculate distance between two GPS coordinates using Haversine formula.
 * @returns distance in meters
 */
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Component to recenter the map when the device location is acquired.
 */
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16, { animate: true });
    }
  }, [center, map]);
  return null;
};

/**
 * Component to handle map click events with radius restriction.
 */
const LocationSelector = ({ position, setPosition, devicePosition, setRadiusError }) => {
  useMapEvents({
    click(e) {
      if (!devicePosition) {
        setRadiusError("Please wait for GPS to lock before selecting a location.");
        return;
      }
      const distance = haversineDistance(
        devicePosition.lat, devicePosition.lng,
        e.latlng.lat, e.latlng.lng
      );
      if (distance > MAX_RADIUS_METERS) {
        setRadiusError(`Location is ${Math.round(distance)}m away. You can only pin within ${MAX_RADIUS_METERS}m of your current location.`);
        setTimeout(() => setRadiusError(null), 4000);
        return;
      }
      setRadiusError(null);
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
  const [position, setPosition] = useState(null); // Map pin position
  const [devicePosition, setDevicePosition] = useState(null); // Real device GPS
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(true);
  const [gpsError, setGpsError] = useState(null);
  const [radiusError, setRadiusError] = useState(null);
  const fileInputRef = useRef(null);

  // Auto-detect GPS on component mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDevicePosition({ lat: latitude, lng: longitude });
        setPosition({ lat: latitude, lng: longitude }); // Auto-set pin to device location
        setGpsLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGpsError("Location access denied. Please enable GPS permissions in your browser settings to submit complaints.");
            break;
          case err.POSITION_UNAVAILABLE:
            setGpsError("Location information is unavailable. Please try again.");
            break;
          case err.TIMEOUT:
            setGpsError("GPS request timed out. Please refresh and try again.");
            break;
          default:
            setGpsError("Could not determine your location.");
        }
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage({ text: "Please log in to submit a complaint.", type: "error" });
      return;
    }
    
    if (!devicePosition) {
      setMessage({ text: "GPS location is required. Please enable location access.", type: "error" });
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
    submitData.append("deviceLatitude", devicePosition.lat);
    submitData.append("deviceLongitude", devicePosition.lng);
    
    if (image) {
      submitData.append("image", image);
    }

    try {
      const response = await axios.post("http://localhost:8080/api/complaints/submit", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ text: response.data.message || "Complaint submitted successfully!", type: "success" });
      setFormData({ title: "", description: "", category: "ROADS" });
      setPosition({ lat: devicePosition.lat, lng: devicePosition.lng }); // Reset pin to device location
      removeImage();
      
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to submit complaint.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const defaultCenter = devicePosition
    ? [devicePosition.lat, devicePosition.lng]
    : [28.6139, 77.2090]; // Fallback: New Delhi

  // GPS Loading State
  if (gpsLoading) {
    return (
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 md:p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
            <Navigation className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Acquiring GPS Location...</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Please allow location access when prompted. This ensures your complaint is geo-verified for authenticity.
          </p>
          <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
            <Loader2 className="w-4 h-4 animate-spin" />
            Waiting for GPS signal...
          </div>
        </div>
      </div>
    );
  }

  // GPS Error State
  if (gpsError) {
    return (
      <div className="bg-white rounded-2xl shadow border border-red-100 p-8 md:p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">GPS Access Required</h3>
          <p className="text-sm text-gray-600 max-w-md">{gpsError}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md">
            <p className="text-xs text-amber-800">
              <strong>Why is GPS required?</strong> To prevent fake complaints, we verify that you are physically present 
              at the location you report. Your GPS data is only used for verification purposes.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Report an Issue</h2>
        </div>
        {/* GPS Verified Badge */}
        {devicePosition && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">GPS Verified</span>
          </div>
        )}
      </div>

      {/* Verification Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">Geo-Verified Submission</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Your location is being verified automatically. Photos taken with your camera will be cross-checked 
              against your GPS for authenticity. You can only report issues within {MAX_RADIUS_METERS}m of your current position.
            </p>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg flex items-start gap-2 ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {message.type === "error" ? <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" /> : <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" />}
          <span className="text-sm">{message.text}</span>
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

            {/* Camera-only Photo Capture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📸 Take a Photo
                <span className="text-xs font-normal text-gray-400 ml-1">(camera only for verification)</span>
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                {!imagePreview ? (
                  <label 
                    htmlFor="imageUpload"
                    className="flex items-center justify-center gap-3 cursor-pointer w-full px-4 py-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 border-dashed rounded-xl text-gray-500 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
                  >
                    <Camera className="w-6 h-6 text-blue-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700">Open Camera & Take Photo</p>
                      <p className="text-xs text-gray-400">Photo GPS metadata will be verified</p>
                    </div>
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                      {image?.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map with Radius Restriction */}
          <div className="space-y-2">
            <div className="h-[420px] border border-gray-200 rounded-xl overflow-hidden relative">
              {/* Map Header Overlay */}
              <div className="absolute top-3 left-0 right-0 z-[1000] px-4 pointer-events-none text-center">
                <span className="inline-flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg text-gray-800 backdrop-blur-sm">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Click within the blue circle to mark location
                </span>
              </div>

              {/* Radius Error Toast */}
              {radiusError && (
                <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none">
                  <div className="bg-red-500 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg text-center animate-bounce">
                    ⚠️ {radiusError}
                  </div>
                </div>
              )}

              <MapContainer center={defaultCenter} zoom={16} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapRecenter center={devicePosition ? [devicePosition.lat, devicePosition.lng] : null} />
                
                {/* Device location marker (blue dot) */}
                {devicePosition && (
                  <Marker position={[devicePosition.lat, devicePosition.lng]} icon={deviceIcon} />
                )}

                {/* 500m radius circle */}
                {devicePosition && (
                  <Circle
                    center={[devicePosition.lat, devicePosition.lng]}
                    radius={MAX_RADIUS_METERS}
                    pathOptions={{
                      color: "#3b82f6",
                      fillColor: "#3b82f6",
                      fillOpacity: 0.08,
                      weight: 2,
                      dashArray: "8 4",
                    }}
                  />
                )}

                {/* Complaint pin (user-selected) */}
                <LocationSelector 
                  position={position} 
                  setPosition={setPosition} 
                  devicePosition={devicePosition}
                  setRadiusError={setRadiusError}
                />
              </MapContainer>
            </div>

            {/* GPS coordinates display */}
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>
                📍 Device: {devicePosition?.lat.toFixed(5)}, {devicePosition?.lng.toFixed(5)}
              </span>
              {position && (
                <span>
                  🔴 Pin: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            Your location & photo metadata will be verified for authenticity
          </p>
          <button
            type="submit"
            disabled={loading || !devicePosition}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying & Submitting...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Submit Verified Complaint
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;
