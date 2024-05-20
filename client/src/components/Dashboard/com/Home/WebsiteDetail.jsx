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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const categories = [
    "Blog",
    "E-commerce",
    "Portfolio",
    "Corporate",
    "Réseaux sociaux",
    "Gouvernement",
    "Voyages",
    "Emploi",
    "Other",
  ];

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
            Modifier les détails du site Web
          </h3>

          <div className="space-y-1">
            <label
              htmlFor="websiteName"
              className="block text-sm font-medium text-gray-700"
            >
              Nom du site Web
            </label>
            <input
              id="websiteName"
              type="text"
              value={website.name}
              onChange={(e) => setWebsite({ ...website, name: e.target.value })}
              className="block w-full py-1 px-2 mt-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              placeholder="Nom de votre site Web"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="websiteUrl"
              className="block text-sm font-medium text-gray-700"
            >
              URL du site Web
            </label>
            <input
              id="websiteUrl"
              type="url"
              value={website.url}
              onChange={(e) => setWebsite({ ...website, url: e.target.value })}
              className="block w-full mt-1 border py-1 px-2 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              placeholder="https://www.votresite.com"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="websiteCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Catégorie
            </label>
            <select
              id="websiteCategory"
              value={website.category}
              onChange={(e) =>
                setWebsite({ ...website, category: e.target.value })
              }
              className="block w-full mt-1 py-1 px-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Enregistrer les modifications
            </button>
            <button
              type="button"
              className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="website-details bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            Détails du site Web
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="font-medium text-gray-700">
                Nom du site Web :
              </span>
              <span className="ml-2 text-lg text-gray-900">{website.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">
                URL du site Web :
              </span>
              <a
                href={website.url}
                className="ml-2 text-lg text-indigo-500 hover:underline"
              >
                {website.url}
              </a>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Catégorie :</span>
              <span className="ml-2 text-lg text-gray-900">
                {website.category}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">
                ID du site Web :
              </span>
              <div className="flex items-center">
                <span className="text-lg font-mono bg-gray-200 px-3 py-1 rounded-md">
                  {website.appId}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 px-4 py-2 text-lg font-medium text-white bg-indigo-500 rounded hover:bg-indigo-600"
                >
                  Copier l'ID
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Modifier
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 text-lg font-medium text-white bg-red-500 rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-4">
              Confirmer la suppression
            </h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer ce site web ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteWebsite}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteDetail;
