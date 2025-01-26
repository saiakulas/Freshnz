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
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category products', error: error.message });
  }
});

// Get products by farm name
router.get('/farm/:farmName', async (req, res) => {
  try {
    const { farmName } = req.params;
    const products = await Product.find({ farmName });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farm products', error: error.message });
  }
});

export default router;
