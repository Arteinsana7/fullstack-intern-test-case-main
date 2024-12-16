const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 256, // Limit description to 256 characters
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question", // Reference to the Question model
      },
    ],
  },
  { timestamps: true }
);

module.exports = courseSchema;
