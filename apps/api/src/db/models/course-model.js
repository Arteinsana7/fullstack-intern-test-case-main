const mongoose = require("mongoose");
const courseSchema = require("../schemas/course-schema").default; // Import the course schema

// Create the Course model from the schema
const Course = mongoose.model("Course", courseSchema);

// Export  model
module.exports = Course;
