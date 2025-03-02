import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-[#34C759] text-black px-4 py-2 rounded-lg shadow-lg text-xs z-50">
      {message}
    </div>
  );
};

export default Toast;