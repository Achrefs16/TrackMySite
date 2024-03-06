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
    <div className="bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg font-medium text-slate-800 w-3/4 flex justify-between ">
      <div>
        <pre className="mb-4">
          <code>{code}</code>
        </pre>
      </div>
      {copySuccess ? (
        <div className="  py-1.5 px-2 font-semibold rounded-lg mb-4  flex items-center gap-2">
          {copySuccess}
        </div>
      ) : (
        <button
          className=" py-1.5 px-2 font-semibold rounded-lg mb-4  flex items-center gap-2"
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
