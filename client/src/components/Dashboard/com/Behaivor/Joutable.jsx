import React, { useState } from "react";

const JourneyRow = ({ index, journey, occurrences }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Split the journey string into individual pages
  const journeyPages = journey[0].split(", ");

  return (
    <tr
      key={index}
      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
    >
      <td className="px-6 py-4 whitespace-nowrap">{index}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className=" flex justify-between items-start">
          <div className="flex-1">
            {isExpanded
              ? // Display all pages if expanded
                journeyPages.map((page, pageIndex) => (
                  <span
                    key={pageIndex}
                    className="inline-block mr-2"
                  >
                    {pageIndex > 0 && (
                      <span className="text-gray-800"> ➔ </span>
                    )}
                    {page}
                  </span>
                ))
              : // Display first three pages and add ellipsis if there are more
                journeyPages.slice(0, 3).map((page, pageIndex) => (
                  <span
                    key={pageIndex}
                    className="inline-block mr-2"
                  >
                    {pageIndex > 0 && (
                      <span className="text-gray-800"> ➔ </span>
                    )}
                    {page}
                  </span>
                ))}
          </div>
          {/* Show toggle button if journey has more than 3 pages */}
          {journeyPages.length > 3 && (
            <button
              onClick={toggleExpanded}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline whitespace-nowrap"
            >
              {isExpanded ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </div>
      </td>

      <td className="border px-4 py-2">{occurrences}</td>
    </tr>
  );
};

const Joutable = ({ journeys }) => {
  return (
    <div className="bg-white p-2 mr-5 rounded border border-gray-300">
      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Parcours
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Occurrences
            </th>
          </tr>
        </thead>
        <tbody>
          {journeys.map((item, index) => (
            <JourneyRow
              key={index}
              index={index + 1}
              journey={item.Journey}
              occurrences={item.Occurrences}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Joutable;
