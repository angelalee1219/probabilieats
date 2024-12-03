import { approximateWeight } from "../utils/approximateWeights";
const UNIT_CONVERSIONS = {
  g: 0.001,
  kg: 1,
  oz: 0.0283495,
  lb: 0.453592,
  none: 1, // Assuming raw counts are directly converted using approximate weight
};

export const convertToKilograms = (quantity, unit, name = "") => {
  const normalizedUnit = unit.toLowerCase().trim();

  if (UNIT_CONVERSIONS[normalizedUnit]) {
    return quantity * UNIT_CONVERSIONS[normalizedUnit];
  }

  // If the unit is "None", use an approximate weight for raw counts
  const approxWeight = approximateWeight(name);
  if (approxWeight?.weight) {
    return quantity * approxWeight.weight;
  }

  throw new Error(`Unknown unit for conversion: ${unit}`);
};
export const calculateImpact = (selectedRecipes, groceryStatus, numSimulations = 1000) => {
  const CO2_EMISSION_FACTOR = 2.5;

  let totalPotentialWaste = 0;
  let totalPotentialCO2 = 0;
  let expiredFoodLoss = 0;
  let expiredCO2Loss = 0;

  const simulations = [];

  console.log("Starting Impact Calculation...");

  // Step 1: Handle expired items
  groceryStatus.forEach((groceryItem) => {
    const groceryWeightInKg = convertToKilograms(groceryItem.quantity, groceryItem.unit, groceryItem.name);

    if (typeof groceryItem.daysLeft === 'string' && groceryItem.daysLeft === 'Expired') {
      // Handle explicitly labeled expired items
      console.log(`Expired item detected: ${groceryItem.name}`);
      expiredFoodLoss += groceryWeightInKg;
      expiredCO2Loss += groceryWeightInKg * CO2_EMISSION_FACTOR;
    
      // Add to potential waste and CO2
      totalPotentialWaste += groceryWeightInKg;
      totalPotentialCO2 += groceryWeightInKg * CO2_EMISSION_FACTOR;
    } else if (typeof groceryItem.daysLeft === 'number' && groceryItem.daysLeft <= 0) {
      // Handle numeric daysLeft that are less than or equal to 0
      console.log(`Expired item detected based on daysLeft: ${groceryItem.name}`);
      expiredFoodLoss += groceryWeightInKg;
      expiredCO2Loss += groceryWeightInKg * CO2_EMISSION_FACTOR;
    
      // Add to potential waste and CO2
      totalPotentialWaste += groceryWeightInKg;
      totalPotentialCO2 += groceryWeightInKg * CO2_EMISSION_FACTOR;
    }
    
  });

  // Step 2: Simulate recipe usage
  for (let i = 0; i < numSimulations; i++) {
    let simFoodSaved = 0;
    let simCO2Saved = 0;

    selectedRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const ingredientName = ingredient.name.toLowerCase().trim();

        // Match ingredient with grocery status
        const groceryItem = groceryStatus.find(
          (item) => item.name.toLowerCase().trim() === ingredientName && item.daysLeft > 0
        );

        // Skip if the ingredient is not in grocery status or expired
        if (!groceryItem) {
          return; // Continue to the next ingredient
        }

        // Calculate the weight for the matched grocery item
        const groceryWeightInKg = convertToKilograms(groceryItem.quantity, groceryItem.unit, groceryItem.name);

        // Calculate the recipe weight
        const recipeWeightInKg = ingredient.quantity
          ? convertToKilograms(ingredient.quantity, ingredient.unit, ingredient.name)
          : approximateWeight(ingredient.name).weight;

        // Add variability to the sampled weight
        const approx = approximateWeight(ingredient.name, ingredient.quantity || 1);
        const sampledWeight =
          approx.sample ? approx.sample() * (1 + (Math.random() - 0.5) * 0.2) : recipeWeightInKg;

        console.log(`Simulation ${i + 1} - Sampled Weight for ${ingredient.name}: ${sampledWeight}`);

        const savedQuantity = Math.min(groceryWeightInKg, sampledWeight);
        const savedCO2 = (savedQuantity / 1) * CO2_EMISSION_FACTOR;

        simFoodSaved += savedQuantity;
        simCO2Saved += savedCO2;

        totalPotentialWaste += recipeWeightInKg - savedQuantity;
        totalPotentialCO2 += (recipeWeightInKg - savedQuantity) * CO2_EMISSION_FACTOR;
      });
    });

    console.log(`Simulation ${i + 1}: Food Saved = ${simFoodSaved} kg, CO₂ Saved = ${simCO2Saved} kg`);
    simulations.push({
      simFoodSaved,
      simCO2Saved,
    });
  }

  // Step 3: Calculate mean and standard deviation
  const foodSavedValues = simulations.map((sim) => sim.simFoodSaved);
  const co2SavedValues = simulations.map((sim) => sim.simCO2Saved);

  const meanFoodSaved = foodSavedValues.reduce((a, b) => a + b, 0) / numSimulations;
  const meanCO2Saved = co2SavedValues.reduce((a, b) => a + b, 0) / numSimulations;

  const stdDevFoodSaved = Math.sqrt(
    foodSavedValues.reduce((sum, value) => sum + Math.pow(value - meanFoodSaved, 2), 0) /
      numSimulations
  );
  const stdDevCO2Saved = Math.sqrt(
    co2SavedValues.reduce((sum, value) => sum + Math.pow(value - meanCO2Saved, 2), 0) /
      numSimulations
  );

  // Step 4: Adjust totals to include expired items' contribution
  const totalFoodSaved = meanFoodSaved - expiredFoodLoss; // Subtract expired food
  const totalCO2Saved = meanCO2Saved - expiredCO2Loss; // Subtract expired CO₂

  console.log("Final Results:");
  console.log("Mean Food Saved:", totalFoodSaved, "kg");
  console.log("Mean CO2 Saved:", totalCO2Saved, "kg");
  console.log("Total Potential Waste:", totalPotentialWaste, "kg");
  console.log("Total Potential CO2:", totalPotentialCO2, "kg");

  return {
    meanFoodSaved: totalFoodSaved,
    meanCO2Saved: totalCO2Saved,
    stdDevFoodSaved,
    stdDevCO2Saved,
    totalPotentialWaste,
    totalPotentialCO2,
  };
};
