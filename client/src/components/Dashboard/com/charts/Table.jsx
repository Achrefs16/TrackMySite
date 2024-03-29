import React, { useState } from "react";

const Row = ({ index }) => {
  // Split the journey string into individual pages

  return (
    <tr
      key={index}
      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
    >
      <td className="px-6 py-4 whitespace-nowrap">{index}</td>
      <td className="px-6 py-4 whitespace-nowrap"></td>
    </tr>
  );
};

const Table = ({ data }) => {
  return (
    <div className="bg-white p-2 mr-5 rounded border border-gray-300">
      <table className="w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <Row
              key={index}
              index={index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
