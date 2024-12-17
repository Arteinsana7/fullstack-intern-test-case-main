import mongoose from "mongoose";
import questionSchema from "../schemas/question-schema.js";

const Question = mongoose.model("Question", questionSchema);

export default Question;
