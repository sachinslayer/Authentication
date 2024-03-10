const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest'); // Import the Contest model




router.post('/contest', async (req, res) => {
    try {
      const { name, entryFee, prizePool} = req.body;
  
      // Ensure you have user information from req.user after authentication
  
      const contest = new Contest({
        name,
        entryFee,
        prizePool,
  
        
      });
  
      await contest.save();
      res.json({ message: 'Contest created successfully', contest });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  // GET request to retrieve all contests
router.get('/contests', async (req, res) => {
    try {
      const contests = await Contest.find(); // Retrieve all contests from the database
      res.json(contests);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  


module.exports = router;
