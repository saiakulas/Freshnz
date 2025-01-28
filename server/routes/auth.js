import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/users.js';

const router = express.Router();

// Middleware to verify user token
const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer
    if (!token) {
      return res.status(401).json({ status: false, message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user information to the request object
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: 'Invalid token.' });
  }
};


  

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      userRole: user.isAdmin ? 'admin' : 'user',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});


// Logout Route
router.post('/logout', (req, res) => {
  // Invalidate token (client-side responsibility to delete the token)
  res.status(200).json({ message: 'Logout successful' });
});
export { verifyUser };

export default router;
