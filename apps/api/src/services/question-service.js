const QuestionModel = require("../db/models/question-model");
const CourseModel = require("../db/models/course-model");

/**
 * Retrieve the list of all questions from a course
 * @returns {Promise<Array<Question>>} List of questions
 */
const getAllByCourse = (courseId) => {
  return QuestionModel.find({ course: courseId });
};

/**
 * Retrieve a question by its ID
 * @param {String} questionId Question ID
 * @returns {Promise<Question>} Question
 */
const getById = (questionId) => {
  return QuestionModel.findById(questionId);
};

/**
 * Create a new question in a specific course
 * @param {Question} question Question properties
 * @returns {Promise<Question>} Created question
 */
const create = async (courseId, question) => {
  const newQuestion = new QuestionModel({
    ...question,
    course: courseId,
  });

  await CourseModel.updateOne(
    { _id: courseId },
    { $addToSet: { questions: newQuestion._id } },
  );

  return newQuestion.save();
};

/**
 * Update a question
 * @param {String} questionId Question ID
 * @param {Object} partialQuestion Question properties to update
 * @returns {Promise<Question>} Updated question
 */
const update = async (questionId, partialQuestion) => {
  try {
    const { title, choices } = partialQuestion;

    // Validate choices if necessary
    if (choices && Array.isArray(choices)) {
      choices.forEach((choice) => {
        if (
          typeof choice.text !== "string" ||
          typeof choice.isCorrect !== "boolean"
        ) {
          throw new Error("Invalid choice format");
        }
      });
    }

    // Update the question using findOneAndUpdate
    const updatedQuestion = await QuestionModel.findOneAndUpdate(
      { _id: questionId },
      { $set: { title, choices } }, // Explicitly update only the title and choices
      { new: true }, // Return the updated document
    );

    // If no question was found, throw an error
    if (!updatedQuestion) {
      throw new Error(`Question with ID ${questionId} not found`);
    }

    return updatedQuestion;
  } catch (err) {
    throw err; // Rethrow the error to be handled by the controller
  }
};

/**
 * Delete a question
 * @param {String} courseId Course ID
 * @param {String} questionId Question ID
 */
const remove = async (courseId, questionId) => {
  await CourseModel.updateOne(
    { _id: courseId },
    { $pull: { questions: questionId } },
  );
  await QuestionModel.deleteOne({ _id: questionId });
};

module.exports = {
  getAllByCourse,
  getById,
  create,
  update,
  remove,
};
