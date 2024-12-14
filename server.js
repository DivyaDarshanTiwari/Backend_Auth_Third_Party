// const express = require("express");
// const path = require("path");
// require("dotenv").config();
// const connectDB = require("./config/db"); // Assuming your connectDB is correctly set up.
// const user_data = require("./routes/user_data");
// const axios = require("axios");
// const {
//   authMiddleware,
//   roleMiddleware,
// } = require("./middleware/authMiddleware");
// // const createService = require("./OTP/Service_SID_creator"); // Ensure this import is correct
// // const sendVerificationCode = require("./OTP/send_sms"); // Renamed for clarity
// // const checkVerification = require("./OTP/send_sms"); // This will hold the function to check verification

// const app = express();
// const mongoose = require("mongoose");
// const { required } = require("joi");

// app.use(express.static("public"));
// app.use(express.json());

// // MongoDB connection
// connectDB(); // Call this instead of mongoose.connect directly

// // Serve static files (like login.html, signup.html) from the "public" folder
// app.use(express.static(path.join(__dirname, "public")));

// // Default route for the home page after login
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "login.html"));
// });

// app.get("/welcome", authMiddleware, (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "welcome.html"));
// });

// // Endpoint to generate OTP
// // app.post("/otp", async (req, res) => {
// //   const { phoneNumber } = req.body; // Get the phone number from request body
// //   try {
// //     const serviceSid = await createService(); // Wait for service creation
// //     console.log("Next, send OTP");
// //     const status = await sendVerificationCode(phoneNumber);
// //     if (status === "pending") {
// //       res.status(200).send('Verification code sent.');
// //     } else {
// //       res.status(400).send('Error sending verification code.');
// //     }
// //   } catch (error) {
// //     console.error("Error during OTP process:", error);
// //     res.status(500).send("Error verifying user");
// //   }
// // });

// // // Endpoint to verify OTP
// // app.post("/verify", async (req, res) => {
// //   const { phoneNumber, otp } = req.body; // Get phone number and OTP from request body
// //   try {
// //     const status = await checkVerification(phoneNumber, otp);
// //     if (status === "approved") {
// //       res.status(200).send('User verified.');
// //     } else {
// //       res.status(400).send('User not verified.');
// //     }
// //   } catch (error) {
// //     console.error("Error during verification process:", error);
// //     res.status(500).send("Error verifying user");
// //   }
// // });

// // Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/user", user_data);

// // Your WeatherAPI key
// const weatherApiKey = ""; // Replace with your API key

// // Create a route to fetch weather data for Dehradun
// app.get("/weather", async (req, res) => {
//   try {
//     const response = await axios.get(
//       `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=Dehradun`
//     );
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching weather data:", error);
//     res.status(500).json({ error: "Error fetching weather data" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db"); // Assuming your connectDB is correctly set up.
const user_data = require("./routes/user_data");
const axios = require("axios");
const { authMiddleware } = require("./middleware/authMiddleware");
const Otp_route = require("./OTP/send_sms");
const app = express();
const mongoose = require("mongoose");

app.use(express.static("public"));
app.use(express.json());

// MongoDB connection
connectDB(); // Call this instead of mongoose.connect directly

// Serve static files (like login.html, signup.html) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Default route for the home page after login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/welcome", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "welcome.html"));
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/user", user_data);
app.use("/OTP", Otp_route);

// Your WeatherAPI key
const weatherApiKey = "35ecd18235524c63b7594841242409"; // Replace with your API key

// Create a route to fetch weather data for Dehradun
app.get("/weather", async (req, res) => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=Dehradun`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
