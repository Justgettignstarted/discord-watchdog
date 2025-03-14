
import React from 'react';
import { Check } from 'lucide-react';

const features = [
  "Fast",
  "Free",
  "Proxyless",
  "Reports a user for a message they sent"
];

const FeaturesList = () => {
  return (
    <div className="my-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Features</h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturesList;
