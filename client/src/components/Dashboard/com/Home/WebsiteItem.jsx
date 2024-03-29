import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const WebsiteItem = ({ website }) => {
  let navigate = useNavigate();
  const selectedWebsite = useSelector((state) => state.website.selectedWebsite); // Fetch the selected website from Redux store

  const navigateToDetail = () => {
    navigate(`/dashboard/website/${website.appId}`);
  };

  return (
    <div
      onClick={navigateToDetail}
      key={website.id}
      className={`cursor-pointer flex items-center justify-between p-4 rounded-lg border transition duration-300 ease-in-out ${
        // Specific design for selected website
        "hover:bg-gray-100 border-gray-300 text-gray-700"
      }`}
    >
      <span className="font-medium">{website.name}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
      {website.id === selectedWebsite && ( // Optional: Add a checkmark or another icon for the selected website
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
  );
};
export default WebsiteItem;
