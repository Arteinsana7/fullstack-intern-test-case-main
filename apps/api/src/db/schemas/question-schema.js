const mongoose = require("mongoose");
const choiceSchema = require("./choice-schema");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to the Course model
    },
    title: {
      type: String,
      required: true,
    },
    choices: [choiceSchema], // Array of choices
  },
  { timestamps: true }
);

module.exports = questionSchema;
