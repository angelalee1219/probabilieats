// Approximate weights for common ingredients
export const APPROXIMATE_WEIGHTS = {
    // Meats
    chicken: { weight: 2.0, uncertainty: 0.5 },
    "chicken breast": { weight: 0.25, uncertainty: 0.05 },
    beef: { weight: 1.0, uncertainty: 0.2 },
    pork: { weight: 1.0, uncertainty: 0.2 },
    fish: { weight: 1.0, uncertainty: 0.3 },
  
    // Vegetables
    tomato: { weight: 0.15, uncertainty: 0.05 },
    onion: { weight: 0.15, uncertainty: 0.03 },
    "garlic clove": { weight: 0.005, uncertainty: 0.001 },
    potato: { weight: 0.2, uncertainty: 0.05 },
    "red pepper": { weight: 0.25, uncertainty: 0.05 },
    carrot: { weight: 0.1, uncertainty: 0.02 },
    broccoli: { weight: 0.5, uncertainty: 0.1 },
    cauliflower: { weight: 0.6, uncertainty: 0.1 },
    spinach: { weight: 0.3, uncertainty: 0.05 },
    zucchini: { weight: 0.2, uncertainty: 0.03 },
    cucumber: { weight: 0.25, uncertainty: 0.05 },
  
    // Fruits
    lime: { weight: 0.07, uncertainty: 0.02 },
    lemon: { weight: 0.1, uncertainty: 0.02 },
    orange: { weight: 0.2, uncertainty: 0.05 },
    apple: { weight: 0.18, uncertainty: 0.05 },
    banana: { weight: 0.12, uncertainty: 0.03 },
  
    // Cheese
    cheese: { weight: 0.25, uncertainty: 0.05 },
    "cheddar cheese": { weight: 0.12, uncertainty: 0.02 },
    "cream cheese": { weight: 0.25, uncertainty: 0.05 },
  
    // Pantry Staples
    flour: { weight: 0.5, uncertainty: 0.05 },
    sugar: { weight: 0.2, uncertainty: 0.02 },
    salt: { weight: 0.3, uncertainty: 0.05 },
    butter: { weight: 0.23, uncertainty: 0.02 },
    rice: { weight: 0.2, uncertainty: 0.02 },
    pasta: { weight: 0.1, uncertainty: 0.02 },
    milk: { weight: 1.0, uncertainty: 0.05 },
  
    // Miscellaneous
    egg: { weight: 0.05, uncertainty: 0.01 },
    honey: { weight: 0.34, uncertainty: 0.03 },
  };
  
  
  // Function to approximate weight with improved sampling and defaults
  export const approximateWeight = (name, quantity = 1) => {
    const entry = APPROXIMATE_WEIGHTS[name.toLowerCase().trim()];
  
    if (entry) {
      const estimatedWeight = (quantity || 1) * entry.weight; // Default to raw count if quantity is missing
      const variance = Math.pow((quantity || 1) * entry.uncertainty, 2);
      const standardDeviation = Math.sqrt(variance);
  
      // Box-Muller Transform for normal distribution
      const randomNormal = () => {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      };
  
      return {
        weight: estimatedWeight,
        variance,
        standardDeviation,
        sample: () => estimatedWeight + randomNormal() * standardDeviation,
      };
    }
  
    // Default fallback for missing entries
    return {
      weight: quantity || 1, // Default to raw count
      variance: 0,
      standardDeviation: 0,
      sample: () => quantity || 1, // Default sample is the raw count
    };
  };
  