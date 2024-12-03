// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureBoxes from './components/FeatureBoxes';
import Dashboard from './components/Dashboard';
import RecipesPage from './components/RecipesPage';
import FridgePage from './components/FridgePage'; // Import FridgePage

// Sample groceries data
const sampleGroceries = [
  { name: 'Milk', expiresIn: 2 },
  { name: 'Apples', expiresIn: 3 },
  { name: 'Broccoli', expiresIn: 5 },
];

function App() {
  // Add the shared groceryStatus state here
  const [groceryStatus, setGroceryStatus] = useState([]);

  return (
    <Router>
      <div
        className="min-h-screen"
        style={{ background: 'linear-gradient(90deg, #ffb98d, #fdd588, #f4d9a3)' }}
      >
        <Navbar />

        {/* Main Content */}
        <div className="flex-1 pt-24">
          <Routes>
            <Route path="/" element={<> <HeroSection /> <FeatureBoxes /> </>} />
            {/* Pass groceryStatus to Dashboard */}
            <Route
              path="/dashboard/*"
              element={<Dashboard groceryStatus={groceryStatus} setGroceryStatus={setGroceryStatus} />}
            />
            {/* Pass groceryStatus to FridgePage */}
            <Route
              path="/fridge"
              element={<FridgePage groceryStatus={groceryStatus} setGroceryStatus={setGroceryStatus} />}
            />
            <Route path="/recipes" element={<RecipesPage groceries={sampleGroceries} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
