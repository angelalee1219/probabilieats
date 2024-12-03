const express = require('express');
const axios = require('axios');
const router = express.Router();
const Barcode = require('../models/Barcode'); // Import the Barcode model

// Debugging middleware: Logs every request
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

// Route to fetch product details by barcode
router.get('/:barcode', async (req, res) => {
  const barcode = req.params.barcode.trim(); // Trim the barcode for sanitization

  try {
    // Query Open Food Facts API
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);

    if (response.data.status === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = response.data.product;
    res.json({
      name: product.product_name || 'Unknown Product',
      expirationDate: product.expiration_date || null,
      barcode: product.code,
    });
  } catch (error) {
    console.error('Error fetching product from Open Food Facts:', error.message);
    res.status(500).json({ error: 'Failed to fetch product data' });
  }
});

// Route to save or update a product's expiration date
router.post('/save', async (req, res) => {
  try {
    const { barcode, name, expirationDate } = req.body;

    // Validate input
    if (!barcode || !name || !expirationDate) {
      console.error('Missing fields in request:', req.body);
      return res.status(400).json({ error: 'Barcode, name, and expiration date are required' });
    }

    // Trim and sanitize input
    const sanitizedBarcode = barcode.trim();

    // Check if the barcode already exists in the database
    let product = await Barcode.findOne({ barcode: sanitizedBarcode });

    if (product) {
      // Update existing product
      product.expirationDate = expirationDate;
      product.name = name || product.name; // Only update the name if provided
      product.inFridge = true; // Mark as in fridge
    } else {
      // Create a new product
      product = new Barcode({
        barcode: sanitizedBarcode,
        name,
        expirationDate,
        inFridge: true, // Mark as in fridge
      });
    }

    // Save to the database
    await product.save();
    console.log('Saved product:', product);
    res.json(product); // Respond with the saved product
  } catch (error) {
    console.error('Error saving product:', error.message);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// Route to fetch all items currently in the fridge
router.get('/', async (req, res) => {
  try {
    const items = await Barcode.find({ inFridge: true }); // Fetch only items in the fridge

    const updatedItems = items.map((item) => {
      let daysLeft = 'Unknown';

      if (item.expirationDate) {
        const expirationDate = new Date(item.expirationDate);
        const today = new Date();
        const differenceInTime = expirationDate - today;

        // Calculate days left
        daysLeft = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
        daysLeft = daysLeft > 0 ? daysLeft : 'Expired'; // Handle expired items
      }

      return { ...item._doc, daysLeft }; // Add daysLeft to the item response
    });

    res.json(updatedItems); // Respond with the updated items
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Route to delete an item by barcode
router.delete('/:barcode', async (req, res) => {
  try {
    const sanitizedBarcode = req.params.barcode.trim(); // Trim the barcode

    // Attempt to delete the item from the database
    const result = await Barcode.deleteOne({ barcode: sanitizedBarcode });
    if (result.deletedCount === 0) {
      console.error('Item not found for deletion:', sanitizedBarcode);
      return res.status(404).json({ error: 'Item not found' });
    }

    console.log('Deleted item with barcode:', sanitizedBarcode);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Route to save multiple items
router.post('/save-multiple', async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      console.error('Invalid items array:', req.body);
      return res.status(400).json({ error: 'Items array is required' });
    }

    const savedItems = [];

    for (const item of items) {
      const { barcode, name, expirationDate } = item;

      if (!barcode || !expirationDate) {
        console.warn('Skipping invalid item:', item);
        continue;
      }

      const sanitizedBarcode = barcode.trim(); // Sanitize barcode
      let product = await Barcode.findOne({ barcode: sanitizedBarcode });

      if (product) {
        product.expirationDate = expirationDate;
        product.name = name || product.name;
      } else {
        product = new Barcode({ barcode: sanitizedBarcode, name, expirationDate });
      }

      await product.save();
      savedItems.push(product);
    }

    console.log('Saved multiple items:', savedItems);
    res.json(savedItems);
  } catch (error) {
    console.error('Error saving multiple items:', error.message);
    res.status(500).json({ error: 'Failed to save multiple items' });
  }
});

module.exports = router;
