const mongoose = require("mongoose");
const { Schema } = mongoose;

// Function to generate a random code (6 characters long)
const generateCourseCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Define the course schema
const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 256,
    },
    code: {
      type: String,
      unique: true, // Ensure the code is unique
      required: true,
      default: generateCourseCode, // Automatically generate a code if not provided
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true }
);

// You can also add a pre-save hook to ensure that the `code` is set properly before saving
courseSchema.pre("save", function (next) {
  if (!this.code) {
    this.code = generateCourseCode(); // Generate a code if not already present
  }
  next();
});

// Export the schema
module.exports = courseSchema;
