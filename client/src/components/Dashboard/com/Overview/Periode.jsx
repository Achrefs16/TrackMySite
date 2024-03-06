import React from "react";

const Periode = ({ handleChange, selectedPeriod }) => {
  return (
    <div className="flex gap-4 items-center">
      <select
        id="time-period"
        value={selectedPeriod}
        onChange={handleChange}
        className=" w-40 mb-4 pl-3 pr-10 py-1.5 text-base border border-gray-300 focus:outline-none sm:text-sm rounded-md"
      >
        <option value="">period</option>
        <option value="day">Last 24 hours</option>
        <option value="week">Last week</option>
        <option value="month">Last month</option>
        <option value="quarter">3-month</option>
        <option value="halfYear">6-month</option>
        <option value="year">This year</option>
      </select>
    </div>
  );
};

export default Periode;
