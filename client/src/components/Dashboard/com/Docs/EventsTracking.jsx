import React, { useState } from "react";

// Mockup function documentation data
const docsData = [
  {
    name: "trackLogin",
    description: "Tracks user login events.",
    parameters: [
      {
        name: "method",
        description:
          'The method used for logging in (e.g., "email", "social").',
      },
    ],
    example: `trackLogin('email');`,
  },
  {
    name: "trackSignUp",
    description: "Tracks user sign-up events.",
    parameters: [
      {
        name: "method",
        description:
          'The method used for signing up (e.g., "email", "social").',
      },
    ],
    example: `trackSignUp('email');`,
  },
  {
    name: "trackSubscribe",
    description: "Tracks subscription events.",
    parameters: [
      {
        name: "subscriptionPlan",
        description: "The name of the subscription plan.",
      },
      {
        name: "amount",
        description: "The subscription amount.",
      },
    ],
    example: `trackSubscribe('premium', 9.99);`,
  },
  {
    name: "trackUnsubscribe",
    description: "Tracks unsubscribe events.",
    parameters: [
      {
        name: "reason",
        description: "Reason for unsubscribing.",
      },
    ],
    example: `trackUnsubscribe('Not enough content');`,
  },
  {
    name: "trackProductView",
    description: "Tracks when a user views a product.",
    parameters: [
      {
        name: "productName",
        description: "The name of the viewed product.",
      },
      {
        name: "productCategory",
        description: "The category of the viewed product.",
      },
    ],
    example: `trackProductView('iPhone 12', 'Smartphones');`,
  },
  {
    name: "trackAddToCart",
    description: "Tracks when a user adds a product to their cart.",
    parameters: [
      {
        name: "productName",
        description: "The name of the product added to the cart.",
      },
      {
        name: "productCategory",
        description: "The category of the product added to the cart.",
      },
    ],
    example: `trackAddToCart('iPhone 12', 'Smartphones');`,
  },
  {
    name: "trackPurchase",
    description: "Tracks purchase events.",
    parameters: [
      {
        name: "orderId",
        description: "The order ID.",
      },
      {
        name: "name",
        description: "The name of the product.",
      },
      {
        name: "category",
        description: "The category of the product.",
      },
      {
        name: "price",
        description: "The price of the product.",
      },
    ],
    example: `trackPurchase('123456', 'iPhone 12', 'Smartphones', 999);`,
  },
  {
    name: "trackContentEngagement",
    description: "Tracks content engagement events.",
    parameters: [
      {
        name: "articleId",
        description: "The ID of the article.",
      },
      {
        name: "contentType",
        description: "The type of content engaged with.",
      },
      {
        name: "details",
        description: "Additional details regarding the engagement.",
      },
    ],
    example: `trackContentEngagement('001', 'video', 'Watched full video');`,
  },
  {
    name: "trackError",
    description: "Tracks errors encountered in the application.",
    parameters: [
      {
        name: "errorMessage",
        description: "The error message.",
      },
      {
        name: "errorStack",
        description: "The error stack trace.",
      },
    ],
    example: `trackError('404 Not Found', 'ErrorStack...');`,
  },
  {
    name: "Custom Event",
    description: "Tracks custom events specified by the developer.",
    parameters: [
      {
        name: "eventName",
        description: "The name of the event.",
      },
      {
        name: "eventDetails",
        description: "Details about the event.",
      },
    ],
    example: `track('CustomEvent', { detail: 'Example Detail' });`,
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
