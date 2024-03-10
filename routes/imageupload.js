const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('../models/image');
const Like = require('../models/like'); // Import the Like model
const checkAuth = require("./check-auth");

// Set up multer for handling file uploads
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post('/upload-image', checkAuth, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.userData.userId;

    try {
        const imageUrl = req.file.buffer;

        const image = new Image({
            user: userId,
            image: imageUrl,
        });

        await image.save();

        res.json({ message: 'Image uploaded and saved to the database successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/getall', async (req, res) => {
    try {
        const allImages = await Image.find().populate('likes');

        // Map image data to send to the frontend
        const imageResponse = allImages.map(image => ({
            imageId: image._id,
            imageData: image.image.toString('base64'), // Convert Buffer to base64
            likes: image.likes || 0,
        }));

        res.json(imageResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// imageupload.js
// imageupload.js

router.post('/like-image', checkAuth, async (req, res) => {
  const { imageId } = req.body;
  const userId = req.userData.userId;

  try {
    // Check if the user has already liked the image
    const existingLike = await Like.findOne({ user: userId, image: imageId });

    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this image' });
    }

    // Create a new Like document
    const like = new Like({ user: userId, image: imageId });

    // Save the like
    await like.save();

    // Increment the likes count in the Image model
    await Image.findByIdAndUpdate(imageId, { $inc: { likes: 1 } });

    res.json({ message: 'Image liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;




