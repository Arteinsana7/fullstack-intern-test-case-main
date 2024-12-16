const mongoose = require("mongoose");
const questionSchema = require("../schemas/question-schema"); // Import the question schema

const Question = mongoose.model("Question", questionSchema);

// Export  Question model
module.exports = Question;
