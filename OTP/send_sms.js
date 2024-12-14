// require("dotenv").config();

// const twilio = require("twilio");
// const readline = require("readline").createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// // Ensure all required environment variables are present
// if (
//   !process.env.TWILIO_ACCOUNT_SID ||
//   !process.env.TWILIO_AUTH_TOKEN ||
//   !process.env.TWILIO_VERIFY_SERVICE_SID
// ) {
//   console.error("Missing Twilio configuration. Check your .env file.");
//   process.exit(1);
// }

// // Create Twilio client correctly
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// function sendVerificationCode(phoneNumber) {
//   return client.verify.v2
//     .services(process.env.TWILIO_VERIFY_SERVICE_SID)
//     .verifications.create({
//       to: phoneNumber,
//       channel: "sms",
//     })
//     .then((verification) => {
//       console.log(`Verification code sent to ${phoneNumber}`);
//       return verification.status;
//     })
//     .catch((error) => {
//       console.error("Error sending verification code:", error);
//       throw error;
//     });
// }

// function checkVerification(phoneNumber, code) {
//   return client.verify.v2
//     .services(process.env.TWILIO_VERIFY_SERVICE_SID)
//     .verificationChecks.create({
//       to: phoneNumber,
//       code: code,
//     })
//     .then((verificationCheck) => {
//       return verificationCheck.status;
//     })
//     .catch((error) => {
//       console.error("Error checking verification:", error);
//       throw error;
//     });
// }

// const verifyUser = async function (phoneNumber) {
//   try {
//     // Send verification code
//     const sendStatus = await sendVerificationCode(phoneNumber);

//     if (sendStatus === "pending") {
//       // Prompt user to enter verification code
//       readline.question("Enter the verification code: ", async (code) => {
//         try {
//           const checkStatus = await checkVerification(phoneNumber, code);

//           if (checkStatus === "approved") {
//             console.log("User verified successfully");
//           } else {
//             console.log("Verification failed");
//           }

//           readline.close();
//         } catch (checkError) {
//           console.error("Verification check error:", checkError);
//           readline.close();
//         }
//       });
//     } else {
//       console.log("Error sending verification code");
//       readline.close();
//     }
//   } catch (error) {
//     console.error("Verification process error:", error);
//     readline.close();
//   }
// };

// // Example usage
// verifyUser("+917054396386"); // Replace with actual phone number

// module.exports = verifyUser;

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express.Router();
app.use(bodyParser.json());

// Twilio configuration
if (
  !process.env.TWILIO_ACCOUNT_SID ||
  !process.env.TWILIO_AUTH_TOKEN ||
  !process.env.TWILIO_VERIFY_SERVICE_SID
) {
  console.error("Missing Twilio configuration. Check your .env file.");
  process.exit(1);
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Endpoint to send OTP
app.post("/api/auth/get-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    return res
      .status(200)
      .json({ message: `OTP sent to ${phone}`, status: verification.status });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
});

// Endpoint to verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required" });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    if (verificationCheck.status === "approved") {
      // Generate a token (if required for further authentication)
      const token = "sample-auth-token"; // Replace with a real token from your auth logic
      return res
        .status(200)
        .json({ message: "OTP verified successfully", token });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ message: "Failed to verify OTP", error: error.message });
  }
});

// Start the server
module.exports = app;
