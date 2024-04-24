import React, { useState } from "react";

// Mockup function documentation data
const docsData = [
  {
    name: "trackLogin",
    description: "Enregistre les événements de connexion des utilisateurs.",
    parameters: [
      {
        name: "méthode",
        description:
          'La méthode utilisée pour se connecter (par exemple, "email", "social").',
      },
    ],
    example: `trackLogin('email');`,
  },
  {
    name: "trackSignUp",
    description: "Enregistre les événements d'inscription des utilisateurs.",
    parameters: [
      {
        name: "méthode",
        description:
          'La méthode utilisée pour s\'inscrire (par exemple, "email", "social").',
      },
    ],
    example: `trackSignUp('email');`,
  },
  {
    name: "trackSubscribe",
    description: "Enregistre les événements d'abonnement.",
    parameters: [
      {
        name: "planAbonnement",
        description: "Le nom du plan d'abonnement.",
      },
      {
        name: "montant",
        description: "Le montant de l'abonnement.",
      },
    ],
    example: `trackSubscribe('premium', 9.99);`,
  },
  {
    name: "trackUnsubscribe",
    description: "Enregistre les événements de désabonnement.",
    parameters: [
      {
        name: "raison",
        description: "Raison du désabonnement.",
      },
    ],
    example: `trackUnsubscribe('Not enough content');`,
  },
  {
    name: "trackProductView",
    description: "Enregistre quand un utilisateur consulte un produit.",
    parameters: [
      {
        name: "nomProduit",
        description: "Le nom du produit consulté.",
      },
      {
        name: "catégorieProduit",
        description: "La catégorie du produit consulté.",
      },
    ],
    example: `trackProductView('iPhone 12', 'Smartphones');`,
  },
  {
    name: "trackAddToCart",
    description:
      "Enregistre quand un utilisateur ajoute un produit à son panier.",
    parameters: [
      {
        name: "nomProduit",
        description: "Le nom du produit ajouté au panier.",
      },
      {
        name: "catégorieProduit",
        description: "La catégorie du produit ajouté au panier.",
      },
    ],
    example: `trackAddToCart('iPhone 12', 'Smartphones');`,
  },
  {
    name: "trackPurchase",
    description: "Enregistre les événements d'achat.",
    parameters: [
      {
        name: "orderId",
        description: "L'ID de commande.",
      },
      {
        name: "name",
        description: "Le nom du produit.",
      },
      {
        name: "category",
        description: "La catégorie du produit.",
      },
      {
        name: "price",
        description: "Le prix du produit.",
      },
    ],
    example: `trackPurchase('123456', 'iPhone 12', 'Smartphones', 999);`,
  },
  {
    name: "trackContentEngagement",
    description: "Enregistre les événements d'engagement avec le contenu.",
    parameters: [
      {
        name: "articleId",
        description: "L'ID de l'article.",
      },
      {
        name: "contentType",
        description: "Le type de contenu avec lequel l'utilisateur a interagi.",
      },
      {
        name: "details",
        description: "Détails supplémentaires concernant l'engagement.",
      },
    ],
    example: `trackContentEngagement('001', 'vidéo', 'Visionnage complet de la vidéo');`,
  },
  {
    name: "trackError",
    description: "Enregistre les erreurs rencontrées dans l'application.",
    parameters: [
      {
        name: "errorMessage",
        description: "Le message d'erreur.",
      },
      {
        name: "errorStack",
        description: "La trace de la pile d'erreurs.",
      },
    ],
    example: `trackError('404 Not Found', 'Trace d'erreur...');`,
  },
  {
    name: "Événement personnalisé",
    description:
      "Enregistre les événements personnalisés spécifiés par le développeur.",
    parameters: [
      {
        name: "nomÉvénement",
        description: "Le nom de l'événement.",
      },
      {
        name: "détailsÉvénement",
        description: "Détails sur l'événement.",
      },
    ],
    example: `track('Événement personnalisé', { détail: 'Détail exemple' });`,
  },
];

const SidebarItem = ({ item, onSelect, isActive }) => (
  <button
    onClick={() => onSelect(item)}
    className={`p-2 w-full text-left ${
      isActive
        ? "bg-brand text-white font-semibold text-base"
        : "font-semibold text-base text-gray-700"
    } rounded-md my-1`}
  >
    {item.name}
  </button>
);

const EventsTracking = () => {
  const [activeDoc, setActiveDoc] = useState(docsData[0]);

  return (
    <div className="flex">
      <div className="w-64 p-4  border-r border-gray-300 ">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Functions</h2>
        {docsData.map((doc, index) => (
          <SidebarItem
            key={index}
            item={doc}
            onSelect={setActiveDoc}
            isActive={activeDoc.name === doc.name}
          />
        ))}
      </div>
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          {activeDoc.name}
        </h1>
        <p className="text-lg text-gray-600 mt-4 mb-6">
          {activeDoc.description}
        </p>

        {activeDoc.parameters.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Parameters:
            </h2>
            <ul className="list-disc pl-8 mb-6 space-y-2">
              {activeDoc.parameters.map((param, index) => (
                <li
                  key={index}
                  className="text-lg text-gray-600"
                >
                  <span className="font-semibold">{param.name}:</span>{" "}
                  {param.description}
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Example:</h2>
        <div className=" bg-slate-800 p-6 rounded border border-gray-300">
          <code className="text-base font-medium text-green-500 break-words">
            {activeDoc.example}
          </code>
        </div>
      </div>
    </div>
  );
};

export default EventsTracking;
