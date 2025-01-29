import express from 'express';
import Cart from '../models/cart.js';
import Wishlist from '../models/wishlist.js';
import Product from '../models/product.js'; // Assuming you have a Product model
import { verifyUser } from './auth.js';

const router = express.Router();

// Add product to cart
router.post('/cart/add', verifyUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
      if (productIndex === -1) {
        cart.products.push({ productId, quantity });
      } else {
        cart.products[productIndex].quantity += quantity;
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to cart', error: error.message });
  }
});

// Delete product from cart
router.delete('/cart/remove/:productId', verifyUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from cart', error: error.message });
  }
});

// Checkout and handle billing
router.post('/cart/checkout', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      totalPrice += product.price * item.quantity;
    }

    // Example of billing process
    // This could involve payment processing, such as Stripe or PayPal

    res.status(200).json({ message: 'Checkout successful', totalPrice });
  } catch (error) {
    res.status(500).json({ message: 'Error during checkout', error: error.message });
  }
});

// Add to wishlist
router.post('/wishlist/add', verifyUser, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [{ productId }] });
    } else {
      const productExists = wishlist.products.some(item => item.productId.toString() === productId);
      if (!productExists) {
        wishlist.products.push({ productId });
      }
    }

    await wishlist.save();
    res.status(200).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to wishlist', error: error.message });
  }
});

// Remove from wishlist
router.delete('/wishlist/remove/:productId', verifyUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(item => item.productId.toString() !== productId);
    await wishlist.save();

    res.status(200).json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from wishlist', error: error.message });
  }
});

export default router;
