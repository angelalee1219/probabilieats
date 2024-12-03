import React from 'react';

const QuickActions = ({ onOpenScanner, onAddGroceries }) => {
  return (
    <div className="flex space-x-4">
      <button
        onClick={onAddGroceries} // Trigger the Add Groceries modal
        className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
      >
        Add Groceries
      </button>
      <button
        onClick={onOpenScanner} // Call the passed function to open the scanner
        className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
      >
        Scan Item
      </button>
      <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800">
        Manage Waste
      </button>
    </div>
  );
};

export default QuickActions;
