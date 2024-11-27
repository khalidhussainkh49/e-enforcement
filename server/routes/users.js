import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user location history
router.get('/:userId/locations', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For demo purposes, generate some mock history
    const history = Array.from({ length: 10 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000),
      location: {
        lat: user.location.lat + (Math.random() - 0.5) * 0.1,
        lng: user.location.lng + (Math.random() - 0.5) * 0.1
      }
    }));

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user location
router.put('/location', async (req, res) => {
  try {
    const { location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        location,
        lastActive: new Date()
      },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status
router.put('/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        status,
        lastActive: new Date()
      },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;