import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import RecipeSuggestions from './RecipeSuggestions';
import QuickActions from './QuickActions';
import FridgePage from './FridgePage';
import Settings from './Settings';
import BarcodeScanner from './BarcodeScanner';
import { v4 as uuidv4 } from 'uuid';
import { calculateImpact } from '../utils/calculateImpact';
import { convertToKilograms } from '../utils/calculateImpact';
import EnvironmentalImpact from './EnvironmentalImpact';



const Dashboard = ({ groceryStatus, setGroceryStatus }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddingGroceries, setIsAddingGroceries] = useState(false);
  const [newGrocery, setNewGrocery] = useState({
    name: '',
    expirationDate: '',
    quantity: '',
    unit: 'None', // Default unit is "None" for raw counts
  });
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [impactResults, setImpactResults] = useState({
    wasteResults: [],
    totalFoodSaved: 0,
    totalCO2Saved:0,
    totalPotentialCO2:0,
    totalPotentialWaste:0,

  });
  
  useEffect(() => {
    if (selectedRecipes.length > 0) {
      const results = calculateImpact(selectedRecipes, groceryStatus);
      setImpactResults(results);

      // Debugging log
      console.log("Impact Results Updated:", results);
    } else {
      // Reset impact results when no recipes are selected
      setImpactResults({
        wasteResults: [],
        totalFoodSaved: 0,
        totalCO2Saved: 0,
        totalPotentialCO2: 0,
        totalPotentialWaste: 0,
        totalUncertainty: 0,
      });
    }
  }, [selectedRecipes, groceryStatus]);


  const handleScan = async (barcode) => {
    try {
      const response = await fetch(`http://localhost:5001/api/barcodes/${barcode.trim()}`);
      if (!response.ok) throw new Error('Product not found');
  
      const product = await response.json();
  
      const newItem = {
        id: product.barcode || uuidv4(),
        name: product.name || 'Unknown Item',
        expirationDate: product.expirationDate || null,
        daysLeft: product.expirationDate ? calculateDaysLeft(product.expirationDate) : 'Unknown',
        quantity: 1, // Default quantity
        unit: 'None', // Default to raw count
      };
  
      setGroceryStatus((prevStatus) => [...prevStatus, newItem]);
    } catch (err) {
      console.error('Error scanning barcode:', err.message);
    } finally {
      setIsScannerOpen(false);
    }
  };
  const calculateExpiredImpact = (groceryStatus) => {
    const CO2_EMISSION_FACTOR = 2.5; // CO₂ emitted per kg of food waste
  
    let expiredFoodLoss = 0;
    let expiredCO2Loss = 0;
  
    groceryStatus.forEach((item) => {
      if (item.daysLeft === 'Expired') {
        const weightInKg = convertToKilograms(item.quantity, item.unit, item.name);
        expiredFoodLoss += weightInKg;
        expiredCO2Loss += weightInKg * CO2_EMISSION_FACTOR;
      }
    });
  
    return { expiredFoodLoss, expiredCO2Loss };
  };
  

  const saveNewGrocery = () => {
    try {
      if (!newGrocery.name || !newGrocery.expirationDate || !newGrocery.quantity) {
        throw new Error('All fields are required');
      }

      const newItem = {
        id: uuidv4(),
        name: newGrocery.name,
        expirationDate: newGrocery.expirationDate,
        quantity: parseFloat(newGrocery.quantity), // Parse quantity as a float
        unit: newGrocery.unit,
        daysLeft: calculateDaysLeft(newGrocery.expirationDate),
      };
      // Update grocery status
    const updatedGroceryStatus = [...groceryStatus, newItem];
    setGroceryStatus(updatedGroceryStatus);

    // Calculate expired impact
    const expiredImpact = calculateExpiredImpact(updatedGroceryStatus);
    setImpactResults((prevResults) => ({
      ...prevResults,
      meanFoodSaved: -expiredImpact.expiredFoodLoss,
      meanCO2Saved: -expiredImpact.expiredCO2Loss,
    }));

     
      setIsAddingGroceries(false);
      setNewGrocery({ name: '', expirationDate: '', quantity: '', unit: 'None' }); // Reset form
    } catch (err) {
      console.error('Error adding grocery:', err.message);
    }
  };
  useEffect(() => {
    const expiredImpact = calculateExpiredImpact(groceryStatus);
  
    setImpactResults((prevResults) => ({
      ...prevResults,
      expiredFoodLoss: expiredImpact.expiredFoodLoss,
      expiredCO2Loss: expiredImpact.expiredCO2Loss,
      meanFoodSaved: -expiredImpact.expiredFoodLoss,
      meanCO2Saved: -expiredImpact.expiredCO2Loss,
    }));
  }, [groceryStatus]);
  

  const calculateDaysLeft = (expirationDate) => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Normalize to midnight
    const expDate = new Date(expirationDate);
    const expDateStart = new Date(expDate.getFullYear(), expDate.getMonth(), expDate.getDate()); // Normalize to midnight
  
    const diffTime = expDateStart - todayStart;
    return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 'Expired';
  };
  
  const handleRecipeSelection = (recipes) => {
    setSelectedRecipes(recipes);
  
    // Calculate recipe-based impact
  const recipeImpact = calculateImpact(recipes, groceryStatus);

  // Calculate expired impact
  const expiredImpact = calculateExpiredImpact(groceryStatus);

  // Combine the two impacts
  const totalFoodSaved = recipeImpact.meanFoodSaved - expiredImpact.expiredFoodLoss;
  const totalCO2Saved = recipeImpact.meanCO2Saved - expiredImpact.expiredCO2Loss;

  setImpactResults({
    ...recipeImpact,
    meanFoodSaved: totalFoodSaved,
    meanCO2Saved: totalCO2Saved,
    expiredFoodLoss: impactResults.expiredFoodLoss,
    expiredCO2Loss: impactResults.expiredCO2Loss,
  });
};
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto" style={{ background: 'white' }}>
        <Routes>
          <Route
            path="/"
            element={
              <div className="p-10">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome back, [User]!</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
 <EnvironmentalImpact impactResults={impactResults} />
</div>



            
                  {/* Grocery Status Section */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-purple-700 mb-4">Grocery Status</h2>
                    <ul className="space-y-2">
                      {groceryStatus.map((item) => (
                        <li key={item.id} className="border p-2 rounded flex justify-between items-center">
                          <div>
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
                            <p>
                              <strong>Days Left:</strong>{' '}
                              {item.daysLeft === 'Expired' ? (
                                <span className="text-red-500">Expired</span>
                              ) : (
                                `${item.daysLeft} days`
                              )}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recipe Suggestions Section */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-purple-700 mb-4">Recipe Suggestions</h2>
                    <RecipeSuggestions
                      groceryStatus={groceryStatus}
                      onRecipeSelection={(recipes) => setSelectedRecipes(recipes)}
                    />
                  </div>
                </div>

                <QuickActions
                  onOpenScanner={() => setIsScannerOpen(true)}
                  onAddGroceries={() => setIsAddingGroceries(true)}
                />
              </div>
            }
          />
          <Route
            path="fridge"
            element={<FridgePage groceryStatus={groceryStatus} setGroceryStatus={setGroceryStatus} />}
          />
          <Route path="settings" element={<Settings />} />
        </Routes>

        {isScannerOpen && (
          <BarcodeScanner
            onScan={(barcode) => handleScan(barcode)}
            onClose={() => setIsScannerOpen(false)}
          />
        )}

        {isAddingGroceries && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-2xl font-semibold mb-4">Add New Grocery</h2>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={newGrocery.name}
                  onChange={(e) => setNewGrocery((prev) => ({ ...prev, name: e.target.value }))}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Expiration Date</label>
                <input
                  type="date"
                  value={newGrocery.expirationDate}
                  onChange={(e) => setNewGrocery((prev) => ({ ...prev, expirationDate: e.target.value }))}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={newGrocery.quantity}
                  onChange={(e) => setNewGrocery((prev) => ({ ...prev, quantity: e.target.value }))}
                  className="p-2 border rounded w-full"
                  placeholder="Enter quantity (e.g., 2)"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Unit</label>
                <select
                  value={newGrocery.unit}
                  onChange={(e) => setNewGrocery((prev) => ({ ...prev, unit: e.target.value }))}
                  className="p-2 border rounded w-full"
                >
                  <option value="None">None</option>
                  <option value="lbs">lbs</option>
                  <option value="oz">oz</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsAddingGroceries(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNewGrocery}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
