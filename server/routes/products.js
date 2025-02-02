import express from 'express';
import { Product } from '../models/product.js';
import { verifyUser } from './auth.js';

const router = express.Router();

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};


// Add a new product (Admin only)
router.post('/add', verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, discount, product_img_url, category, farmName } = req.body; // farmName included
    const newProduct = new Product({
      name,
      description,
      price,
      discount,
      product_img_url,
      category,
      farmName, // Adding farmName
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category: category });
    if (!products.length) {
      return res.status(404).json({ message: 'No products found in this category' });
    }
    res.status(200).json(products);  // Return the filtered products
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category', error: error.message });
  }
});



// Get all distinct farm names
router.get('/farms', async (req, res) => {
  try {
    const farms = await Product.distinct('farmName');  // Get all unique farm names
    res.status(200).json(farms);  // Return distinct farm names as a list
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farms', error: error.message });
  }
});

// Get products by farm name
router.get('/farm/:farmName', async (req, res) => {
  const { farmName } = req.params;
  try {
    // Fetch products where the farmName matches the requested farm name
    const products = await Product.find({ farmName });
    
    if (!products.length) {
      return res.status(404).json({ message: `No products found from farm: ${farmName}` });
    }
    
    res.status(200).json(products);  // Return the products from the selected farm
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farm products', error: error.message });
  }
});



export default router;
