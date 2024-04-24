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
        <option value="">période</option>
        <option value="day">Dernières 24 heures</option>
        <option value="week">Semaine dernière</option>
        <option value="month">Mois dernier</option>
        <option value="quarter">3 mois</option>
        <option value="halfYear">6 mois</option>
        <option value="year">Cette année</option>
      </select>
    </div>
  );
};

export default Periode;
