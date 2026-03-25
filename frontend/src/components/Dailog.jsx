/* eslint-disable react/prop-types */
import { Check, AlertTriangle, X, Info } from "lucide-react";

const Dialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "confirm",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  const icons = {
    confirm: (
      <div className="w-12 h-12 rounded-2xl bg-orange-500/15 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-blue-600" />
      </div>
    ),
    success: (
      <div className="w-12 h-12 rounded-2xl bg-green-500/15 flex items-center justify-center">
        <Check className="w-6 h-6 text-green-400" />
      </div>
    ),
    error: (
      <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center">
        <X className="w-6 h-6 text-red-600" />
      </div>
    ),
    info: (
      <div className="w-12 h-12 rounded-2xl bg-teal-500/15 flex items-center justify-center">
        <Info className="w-6 h-6 text-green-600" />
      </div>
    ),
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 ">
      <div className="bg-white border border-gray-300 rounded shadow p-6 rounded-2xl p-6 max-w-md w-full  shadow-2xl">
        <div className="flex items-start gap-4 mb-4">
          {icons[type]}
          <div>
            <h3 className="text-lg font-semibold text-black">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={type === "confirm" ? onConfirm : onClose}
            className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
