const User = require('../schemas/user'); // Assuming you have a User schema
const { signToken } = require('../auth');
const bcrypt = require('bcrypt');

const createUser = async (userData) => {
  try {
    const { email, password } = userData;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email in use');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      subscription: 'starter', // You can set the default subscription here
    });

    // Generate a JWT token for the new user
    const token = signToken({ userId: newUser._id });

    // Update the user's token in the database
    await User.findByIdAndUpdate(newUser._id, { token });

    return { user: { email: newUser.email, subscription: newUser.subscription }, token };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const loginUser = async (loginData) => {
  try {
    const { email, password } = loginData;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      throw new Error('Invalid credentials');
    }

    // Generate a JWT token for the user
    const token = signToken({ userId: user._id });

    // Update the user's token in the database
    await User.findByIdAndUpdate(user._id, { token });

    return { user: { email: user.email, subscription: user.subscription }, token };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

module.exports = { createUser, loginUser };