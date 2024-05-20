import React, { useState } from "react";
import CodeSnippet from "./CodeSnippet";
import { useDispatch, useSelector } from "react-redux";
import AdvancedTracking from "./AdvancedTracking";
const Instructions = () => {
  const ReactCode = `useEffect(() => {
    initializeTMS("af9e0014885");
  }, []);`;
  const [activeTab, setActiveTab] = useState("React.js");
  const selectedWebsite = useSelector((state) => state.website.selectedWebsite);
  const instructions = {
    "React.js": {
      text: "Pour intégrer la balise TrackMySite dans votre application React, copiez le code d'initialisation fourni ci-dessous et insérez-le dans le hook useEffect en haut de votre composant App.js.",
      code: `
import { initializeTMS } from 'TrackMySite.js';

function App() {
 useEffect(() => {
    initializeTMS('${selectedWebsite.appId}');
  }, []);

  return (
    <div className="App">
      {/* Your app content */}
    </div>
  );
}`,
    },
    Angular: {
      text: "Pour Angular, incluez l'initialisation de la balise TrackMySite dans votre module ou composant principal, en utilisant le crochet de cycle de vie ngOnInit.",
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
    initializeTMS('${selectedWebsite.appId}');
  }
}`,
    },
    "Vanilla JS": {
      text: "Dans une application Vanilla JS, ajoutez la balise TrackMySite directement dans la balise <script> au bas de la section <body> de votre fichier index.html.",
      code: `
<script src="path/to/TrackMySite.js"></script>
<script>
  initializeTMS('${selectedWebsite.appId}');
</script>
`,
    },
    "Vue.js": {
      text: "Pour intégrer TrackMySite dans une application Vue.js, importez et initialisez TrackMySite dans votre fichier main.js, avant de créer l'instance Vue.",
      code: `
import Vue from 'vue';
import App from './App.vue';
import { initializeTMS } from 'TrackMySite.js';

// Initialize TrackMySite with your App ID
initializeTMS('${selectedWebsite.appId}');

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
