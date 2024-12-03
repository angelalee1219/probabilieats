// src/components/FeatureBoxes.js
import React from 'react';

const FeatureBoxes = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      <div className="bg-white shadow-lg p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">1. Add Your Groceries</h3>
        <p>Scan or input expiration dates to keep track of what’s fresh.</p>
      </div>
      <div className="bg-white shadow-lg p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">2. Get Usage Suggestions</h3>
        <p>Receive meal plans and recipes based on your soon-to-expire items.</p>
      </div>
      <div className="bg-white shadow-lg p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">3. Track Your Impact</h3>
        <p>See your saved waste and environmental impact in your dashboard.</p>
      </div>
    </section>
  );
};

export default FeatureBoxes;
