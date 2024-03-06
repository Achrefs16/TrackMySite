import React, { useState } from "react";
import { motion } from "framer-motion";
import AddwsModal from "./AddwsModal";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedWebsite,
  clearSelectedWebsite,
} from "../../../store/websiteSlice";
const SelectModal = ({ isOpen, onClose, websites, getWebsites }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleCloseModal = () => setIsAddOpen(false);
  const dispatch = useDispatch();
  const selectedWebsite = useSelector((state) => state.website.selectedWebsite);
  const handleSelectWebsite = (website) => {
    dispatch(setSelectedWebsite(website));
    onClose();
  };
  if (!isOpen) return null;
  console.log(selectedWebsite);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 bg-gray-700 bg-opacity-40 z-50 overflow-y-auto h-full w-full"
    >
      <motion.div
        initial={{ scale: 1, y: -40 }}
        whileInView={{ scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative top-16 left-48 p-5 border w-80 shadow-2xl rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium text-slate-800"></h4>
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
          <ul>
            {websites &&
              websites.map((website) => (
                <li
                  key={website.appId}
                  onClick={() => handleSelectWebsite(website)}
                  className={
                    selectedWebsite && website.appId === selectedWebsite.appId
                      ? "px-2 py-1.5  text-base font-medium  mt-2 border-b-2 border-brand text-brand"
                      : " px-2 py-1.5 border-b-2 border-gray-300 text-base font-medium text-gray-500 mt-2 hover:border-b-2 hover:border-brand hover:text-brand"
                  }
                >
                  {website.name}
                </li>
              ))}
          </ul>

          <motion.button
            className="text-gray-700 bg-gray-100 border border-gray-300  px-5 py-1.5 mt-4 rounded-md text-lg font-semibold hover:bg-gray-200 "
            onClick={() => {
              setIsAddOpen(true);
            }}
          >
            Add Website
          </motion.button>
          <AddwsModal
            isOpen={isAddOpen}
            onClose={handleCloseModal}
            getWebsites={getWebsites}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SelectModal;
