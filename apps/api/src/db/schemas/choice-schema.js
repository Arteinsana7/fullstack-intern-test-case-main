import mongoose from "mongoose";

const { Schema } = mongoose;

const choiceSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

export default choiceSchema;
