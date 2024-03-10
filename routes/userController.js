const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const crypto = require('crypto'); // Required for generating a unique token
const nodemailer = require('nodemailer'); // Required for sending emails
// Access your secret key from the environment variables
const jwtSecret = process.env.JWT_SECRET;
const password = process.env.password;
const gmail = process.env.gmail;

// User sign-up
router.post("/register", async (req, res) => {
  try {
    // Get user input
    const { username, email, password } = req.body;

    // Validate user input
    if (!(email && password && username)) {
      return res.status(400).send("All input is required");
    }

    // Check if user already exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      username,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      jwtSecret,
      {
        expiresIn: "2h",
      }
    );

    // Return new user
    return res.status(201).json({ token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exists in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { userId: user._id, email: user.email, username: user.username },
        jwtSecret,
        {
          expiresIn: "2h",
        }
      );

      // Send token in response
      return res.status(200).json({ token: token });
    }
    return res.status(400).send("Wrong Email or Password");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

const transporter = nodemailer.createTransport({
  // Configure your email service here
  // Example using Gmail:
  service: 'Gmail',
  auth: {
    user: gmail, // Your email address
    pass: password, // Your email password (consider using environment variables)
    secure: true,
    port:4200
  }
});

// Route for initiating the password reset process
router.post('/forgot-password', async (req, res) => {
  try {
    // Get the user's email from the request body
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Generate a unique reset token for password reset
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set an expiration time for the reset token (e.g., 1 hour)
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour in milliseconds

    // Update the user's record with the reset token and expiration time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiration;
    await user.save();

    // Send an email to the user with a link to reset their password
    const resetLink = `http://localhost:4200/reset-password/${resetToken}`;


    const mailOptions = {
      from: gmail, // Your email address
      to: user.email, // User's email address
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) requested a password reset for your account.\n\n
             Please click on the following link or paste it into your browser to reset your password:\n\n
             ${resetLink}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error sending email');
      }
      console.log('Password reset email sent:', info.response);
      res.status(200).json({ message: 'Password reset email sent' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for resetting the password using the reset token
router.post('/reset-password', async (req, res) => {
  try {
    // Get the reset token and new password from the request body
    const { resetToken, newPassword } = req.body;

    // Find the user by the reset token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({message:'Invalid or expired reset token',resetToken});
    }
     // Check if the token has already been used
     if (user.resetPasswordUsed) {
      console.error('Reset token has already been used:', resetToken);
      return res.status(400).send('Reset token has already been used');
    }

    // Mark the token as used (to prevent multiple uses)
    user.resetPasswordUsed = true;

    // Encrypt the new password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = encryptedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();



    // Return a success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
