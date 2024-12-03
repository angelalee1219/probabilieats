import React, { useState } from 'react';

const GroceryStatus = ({ groceryStatus, handleSaveExpirationDate, handleRemoveItem }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [newExpirationDate, setNewExpirationDate] = useState('');
  const maxExpirationDays = 7;

  return (
    <div>
      {groceryStatus.length > 0 ? (
        <ul className="text-lg space-y-4">
          {groceryStatus.map((item, index) => {
            const { daysLeft } = item;

            let progressPercentage;
            let progressColor;

            if (daysLeft === 'Expired' || daysLeft === 'Unknown') {
              progressPercentage = 100;
              progressColor = 'bg-red-500';
            } else {
              progressPercentage = Math.min(
                100,
                ((maxExpirationDays - daysLeft) / maxExpirationDays) * 100
              );
              progressColor = daysLeft <= 2 ? 'bg-red-500' : 'bg-green-500';
            }

            return (
              <li key={index} className="flex flex-col space-y-2">
                {/* Item name, days to expiration, and remove button */}
                <div className="flex justify-between items-center">
                  <div>
                    <span>{item.name}</span>
                    <span className="text-gray-500 ml-2">
                      {daysLeft === 'Unknown'
                        ? 'Unknown'
                        : daysLeft === 'Expired'
                        ? 'Expired'
                        : `${daysLeft} days left`}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.barcode)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove item"
                  >
                    🗑️
                  </button>
                </div>

                {/* Expiration Progress Bar */}
                <div className="w-full bg-gray-300 h-2 rounded-full mt-1">
                  <div
                    className={`h-2 rounded-full ${progressColor}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                {/* Edit and Save Buttons */}
                {editingItem?.barcode === item.barcode ? (
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="date"
                      value={newExpirationDate}
                      onChange={(e) => setNewExpirationDate(e.target.value)}
                      className="p-2 border rounded"
                    />
                    <button
                      onClick={() => handleSaveExpirationDate(item.barcode, newExpirationDate)}
                      className="text-white bg-green-500 px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="text-white bg-gray-500 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setNewExpirationDate(item.expirationDate || '');
                    }}
                    className="text-blue-500 underline mt-2"
                  >
                    Edit
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No groceries added yet.</p>
      )}
    </div>
  );
};

export default GroceryStatus;
