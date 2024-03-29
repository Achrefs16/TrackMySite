import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { MdContentCopy } from "react-icons/md";
const WebsiteDetail = () => {
  let { id } = useParams();
  let navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

  const [website, setWebsite] = useState({ name: "", url: "", category: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch website details
  useEffect(() => {
    const fetchWebsiteById = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/website/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWebsite(response.data.website[0]);
      } catch (error) {
        console.error("Error fetching website:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchWebsiteById();
  }, [id, token]);

  const handleUpdateWebsite = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/upwebsite/${id}`, website, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      // Optionally, refetch website details or navigate away
    } catch (error) {
      console.error("Error updating website:", error);
    }
  };

  const handleDeleteWebsite = async () => {
    try {
      await axios.delete(`/website/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard/home"); // Redirect to the dashboard or a relevant page
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  };
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(website.appId)
      .then(() => setCopySuccess("Copied!"))
      .catch((err) => console.log("Error in copying text: ", err));
  };
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        Loading website details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8 overflow-y-auto">
      {isEditing ? (
        <form
          onSubmit={handleUpdateWebsite}
          className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6 space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            Edit Website Details
          </h3>

          <div className="space-y-1">
            <label
              htmlFor="websiteName"
              className="block text-sm font-medium text-gray-700"
            >
              Website Name
            </label>
            <input
              id="websiteName"
              type="text"
              value={website.name}
              onChange={(e) => setWebsite({ ...website, name: e.target.value })}
              className="block w-full mt-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              placeholder="Your website's name here"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="websiteUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Website URL
            </label>
            <input
              id="websiteUrl"
              type="url"
              value={website.url}
              onChange={(e) => setWebsite({ ...website, url: e.target.value })}
              className="block w-full mt-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              placeholder="https://www.yourwebsite.com"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="websiteCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              id="websiteCategory"
              type="text"
              value={website.category}
              onChange={(e) =>
                setWebsite({ ...website, category: e.target.value })
              }
              className="block w-full mt-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              placeholder="E.g., Blog, E-commerce, Portfolio"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Website Details
          </h3>

          <p className="mb-2">
            <span className="font-medium text-gray-700">Website Name:</span>{" "}
            {website.name}
          </p>
          <p className="mb-2">
            <span className="font-medium text-gray-700">Website URL:</span>
            <a
              href={website.url}
              className="text-indigo-500 hover:underline"
            >
              {website.url}
            </a>
          </p>
          <p className="mb-4">
            <span className="font-medium text-gray-700">Category:</span>{" "}
            {website.category}
          </p>

          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg font-medium">App ID:</span>
            <span className="font-mono text-sm bg-gray-200 p-2 rounded">
              {website.appId}
            </span>
            <button
              onClick={copyToClipboard}
              className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
            >
              Copy ID
            </button>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteWebsite}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default WebsiteDetail;
