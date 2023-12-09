const User = require('../models/user');
const Contact = require('../models/contact');

const { signToken } = require('../auth');
const bcrypt = require('bcrypt');

const listContacts = async () => {
    try {
      return await Contact.find();
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  };
  
  const getContactById = async (id) => {
    try {
      return await Contact.findOne({ _id: id });
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  };
  
  const addContact = async (data) => {
    try {
      return await Contact.create(data);
    } catch (error) {
      console.error("Error adding contact:", error);
      throw error;
    }
  };
  
  const updateContact = async (id, fields) => {
    try {
      return await Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
    } catch (error) {
      console.error(`Error updating contact with ID ${id}:`, error);
      throw error;
    }
  };
  
  const removeContact = async (id) => {
    try {
      return await Contact.findByIdAndRemove({ _id: id });
    } catch (error) {
      console.error(`Error removing contact with ID ${id}:`, error);
      throw error;
    }
  };
  
  const updateStatusContact = async (id, fields) => {
    try {
      return await Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
    } catch (error) {
      console.error(`Error updating status for contact with ID ${id}:`, error);
      throw error;
    }
  };
  
  const createUser = async (userData) => {
    try {
      const user = await User.create(userData);
      const token = signToken({ userId: user._id });
      await User.findByIdAndUpdate(user._id, { token });
      return { user, token };
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
  
      // Check if the user exists and compare passwords
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Email or password is wrong');
      }
  
      // Create a token for the user
      const token = signToken({ userId: user._id });
      await User.findByIdAndUpdate(user._id, { token });
  
      return { user, token };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  
  const registerUser = async (userData) => {
    try {
      // Check if the email is already in use
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email in use');
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
  
      // Create a new user
      const user = await User.create({
        email: userData.email,
        password: hashedPassword,
        subscription: userData.subscription || 'starter',
      });
  
      // Create a token for the user
      const token = signToken({ userId: user._id });
      await User.findByIdAndUpdate(user._id, { token });
  
      return { user, token };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };
  
  
  module.exports = {
    listContacts,
    getContactById,
    addContact,
    updateContact,
    removeContact,
    updateStatusContact,
    createUser,
    registerUser,
    loginUser,
  };