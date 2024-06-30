import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AddwsModal = ({ isOpen, onClose, getWebsites, close }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [websiteId, setWebsiteId] = useState("");
  const token = useSelector((state) => state.user.token);

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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (token) {
      try {
        const response = await axios.post(
          "/addwebsite",
          { name, url, category },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWebsiteId(response.data.appId);
        setSubmissionSuccess(true);
        getWebsites();
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error posting data:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.error("No token found, please login.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full">
      <motion.div
        initial={{ x: 500 }}
        whileInView={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="relative float-right p-5 border w-2/4 h-full shadow-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium text-gray-900">
            {submissionSuccess
              ? "Site web ajouté avec succès"
              : "Ajouter votre site web"}
          </h4>
          <button
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div className="mt-2">
          {!submissionSuccess ? (
            <form
              className="space-y-6 p-10"
              onSubmit={handleSubmit}
              method="POST"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-500"
                >
                  Nom du site web
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                    placeholder="Enter website name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium leading-6 text-gray-500"
                >
                  URL du site web
                </label>
                <div className="mt-2">
                  <input
                    id="url"
                    name="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-500"
                >
                  Catégorie de site web
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                  >
                    <option value="">Select category</option>
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
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="text-white bg-brand px-5 py-2 rounded-md text-lg font-semibold shadow-xl focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
                >
                  Sauvegarder les informations
                </button>
              </div>
            </form>
          ) : (
            <div className="p-10">
              <p className="text-lg font-medium text-gray-900">
                Site Web ajouté avec succès !
              </p>
              <p>
                L'identifiant de votre site web :{" "}
                <span className="font-bold">{websiteId}</span>
              </p>

              <Link
                to={"/dashboard/documentation/installation"}
                onClick={close}
              >
                <button
                  onClick={() => {
                    // Reset the form and close modal or allow for another action
                    setSubmissionSuccess(false);
                    setName("");
                    setUrl("");
                    setCategory("");
                    onClose();
                  }}
                  className="mt-4 text-white mr-4 bg-brand px-5 py-2 rounded-md text-lg font-semibold shadow-xl focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
                >
                  Acceder Au Guide D'installation
                </button>
              </Link>
              <button
                onClick={() => {
                  // Reset the form and close modal or allow for another action
                  setSubmissionSuccess(false);
                  setName("");
                  setUrl("");
                  setCategory("");
                  onClose(); // or any other action
                }}
                className="mt-4 text-white bg-brand px-5 py-2 rounded-md text-lg font-semibold shadow-xl focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddwsModal;
