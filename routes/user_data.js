const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

// Schema and Model
const Schema = mongoose.Schema;

const testSchema = new Schema({
  name: String,
  age: String,
  location: String,
  address: String,
  subject: String,
  photo: {
    data: Buffer, // Store image data in a buffer
    contentType: String,
  },
  path: String, // Store file path
});

const TestModel = mongoose.model("TestModel", testSchema);

// Multer setup for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads"); // Define the upload folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create the folder if it doesn't exist
    }
    cb(null, uploadPath); // Save the file in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({
  storage: storage, // Use disk storage
  limits: {
    fileSize: 500 * 1024, // Limit file size to 500 KB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/pjpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG files are allowed"), false);
    }
    cb(null, true); // Accept the file
  },
});

// POST endpoint for uploading and saving user data
router.post("/user_data", upload.single("file"), (req, res) => {
  const { name, age, location, address, subject } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send("Image file is required.");
  }

  // Create a new entry in the database
  const newEntry = new TestModel({
    name,
    age,
    location,
    address,
    subject,
    photo: {
      data: file.buffer, // Save the file buffer
      contentType: file.mimetype,
    },
    path: file.path, // Store the file path
  });

  // Save the document to the database
  newEntry
    .save()
    .then((doc) => {
      console.log("Document saved:", doc);
      res.send(`
        <h1>
        To download the file type
        http://localhost:5000/user/download/${doc._id}
        </h1>
        `)
    })
    .catch((err) => {
      console.error("Error saving document:", err);
      res.status(500).json({ error: "Error saving document." });
    });
});

// Endpoint to download the file using the path
router.get("/download/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Find the document by its ID
    const record = await TestModel.findById(id);
    if (!record) {
      return res.status(404).send("No record found with that ID");
    }

    const filePath = record.path; // Get the file path

    // Send the file to the client
    res.download(filePath, (err) => {
      if (err) {
        return res.status(500).send("Error downloading the file");
      }
      else{
        return res.status(200).send("The image has be downloaded");
      }
    });
  } catch (error) {
    res.status(500).send("Error retrieving data: " + error.message);
  }
});

module.exports = router;
