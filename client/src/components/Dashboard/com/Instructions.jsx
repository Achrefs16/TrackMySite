import React, { useState } from "react";
import CodeSnippet from "./CodeSnippet";
const Instructions = () => {
  const ReactCode = `useEffect(() => {
    initializeTMS("af9e0014885");
  }, []);`;
  const [activeTab, setActiveTab] = useState("React js");

  const instructions = {
    "React js": {
      text: "To integrate the TrackMySite tag in your React app, copy the initialization code provided below and insert it within the useEffect hook at the top of your App.js component.",
      code: 'const ReactCode = "Your React-specific TrackMySite initialization code";',
    },
    Angular: {
      text: "For Angular, include the TrackMySite tag initialization in your main module or component, using the ngOnInit lifecycle hook.",
      code: 'const AngularCode = "Your Angular-specific TrackMySite initialization code";',
    },
    "Vanila js": {
      text: "In a Vanilla JS application, add the TrackMySite tag directly within the <script> tag at the bottom of the <body> section of your index.html file.",
      code: 'const VanillaJsCode = "Your Vanilla JS-specific TrackMySite initialization code";',
    },
  };
  return (
    <div className="w-full p-10 bg-gray-50">
      <h1 className="text-slate-800 font-bold text-2xl mb-4">
        Installation instructions
      </h1>
      <ul className="flex w-64 h-8 justify-between mb-4 text-lg text-gray-600 font-semibold ">
        {Object.keys(instructions).map((framework) => (
          <li
            key={framework}
            className={`pb-1 hover:text-brand hover:border-b-2 hover:pb-1 ${
              activeTab === framework
                ? "border-b-2 border-brand text-brand"
                : ""
            }`}
            onClick={() => setActiveTab(framework)}
          >
            {framework}
          </li>
        ))}
      </ul>
      <p className="bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg w-3/4 text-gray-800 mb-6">
        {instructions[activeTab].text}
      </p>

      <CodeSnippet code={instructions[activeTab].code} />
    </div>
  );
};

export default Instructions;
