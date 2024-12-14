const twilio = require("twilio");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createService() {
  try {
    // Check if the service SID already exists in the .env file
    if (process.env.TWILIO_VERIFY_SERVICE_SID) {
      console.log(
        "Verify Service already exists:",
        process.env.TWILIO_VERIFY_SERVICE_SID
      );
      return process.env.TWILIO_VERIFY_SERVICE_SID; // Return existing service SID
    }

    // Create a new service
    const service = await client.verify.v2.services.create({
      friendlyName: "My First Verify Service",
    });

    console.log("Service SID:", service.sid);
    await updateEnvFile(service.sid); // Ensure this is awaited
    return service.sid; // Return the service SID
  } catch (error) {
    console.error("Error creating service:", error);
    throw new Error("Failed to create Twilio Verify service");
  }
}

async function updateEnvFile(serviceSid) {
  try {
    const envFilePath = path.resolve(__dirname, "../.env"); // Ensure correct path

    // Read the current .env file
    const data = await fs.promises.readFile(envFilePath, "utf8");

    // Update or add the TWILIO_VERIFY_SERVICE_SID
    const newEnvData = data
      .split("\n")
      .map((line) => {
        if (line.startsWith("TWILIO_VERIFY_SERVICE_SID=")) {
          return `TWILIO_VERIFY_SERVICE_SID=${serviceSid}`;
        }
        return line;
      })
      .join("\n");

    // If the variable was not in the original file, add it
    if (!data.includes("TWILIO_VERIFY_SERVICE_SID=")) {
      newEnvData += `\nTWILIO_VERIFY_SERVICE_SID=${serviceSid}`;
    }

    // Write the updated .env file
    await fs.promises.writeFile(envFilePath, newEnvData, "utf8");
    console.log(".env file updated with TWILIO_VERIFY_SERVICE_SID");
  } catch (error) {
    console.error("Error updating .env file:", error);
    throw new Error("Failed to update .env file");
  }
}

module.exports = createService; // Export the function
