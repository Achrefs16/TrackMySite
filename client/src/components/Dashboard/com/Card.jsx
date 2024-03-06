import React from "react";

const Card = ({ count, content }) => {
  return (
    <div className="px-2 py-1 w-68 h-28 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-brand hover:border-2">
      <p className="text-gray-700 font-semibold">{content}</p>
      <h1 className="text-slate-800 font-bold text-3xl text-center pt-3 pb-3">
        {count}
      </h1>
    </div>
  );
};

export default Card;
