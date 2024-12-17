import mongoose from "mongoose";
import courseSchema from "../schemas/course-schema.js";

// Create the Course model from the schema
const Course = mongoose.model("Course", courseSchema);

// Export model
export default Course;
