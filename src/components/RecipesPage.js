// src/components/RecipesPage.js
import React, { useState, useEffect } from 'react';

// Sample recipes database
const recipesDatabase = [
  {
    name: 'Apple Pie',
    ingredients: ['Apples', 'Flour', 'Sugar', 'Butter'],
    instructions: 'Mix apples with sugar and flour. Place in crust and bake at 350°F for 45 minutes.',
  },
  {
    name: 'Broccoli Stir Fry',
    ingredients: ['Broccoli', 'Garlic', 'Soy Sauce', 'Oil'],
    instructions: 'Stir fry broccoli and garlic in oil. Add soy sauce and cook until tender.',
  },
  {
    name: 'Milkshake',
    ingredients: ['Milk', 'Ice Cream', 'Sugar'],
    instructions: 'Blend milk, ice cream, and sugar until smooth.',
  },
  // Add more recipes as needed
];

const RecipesPage = ({ groceries }) => {
  const [expiringGroceries, setExpiringGroceries] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);

  // Find groceries that are expiring soon
  useEffect(() => {
    const soonExpiring = groceries.filter(grocery => grocery.expiresIn <= 3); // Items expiring in 3 days or less
    setExpiringGroceries(soonExpiring);
  }, [groceries]);

  // Find recipes based on expiring groceries
  useEffect(() => {
    const recommended = recipesDatabase.filter(recipe =>
      recipe.ingredients.some(ingredient =>
        expiringGroceries.some(grocery => grocery.name.toLowerCase() === ingredient.toLowerCase())
      )
    );
    setRecommendedRecipes(recommended);
  }, [expiringGroceries]);

  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-4xl font-semibold text-purple-700 mb-6">Recipe Suggestions</h1>

      {recommendedRecipes.length > 0 ? (
        recommendedRecipes.map((recipe, index) => (
          <div key={index} className="mb-8 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">{recipe.name}</h2>
            <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
            <ul className="list-disc ml-5 mb-4">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i} className="text-gray-700">{ingredient}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
            <p className="text-gray-800">{recipe.instructions}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-700 text-lg">No recipe suggestions at the moment. Keep an eye on your groceries!</p>
      )}
    </div>
  );
};

export default RecipesPage;
