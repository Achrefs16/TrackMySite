// NotificationModal.js
import React from "react";

const NotificationModal = ({
  isOpen,
  onClose,
  notifications,
  onUpdateNotifications,
}) => {
  // Invoke onUpdateNotifications when the modal is about to be closed
  const handleClose = () => {
    if (isOpen && onUpdateNotifications) {
      onUpdateNotifications();
    }
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      onClick={handleClose}
    >
      <div
        className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg text-center font-semibold">Notifications</h3>
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 p-4"
        >
          ✖
        </button>
        <ul className="max-h-96 overflow-y-scroll">
          {notifications.map((notification, index) => (
            <li
              key={index}
              className={`border-b border-gray-200 p-2 flex `}
            >
              {notification.message}
              {notification.status === "new" ? (
                <p className="bg-sunny rounded text-white  text-xs px-2 py-1 h-fit">
                  New
                </p>
              ) : (
                ""
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationModal;
