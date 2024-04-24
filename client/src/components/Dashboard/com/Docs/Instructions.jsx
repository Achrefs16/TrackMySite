import React, { useState } from "react";
import CodeSnippet from "./CodeSnippet";
import AdvancedTracking from "./AdvancedTracking";
const Instructions = () => {
  const ReactCode = `useEffect(() => {
    initializeTMS("af9e0014885");
  }, []);`;
  const [activeTab, setActiveTab] = useState("React.js");

  const instructions = {
    "React.js": {
      text: "To integrate the TrackMySite tag in your React app, copy the initialization code provided below and insert it within the useEffect hook at the top of your App.js component.",
      code: `
import { initializeTMS } from 'TrackMySite.js';

function App() {
  React.useEffect(() => {
    initializeTMS('yourAppId');
  }, []);

  return (
    <div className="App">
      {/* Your app content */}
    </div>
  );
}`,
    },
    Angular: {
      text: "For Angular, include the TrackMySite tag initialization in your main module or component, using the ngOnInit lifecycle hook.",
      code: `
import { Component, OnInit } from '@angular/core';
import { initializeTMS } from 'TrackMySite.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    initializeTMS('yourAppId');
  }
}`,
    },
    "Vanilla JS": {
      text: "In a Vanilla JS application, add the TrackMySite tag directly within the <script> tag at the bottom of the <body> section of your index.html file.",
      code: `
<script src="path/to/TrackMySite.js"></script>
<script>
  initializeTMS('yourAppId');
</script>
`,
    },
    "Vue.js": {
      text: "To integrate TrackMySite in a Vue.js application, import and initialize TrackMySite in your main.js file, before creating the Vue instance.",
      code: `
import Vue from 'vue';
import App from './App.vue';
import { initializeTMS } from 'TrackMySite.js';

// Initialize TrackMySite with your App ID
initializeTMS('yourAppId');

new Vue({
  render: h => h(App),
}).$mount('#app');
`,
    },
  };

  return (
    <div className="w-full p-10 bg-gray-50">
      <h1 className="text-slate-800 font-bold text-2xl mb-4">
        Instructions d'installation
      </h1>
      <ul className="flex w-96 h-8 justify-between mb-4 text-lg text-slate-600 font-semibold ">
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
      <p className="bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg w-3/4 text-slate-800 mb-6">
        {instructions[activeTab].text}
      </p>
      <p className=" text-slate-800 mb-3 font-medium">Installer le paquet :</p>
      <p className="bg-gray-100 border border-gray-300 py-2 px-4 rounded-lg w-3/4 text-slate-800 mb-6">
        npm install TrackMySite
      </p>
      <p className=" text-slate-800 mb-3 font-medium">
        Importer et initialiser :
      </p>

      <CodeSnippet code={instructions[activeTab].code} />
    </div>
  );
};

export default Instructions;
