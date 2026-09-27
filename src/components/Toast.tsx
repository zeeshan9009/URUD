import React from "react";
import type { ToastMessage } from "../types/editor";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" && <CheckCircle2 size={18} className="text-emerald-500" />}
            {toast.type === "error" && <AlertCircle size={18} className="text-rose-500" />}
            {toast.type === "info" && <Info size={18} className="text-blue-500" />}
          </div>
          <div className="toast-message">{toast.message}</div>
          <button
            type="button"
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
