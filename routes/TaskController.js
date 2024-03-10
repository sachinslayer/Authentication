const express = require('express');
const router = express.Router();
const Task=require('../models/Task')

router.post('/create-task', async (req, res) => {
    try {
      // Create a new task (example data)
      const task = new Task({
        title: 'Meme Task',
        description: 'You have to create a meme and upload the picture of it.This competition is between 2 people you and your opponent,We will show this to our audience,The audience will like your post.Most liked post will win the contest',
        rules: 'Meme should be new otherwise no prize is going to be issue',
      });
      await task.save();
  
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  router.get('/tasks', async (req, res) => {
    try {
      // Retrieve all tasks from the database
      const tasks = await Task.find();
  
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
    


module.exports = router;