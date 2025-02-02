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

router.delete('/wishlist/remove/:productId', verifyUser, async (req, res) => {
  try {
    const { productId } = req.params; // Extract productId from URL
    const userId = req.user.id; // Extract user ID from token

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Debugging logs
    console.log(`User ID: ${userId}`);
    console.log(`Removing product ID: ${productId}`);
    console.log('Wishlist before removal:', wishlist.products);

    // Ensure productId is a string for comparison
    const newProducts = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );

    // If no change, return error message
    if (newProducts.length === wishlist.products.length) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    wishlist.products = newProducts; // Update wishlist products array

    await wishlist.save(); // ✅ Ensure changes are saved in DB

    console.log('Wishlist after removal:', wishlist.products); // Debugging log

    res.status(200).json({ message: 'Product removed from wishlist', wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get user's cart
router.get('/cart', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId })
      .populate('products.productId', 'name price  product_img_url') // Populate product details
      .exec();
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    res.json(cart); // Send populated cart data
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});


// Get user's wishlist
// Fetch wishlist with populated product details
router.get('/wishlist', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the wishlist for the current user and populate the product details
    const wishlist = await Wishlist.findOne({ userId })
      .populate('products.productId', 'name price  product_img_url')  // Populate with name and price of the product
      .exec();

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json(wishlist); // Return populated wishlist
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
});
// Increment product quantity in the cart
router.put('/cart/increment/:productId', verifyUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Increment the quantity
    cart.products[productIndex].quantity += 1;
    await cart.save();

    res.status(200).json({ message: 'Product quantity incremented', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing product quantity', error: error.message });
  }
});

// Decrement product quantity in the cart
router.put('/cart/decrement/:productId', verifyUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Ensure quantity doesn't go below 1
    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    } else {
      return res.status(400).json({ message: 'Cannot decrement quantity below 1' });
    }

    await cart.save();
    res.status(200).json({ message: 'Product quantity decremented', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error decrementing product quantity', error: error.message });
  }
});



export default router;
