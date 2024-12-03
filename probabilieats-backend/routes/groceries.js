const express = require('express');
const Grocery = require('../models/Grocery');
const router = express.Router();

// Get all groceries
router.get('/', async (req, res) => {
  try {
    const groceries = await Grocery.find();
    res.json(groceries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groceries' });
  }
});

// Add a new grocery
router.post('/', async (req, res) => {
  try {
    const { name, barcode, expirationDate, typicalShelfLife, quantity } = req.body;
    const newGrocery = new Grocery({ name, barcode, expirationDate, typicalShelfLife, quantity });
    await newGrocery.save();
    res.status(201).json(newGrocery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add grocery' });
  }
});

// Update a grocery item
router.put('/:id', async (req, res) => {
  try {
    const updatedGrocery = await Grocery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGrocery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update grocery' });
  }
});

// Delete a grocery item
router.delete('/:id', async (req, res) => {
  try {
    await Grocery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grocery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete grocery' });
  }
});

module.exports = router;
