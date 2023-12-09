const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');


const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
router.post('/signup', async (req, res, next) => {
  try {
    // Validate request body
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      subscription: 'starter',
      owner: null, // You may set the owner based on your logic
    });

    // Respond with success
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});
router.post('/login', async (req, res, next) => {
    try {
      // Validate request body
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Email or password is wrong' });
      }
  
      // Create and sign a JWT token
      const token = jwt.sign({ userId: user._id }, 'your-secret-key'); // Replace with your secret key
  
      // Update the user's token in the database
      await User.findByIdAndUpdate(user._id, { token });
  
      // Respond with success
      res.status(200).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (error) {
      next(error);
    }
  });
  router.patch('/', authenticateToken, async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const userId = req.user._id;

    // Validate the subscription value
    if (!['starter', 'pro', 'business'].includes(subscription)) {
      return res.status(400).json({ message: 'Invalid subscription value' });
    }

    // Update the user's subscription
    const updatedUser = await User.findByIdAndUpdate(userId, { subscription }, { new: true });

    res.status(200).json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;