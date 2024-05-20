import React, { useState } from "react";

const AdvancedTracking = () => {
  // Data for each tracking function
  const functionData = {
    "Page visite": {
      description:
        "L'événement Page visite enregistre chaque fois qu'un utilisateur accède à une page spécifique sur le site web.",
      dataCaptured: "URL de page, nom de page, et horodatage de l'evenement.",
      example: '  handlePageView("home");',
    },
    "Suivi de visibilité": {
      description:
        "Contrôle le moment où les éléments spécifiés deviennent visibles, ce qui facilite l'analyse du contenu et des performances publicitaires.",
      dataCaptured:
        "Identifiant d'élément ou balise, et horodatage de visibilité.",
      example: '<div tms="visibility">Visible Content</div>',
    },
    "Suivi des clics": {
      description:
        "Analyse des interactions utilisateur à travers les clics sur des éléments désignés.",
      dataCaptured:
        "Identifiant de l'élément, balise, contenu textuel, attribut href et horodatage du clic.",
      example: '<button tms="click">Click Me</button>',
    },
    "Suivi des soumissions de formulaire": {
      description:
        "Suit les interactions des utilisateurs avec les formulaires pour capturer les données d'engagement et de conversion.",
      dataCaptured:
        "Identifiant du formulaire, nom, destination, texte de soumission et horodatage de la soumission.",
      example: '<form tms="form">Form Fields</form>',
    },
    "Suivi des téléchargements de fichiers": {
      description:
        "Fournit des informations sur l'intérêt des utilisateurs en suivant les événements de téléchargement de fichiers.",
      dataCaptured:
        "URL du lien, nom du fichier, extension et horodatage du téléchargement.",
      example: '<a href="URL" tms="download">Download File</a>',
    },
    "Suivi de la lecture des vidéos": {
      description:
        "Surveille l'engagement avec le contenu vidéo en suivant les événements de lecture.",
      dataCaptured:
        "Identifiant de la vidéo, URL de la source, titre ou texte alternatif, durée et horodatage de la lecture.",
      example: '<video tms="video"></video>',
    },
    "Suivi des recherches de requêtes": {
      description:
        "Suit les entrées de requêtes de recherche pour comprendre le comportement de recherche et l'intention des utilisateurs.",
      dataCaptured:
        "Identifiant du champ de saisie, nom de la balise et texte de la requête.",
      example: '<input type="search" tms="query-search" />',
    },
    "Suivi de la copie": {
      description:
        "Suit le texte copié par l'utilisateur à partir d'éléments marqués avec tms='clipboard-copy'.'.",
      dataCaptured:
        "Identifiant de l'élément, nom de la balise et contenu du texte copié.",
      example: '<div tms="clipboard-copy">Copyable Content</div>',
    },
  };

  const handleNavigation = (functionName) => {
    setSelectedFunction(functionName);
  };
  const [selectedFunction, setSelectedFunction] = useState("Page visite");
  return (
    <div className="w-full mx-auto  ">
      <div className="flex gap-20 items-center">
        <nav className="w-64 p-4  border-r border-gray-300 ">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Événements</h2>
          <ul className=" w-fit ">
            {Object.keys(functionData).map((functionName) => (
              <li key={functionName}>
                <button
                  onClick={() => handleNavigation(functionName)}
                  className={`p-2 w-full text-left font-semibold text-base rounded-md my-1 ${
                    selectedFunction === functionName
                      ? "bg-brand text-white  "
                      : " text-gray-700 "
                  }`}
                >
                  {functionName}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {selectedFunction && (
          <section className="mb-8 w-2/4">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              {selectedFunction}
            </h2>
            <p className="text-lg text-gray-600 mt-4 mb-6">
              {functionData[selectedFunction].description}
            </p>
            {selectedFunction === "Overview" ? null : (
              <div className="text-lg text-gray-600">
                <span className="font-semibold">Données capturées :</span>{" "}
                {functionData[selectedFunction].dataCaptured}
                <p className="text-2xl font-semibold text-gray-700 my-4">
                  Comment l'utiliser :
                </p>
                <div className=" bg-slate-800 p-6 rounded border border-gray-300 mt-4">
                  <code className="text-base font-medium text-green-500 break-words">
                    {functionData[selectedFunction].example}
                  </code>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdvancedTracking;
