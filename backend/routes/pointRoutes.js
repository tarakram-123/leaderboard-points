const express = require('express');
const router = express.Router();
const Point = require('../models/Point');
const User = require('../models/User');

// POST /api/points - Claim random points
router.post('/', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Generate random points between 1 and 10
        const randomPoints = Math.floor(Math.random() * 10) + 1;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create new point entry
        const point = new Point({ 
            userId, 
            value: randomPoints 
        });
        await point.save();

        // Update user's total points
        user.totalPoints = (user.totalPoints || 0) + randomPoints;
        await user.save();

        res.status(200).json({ 
            message: 'Points claimed successfully!', 
            points: randomPoints,
            totalPoints: user.totalPoints
        });

    } catch (error) {
        console.error('Error claiming points:', error);
        res.status(500).json({ message: 'Failed to claim points' });
    }
});

// GET /api/points/history/:userId - Get point claim history
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const history = await Point.find({ userId })
            .sort({ timestamp: -1 })
            .limit(50); // Limit to last 50 claims
        
        res.status(200).json(history);
        
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
});

// GET /api/points/leaderboard - Get leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find({})
            .select('name totalPoints')
            .sort({ totalPoints: -1 })
            .limit(100); // Top 100 users
        
        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            name: user.name,
            totalPoints: user.totalPoints || 0
        }));
        
        res.status(200).json(leaderboard);
        
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
});

module.exports = router;