require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const dbURL = process.env.DB_URL

const mongoose = require('mongoose');
const cors=require('cors')
const User = require('./models/UserModel'); // Import the User model



mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;


db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
const authRoutes = require('./routes/userController');
app.use('/api/auth', authRoutes);


const checkAuth = require("./routes/check-auth");
// Profile route
app.get("/profile", checkAuth, async (req, res) => {
  // Access user data from req.userData
  const { email, userId, username } = req.userData;
  
  try {
    // Fetch user profile data from the database
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Extract the profile data you need from the user document
    const userProfileData = {
      username: user.username,
      username: user.username,
      username: user.username,
      email: user.email,
      
      // Add more fields as needed
    };
    
    // Respond with the user's profile data
    res.json({ message: "Profile accessed successfully!", email, userId, username, profileData: userProfileData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const taskRoutes=require('./routes/TaskController')
app.use('/task', taskRoutes);


const contestRoutes = require('./routes/contest');
app.use('/api', contestRoutes);



const ImageRoutes = require('./routes/imageupload');
app.use('/api', ImageRoutes);





// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
