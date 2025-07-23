const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({})
            .select('name totalPoints')
            .sort({ totalPoints: -1 });
        
        res.status(200).json(users);
        
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// POST /api/users - Create new user
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const trimmedName = name.trim();
        
        // Check if user already exists (case-insensitive)
        const existingUser = await User.findOne({ 
            name: new RegExp(`^${trimmedName}$`, 'i')
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User with this name already exists' });
        }

        const user = new User({ 
            name: trimmedName,
            totalPoints: 0
        });
        
        await user.save();
        
        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: user._id,
                name: user.name,
                totalPoints: user.totalPoints
            }
        });
        
    } catch (error) {
        console.error('Error creating user:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User with this name already exists' });
        }
        
        res.status(500).json({ message: 'Failed to create user' });
    }
});

// GET /api/users/:id - Get specific user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
        
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
});

module.exports = router;