import mongoose from "mongoose";
import choiceSchema from "./choice-schema.js";
const { Schema } = mongoose;

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

export default questionSchema;
