import React, { useState, useEffect, useCallback } from "react";

const RecipeSuggestions = ({ groceryStatus, onRecipeSelection }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "9973533"; // Replace with your actual API key
  const API_URL = `https://www.themealdb.com/api/json/v2/${API_KEY}/filter.php`;
  const LOOKUP_URL = `https://www.themealdb.com/api/json/v1/1/lookup.php`;

  // Fetch recipes for a single ingredient
  const fetchRecipesForIngredient = async (ingredient) => {
    try {
      const url = `${API_URL}?i=${ingredient}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error(`Error fetching recipes for ingredient "${ingredient}":`, error);
      return [];
    }
  };

  // Fetch details for a single recipe
  const fetchRecipeDetails = async (idMeal) => {
    try {
      const url = `${LOOKUP_URL}?i=${idMeal}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.meals[0];
    } catch (error) {
      console.error(`Error fetching recipe details for id "${idMeal}":`, error);
      return null;
    }
  };

  // Parse ingredients from the detailed recipe object
  const parseIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredientName = meal[`strIngredient${i}`]?.trim();
      const measure = meal[`strMeasure${i}`]?.trim();

      if (ingredientName && ingredientName !== "") {
        const [quantity, ...unitParts] = measure.split(" ");
        const unit = unitParts.join(" ");

        ingredients.push({
          name: ingredientName.toLowerCase(),
          quantity: parseFloat(quantity) || 1,
          unit: unit || "None",
        });
      }
    }
    return ingredients;
  };

  // Calculate the probability based on expiration proximity
  const calculateExpirationProbability = (daysLeft) => {
    if (daysLeft === "Expired") return 1; // Maximum priority for expired items
    if (typeof daysLeft === "number") {
      return 1 / (daysLeft + 1); // Closer to expiration -> higher probability
    }
    return 0; // Unknown expiration -> low priority
  };

  // Fetch recipes for all valid ingredients
  const fetchAndCombineRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const validIngredients = groceryStatus
        .filter((item) => item.daysLeft !== "Expired")
        .map((item) => ({
          name: item.name.toLowerCase().trim(),
          probability: calculateExpirationProbability(item.daysLeft),
        }));

      if (validIngredients.length === 0) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      const fetchedRecipes = [];
      for (const { name } of validIngredients) {
        const recipesForIngredient = await fetchRecipesForIngredient(name);
        fetchedRecipes.push(...recipesForIngredient);
      }

      // Remove duplicate recipes
      const uniqueRecipes = Array.from(
        new Map(fetchedRecipes.map((recipe) => [recipe.idMeal, recipe])).values()
      );

      // Fetch details for each unique recipe and calculate probability score
      const detailedRecipes = [];
      for (const recipe of uniqueRecipes) {
        const details = await fetchRecipeDetails(recipe.idMeal);
        if (!details) continue;

        const ingredients = parseIngredients(details);

        // Calculate the probability score based on matching ingredients
        const matchProbability = ingredients.reduce((acc, ingredient) => {
          const matchingIngredient = validIngredients.find(
            (item) => item.name === ingredient.name
          );
          return matchingIngredient
            ? acc * matchingIngredient.probability
            : acc; // Multiply probabilities for matching ingredients
        }, 1);

        detailedRecipes.push({
          ...details,
          ingredients,
          probabilityScore: matchProbability,
        });
      }

      // Sort recipes by probability score (descending)
      detailedRecipes.sort((a, b) => b.probabilityScore - a.probabilityScore);

      setRecipes(detailedRecipes);
    } catch (error) {
      console.error("Error fetching and combining recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [groceryStatus]);

  // Handle recipe selection
  const handleRecipeSelection = (recipe) => {
    const isSelected = selectedRecipes.some((r) => r.idMeal === recipe.idMeal);

    const updatedSelection = isSelected
      ? selectedRecipes.filter((r) => r.idMeal !== recipe.idMeal)
      : [...selectedRecipes, recipe];

    setSelectedRecipes(updatedSelection);
    onRecipeSelection(updatedSelection); // Notify parent
  };

  // Fetch recipes whenever groceryStatus changes
  useEffect(() => {
    fetchAndCombineRecipes();
  }, [fetchAndCombineRecipes]);

  return (
    <div>
      {loading ? (
        <p>Loading recipes...</p>
      ) : recipes.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto p-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.idMeal}
              className="border p-2 rounded-md shadow-md bg-white"
            >
              <input
                type="checkbox"
                checked={selectedRecipes.some((r) => r.idMeal === recipe.idMeal)}
                onChange={() => handleRecipeSelection(recipe)}
                className="form-checkbox h-4 w-4 mr-2"
              />
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-20 object-cover rounded-md mb-1"
              />
              <div>
                <h3 className="font-medium text-sm truncate">{recipe.strMeal}</h3>
                <p className="text-xs text-gray-600">
                  Probability Score: {recipe.probabilityScore.toFixed(2)}
                </p>
                <a
                  href={`https://www.themealdb.com/meal/${recipe.idMeal}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs underline"
                >
                  View Recipe
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No recipes found based on your ingredients.</p>
      )}
    </div>
  );
};

export default RecipeSuggestions;
