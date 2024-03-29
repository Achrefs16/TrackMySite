import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";

const CodeSnippet = ({ code }) => {
  const [copySuccess, setCopySuccess] = useState("");

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess("Copied!");
    } catch (err) {
      setCopySuccess("Failed to copy.");
    }
  };

  return (
    <div className="bg-slate-800 border border-gray-300 py-2 px-3 rounded-lg font-medium text-slate-800 w-3/4 flex justify-between ">
      <div>
        <pre className="mb-4">
          <code className="text-base font-medium text-green-500 break-words">
            {code}
          </code>
        </pre>
      </div>
      {copySuccess ? (
        <div className="  py-1.5 px-2 font-semibold text-white rounded-lg mb-4  flex mt-2  gap-2">
          {copySuccess}
        </div>
      ) : (
        <button
          className=" py-1.5 px-2 font-semibold text-white border-white rounded-lg mb-4 float-end flex mt-2  gap-2"
          onClick={() => copyToClipboard(code)}
        >
          {" "}
          <MdContentCopy />
          Copy
        </button>
      )}
    </div>
  );
};

export default CodeSnippet;
