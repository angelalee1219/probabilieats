import React, { useState } from 'react';

const FridgePage = ({ groceryStatus, setGroceryStatus }) => {
  const [error, setError] = useState(null);

  // Remove grocery item
  const handleRemove = (id) => {
    setGroceryStatus((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Sort grocery items by expiration date (ascending order)
  const sortedGroceries = [...groceryStatus].sort((a, b) => {
    const dateA = new Date(a.expirationDate);
    const dateB = new Date(b.expirationDate);

    // Handle cases where expiration dates might be null
    if (!a.expirationDate) return 1; // Items without expiration go to the bottom
    if (!b.expirationDate) return -1;

    return dateA - dateB;
  });

  return (
    <div className="flex flex-col justify-center max-h-screen bg-white p-6">
      <h1 className="text-4xl font-semibold text-purple-700 mb-6">Your Fridge</h1>

      <div className="overflow-auto w-full max-w-3xl bg-white rounded-lg shadow-md p-4 border border-gray-200">
        {error && <p className="text-red-500">{error}</p>}
        {sortedGroceries.length === 0 ? (
          <p className="text-gray-500">No items in your fridge.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-purple-100 text-purple-800">
                <th className="p-3 text-left font-semibold border-b border-gray-200">Item</th>
                <th className="p-3 text-left font-semibold border-b border-gray-200">Expiration Date</th>
                <th className="p-3 text-left font-semibold border-b border-gray-200">Days Left</th>
                <th className="p-3 text-left font-semibold border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedGroceries.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="p-3 text-gray-800 border-b border-gray-200">{item.name || 'Unknown'}</td>
                  <td className="p-3 text-gray-600 border-b border-gray-200">
                    {item.expirationDate || 'No Expiration'}
                  </td>
                  <td className="p-3 text-gray-600 border-b border-gray-200">
                    {item.daysLeft === 'Expired' ? (
                      <span className="text-red-500">Expired</span>
                    ) : item.daysLeft === 'Unknown' ? (
                      'Unknown'
                    ) : (
                      `${item.daysLeft} days`
                    )}
                  </td>
                  <td className="p-3 text-gray-600 border-b border-gray-200">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="ml-2 px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FridgePage;
