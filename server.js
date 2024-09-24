const express = require("express");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db"); // Assuming your connectDB is correctly set up.
const user_data = require("./routes/user_data");
const axios = require('axios');

const app = express();
const mongoose = require("mongoose");

app.use(express.static("public"));
app.use(express.json());

// MongoDB connection
connectDB(); // Call this instead of mongoose.connect directly

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (like login.html, signup.html) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Default route for the home page after login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/welcome", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "welcome.html"));
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/user", user_data);

// Your WeatherAPI key
const weatherApiKey = '35ecd18235524c63b7594841242409'; // Replace with your API key

// Create a route to fetch weather data for Dehradun
app.get('/weather', async (req, res) => {
  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=Dehradun`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
