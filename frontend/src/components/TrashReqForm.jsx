/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ScrollText, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "./Dailog";

const TrashRequestForm = ({ onSuccess }) => {
  const [description, setDescription] = useState("");
  const [isRegularRequest, setIsRegularRequest] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (isRegularRequest) {
      setDescription("Regular pickup");
    } else {
      setDescription("");
    }
  }, [isRegularRequest]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const confirmSubmit = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/requests",
        { description, userId: parseInt(userId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setDescription("");
        setIsDialogOpen(false);
        setShowSuccessDialog(true);
        setError("");
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error submitting request");
      console.error("Error submitting request:", error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500 from-blue-500/20 to-blue-600/20 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-black">
            New Trash-Pickup Request
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-text">Request Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsRegularRequest(true)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isRegularRequest
                    ? "bg-blue-600 from-blue-500 to-blue-600 text-black shadow-lg shadow"
                    : "bg-white border border-gray-200 rounded text-gray-600 hover:text-black hover:border-white/20"
                }`}
              >
                Regular Pickup
              </button>
              <button
                type="button"
                onClick={() => setIsRegularRequest(false)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  !isRegularRequest
                    ? "bg-blue-600 from-blue-500 to-blue-600 text-black shadow-lg shadow"
                    : "bg-white border border-gray-200 rounded text-gray-600 hover:text-black hover:border-white/20"
                }`}
              >
                Extra Request
              </button>
            </div>
          </div>

          {!isRegularRequest && (
            <div>
              <label className="label-text">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-bg-white border border-gray-200 rounded min-h-[120px]"
                placeholder="Tell us about this pickup request..."
                required
              />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-100 border border-red-300">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 w-full flex items-center justify-center gap-2 py-3"
          >
            <ScrollText className="w-4 h-4" />
            Submit Request
          </button>
        </form>
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={confirmSubmit}
        title="Confirm Request"
        message="Are you sure you want to submit this trash pickup request?"
        type="confirm"
      />

      <Dialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Request Submitted"
        message="Your trash pickup request has been successfully submitted!"
        type="success"
        confirmText="OK"
      />
    </>
  );
};

export default TrashRequestForm;
