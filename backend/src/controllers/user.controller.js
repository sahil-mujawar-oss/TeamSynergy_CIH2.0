const User = require('../models/user.model');

/**
 * Get current user's profile
 */
exports.getProfile = async (req, res) => {
  try {
    // Get user from database (exclude password)
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  const { name, avatar } = req.body;
  
  // Build profile update object
  const profileFields = {};
  if (name) profileFields.name = name;
  if (avatar) profileFields.avatar = avatar;
  
  try {
    // Update user profile
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * Connect wallet address to user account
 */
exports.connectWallet = async (req, res) => {
  const { walletAddress } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }
  
  try {
    // Check if wallet address is already connected to another account
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(400).json({ message: 'Wallet address already connected to another account' });
    }
    
    // Update user with wallet address
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { walletAddress } },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
