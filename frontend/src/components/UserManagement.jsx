// src/components/admin/UserManagement.jsx
import { useState, useEffect } from "react";
import { Users, UserCog, MapPin, Loader, Trash2 } from "lucide-react";
import axios from "axios";
import Dialog from "./Dailog";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    userId: null,
    userName: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/admin/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  const initiateDelete = (userId, userName) => {
    setDeleteDialog({ isOpen: true, userId, userName });
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/admin/users/${deleteDialog.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeleteDialog({ isOpen: false, userId: null, userName: "" });
      fetchUsers();
    } catch (error) {
      console.log(error);
      setError("Failed to delete user");
    }
  };

  const renderUserCard = (user) => (
    <div
      key={user.id}
      className="bg-white border border-gray-300 rounded shadow p-6 rounded-xl p-4 flex justify-between items-start"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          user.role === "ROLE_ADMIN" ? "bg-orange-500/15" : "bg-teal-500/15"
        }`}>
          <Users className={`w-5 h-5 ${
            user.role === "ROLE_ADMIN" ? "text-blue-600" : "text-green-600"
          }`} />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-black">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-3 h-3 text-gray-500" />
            {user.address ? (
              <span className="text-gray-600">
                {user.address.sector?.sectorName} · {user.address.city}, {user.address.state}
              </span>
            ) : (
              <span className="text-blue-600/70">No address registered</span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => initiateDelete(user.id, user.name)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-100 border border-red-500/15 hover:bg-red-500/20 transition-all duration-200"
      >
        <Trash2 className="w-3 h-3" />
        Remove
      </button>
    </div>
  );

  const adminUsers = users.filter((user) => user.role === "ROLE_ADMIN");
  const citizenUsers = users.filter((user) => user.role === "ROLE_CITIZEN");

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 text-blue-600 animate-spin" />
        <span className="ml-3 text-gray-600 text-sm">Loading users...</span>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-black flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" />
        User Management
      </h2>

      {/* Admins Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
          <UserCog className="w-4 h-4" />
          <h3>Administrators ({adminUsers.length})</h3>
        </div>
        <div className="grid gap-3 max-w-3xl mx-auto">
          {adminUsers.length === 0 ? (
            <p className="text-gray-500 text-sm">No administrators found</p>
          ) : (
            adminUsers.map(renderUserCard)
          )}
        </div>
      </div>

      <div className="glow-line"></div>

      {/* Officers Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
          <UserCog className="w-4 h-4" />
          <h3>Officers ({users.filter(u => u.role === "ROLE_OFFICER").length})</h3>
        </div>
        <div className="grid gap-3 max-w-3xl mx-auto">
          {users.filter(u => u.role === "ROLE_OFFICER").length === 0 ? (
            <p className="text-gray-500 text-sm">No officers found</p>
          ) : (
            users.filter(u => u.role === "ROLE_OFFICER").map(renderUserCard)
          )}
        </div>
      </div>

      <div className="glow-line"></div>

      {/* Citizens Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-green-600 mb-2">
          <Users className="w-4 h-4" />
          <h3>Citizens ({citizenUsers.length})</h3>
        </div>
        <div className="grid gap-3 max-w-3xl mx-auto">
          {citizenUsers.length === 0 ? (
            <p className="text-gray-500 text-sm">No citizens found</p>
          ) : (
            citizenUsers.map(renderUserCard)
          )}
        </div>
      </div>

      <Dialog
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({ isOpen: false, userId: null, userName: "" })
        }
        onConfirm={handleDeleteUser}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${deleteDialog.userName}? This action cannot be undone.`}
        type="confirm"
        confirmText="Delete"
      />
    </div>
  );
};

export default UserManagement;
