import React, { useState } from "react";

const AdvancedTracking = () => {
  // Data for each tracking function
  const functionData = {
    Overview: {
      description:
        "These tracking methods help website owners understand user behavior: visibility tracking monitors appearances, click tracking observes clicks, form submission tracking notes form completions, and file download tracking records downloads.",
    },
    "Visibility Tracking": {
      description:
        "Monitors when specified elements become visible, aiding content and ad performance analysis.",
      dataCaptured: "Element ID or tag, and visibility timestamp.",
      example: '<div tms="visibility">Visible Content</div>',
    },
    "Click Tracking": {
      description:
        "Analyzes user interactions through clicks on designated elements.",
      dataCaptured:
        "Element's ID, tag, text content, href attribute, and click timestamp.",
      example: '<button tms="click">Click Me</button>',
    },
    "Form Submission Tracking": {
      description:
        "Tracks user interactions with forms to capture engagement and conversion data.",
      dataCaptured:
        "Form ID, name, destination, submit text, and submission timestamp.",
      example: '<form tms="form">Form Fields</form>',
    },
    "File Download Tracking": {
      description:
        "Provides insights into user interest by tracking file download events.",
      dataCaptured: "Link URL, file name, extension, and download timestamp.",
      example: '<a href="URL" tms="download">Download File</a>',
    },
    "Video Play Tracking": {
      description:
        "Monitors engagement with video content by tracking play events.",
      dataCaptured:
        "Video ID, source URL, title or alt text, duration, and play timestamp.",
      example: '<video tms="video"></video>',
    },
    "Query Search Tracking": {
      description:
        "Tracks search query input to understand user search behavior and intent.",
      dataCaptured: "Input field ID, tag name, and query text.",
      example: '<input type="search" tms="query-search" />',
    },
    "Clipboard Copy Tracking": {
      description:
        "Tracks text copied by the user from elements marked with tms='clipboard-copy'.",
      dataCaptured: "Element ID, tag name, and the copied text content.",
      example: '<div tms="clipboard-copy">Copyable Content</div>',
    },
  };

  const handleNavigation = (functionName) => {
    setSelectedFunction(functionName);
  };
  const [selectedFunction, setSelectedFunction] = useState("Overview");
  return (
    <div className="w-full mx-auto  ">
      <div className="flex gap-20 items-center">
        <nav className="w-64 p-4  border-r border-gray-300 ">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Functions</h2>
          <ul className=" w-fit ">
            {Object.keys(functionData).map((functionName) => (
              <li key={functionName}>
                <button
                  onClick={() => handleNavigation(functionName)}
                  className={`p-2 w-full text-left font-semibold text-base rounded-md my-1 ${
                    selectedFunction === functionName
                      ? "bg-brand text-white  "
                      : " text-gray-700 "
                  }`}
                >
                  {functionName}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {selectedFunction && (
          <section className="mb-8 w-2/4">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              {selectedFunction}
            </h2>
            <p className="text-lg text-gray-600 mt-4 mb-6">
              {functionData[selectedFunction].description}
            </p>
            {selectedFunction === "Overview" ? null : (
              <div className="text-lg text-gray-600">
                <span className="font-semibold">Data Captured:</span>{" "}
                {functionData[selectedFunction].dataCaptured}
                <p className="text-2xl font-semibold text-gray-700 my-4">
                  How to use it:
                </p>
                <div className=" bg-slate-800 p-6 rounded border border-gray-300 mt-4">
                  <code className="text-base font-medium text-green-500 break-words">
                    {functionData[selectedFunction].example}
                  </code>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdvancedTracking;
