const express = require("express");
const router = express.Router();
const TestModel = require("../models/form_data");
router.post("/user_data", (req, res) => {
  const { name, age, location, subject } = req.body;
  const calculatedAge = new Date().getFullYear() - new Date(age).getFullYear();

  // Create a new document
  const newEntry = new TestModel({
    name,
    age: calculatedAge,
    location,
    subject,
  });

  // Save the document to the database
  newEntry
    .save()
    .then((doc) => {
      console.log("Document saved:", doc);
      res.json(doc);
    })
    .catch((err) => {
      console.error("Error saving document:", err);
      res.status(500).send("Error saving document.");
    });
});

module.exports = router;
