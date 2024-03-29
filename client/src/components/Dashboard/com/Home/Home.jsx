import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AddwsModal from "../AddwsModal"; // Import your modal component for adding websites
// Import your Redux action creators
import { setSelectedWebsite } from "../../../../store/websiteSlice";
import WebsiteItem from "./WebsiteItem";
const Homee = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dispatch = useDispatch();
  // Fetch the list of websites from Redux store
  const selectedWebsite = useSelector((state) => state.website.selectedWebsite); // Fetch the selected website from Redux store

  // Function to handle website selection
  const handleSelectWebsite = (website) => {
    dispatch(setSelectedWebsite(website)); // Dispatch action to set selected website
  };

  // Function to close the add website modal
  const handleCloseModal = () => {
    setIsAddOpen(false);
  };
  const token = useSelector((state) => state.user.token);
  const [websites, setWebsites] = useState();

  const [isOpen, setIsOpen] = useState(false);
  const userDetails = useSelector((state) => state.user.details);

  const handleClosePModal = () => setIsOpen(false);
  const [isPOpen, setIsPOpen] = useState(false);
  const getWebsites = async () => {
    if (token) {
      try {
        const response = await axios.get("/websites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWebsites(response.data.websites);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("No token found, please login.");
    }
  };
  useEffect(() => {
    getWebsites();
  }, []);
  return (
    <div className="h-[calc(100%-3rem)] bg-gray-100 p-8 overflow-y-scroll">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Get Started with Your Analytics Dashboard
        </h1>

        <p className="text-lg text-gray-700">
          Welcome to your dashboard! Here's how to get started:
        </p>

        {/* Step-by-step guide */}
        <div className="bg-white shadow rounded-lg p-6 my-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Setup Guide
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Select or add a website to track.</li>
            <li>Copy the provided tracking code snippet.</li>
            <li>
              Paste the snippet into the HTML of your website before the closing{" "}
            </li>{" "}
            tag.
            <li>
              Check back here to see your analytics data start to populate.
            </li>
          </ol>
        </div>

        {/* Website selection and management */}
        <div className="bg-white shadow rounded-lg p-6 my-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Your Websites
          </h2>
          {websites && websites.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {websites.map((website) => (
                <WebsiteItem website={website} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No websites added yet.</p>
          )}
          <button
            onClick={() => setIsAddOpen(true)}
            className="mt-6 inline-flex items-center justify-center w-full md:w-auto bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white transition duration-300 ease-in-out"
          >
            Add New Website
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 -mr-1 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* FAQ or Tips */}
        <div className="bg-white shadow rounded-lg p-6 my-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            FAQs & Tips
          </h2>
          <div className="space-y-4">
            <p>
              <strong>How often is the data updated?</strong> Data is updated in
              real-time, so you'll always have the latest insights at your
              fingertips.
            </p>
            <p>
              <strong>Can I track multiple websites?</strong> Absolutely! You
              can add and manage multiple websites from your dashboard.
            </p>
            {/* Add more FAQs or tips as needed */}
          </div>
        </div>

        <AddwsModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
        />
      </div>
    </div>
  );
};

export default Homee;
