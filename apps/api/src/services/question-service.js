import QuestionModel from "../db/models/question-model.js"; // ESM import for Question model
import CourseModel from "../db/models/course-model.js"; // ESM import for Course model

/**
 * Retrieve the list of all questions from a course
 * @param {String} courseId Course ID
 * @returns {Promise<Array<Object>>} List of questions
 */
const getAllByCourse = async (courseId) => {
  const questions = await QuestionModel.find({ course: courseId });
  return questions;
};

/**
 * Retrieve a question by its ID
 * @param {String} questionId Question ID
 * @returns {Promise<Object>} Question
 */
const getById = async (questionId) => {
  const question = await QuestionModel.findById(questionId);
  return question;
};

/**
 * Create a new question in a specific course
 * @param {String} courseId Course ID
 * @param {Object} question Question properties
 * @returns {Promise<Object>} Created question
 */
const create = async (courseId, question) => {
  const newQuestion = new QuestionModel({
    ...question,
    course: courseId,
  });

  // Update course with the new question ID
  await CourseModel.updateOne(
    { _id: courseId },
    { $addToSet: { questions: newQuestion._id } }
  );

  // Save the new question and return it
  const savedQuestion = await newQuestion.save();
  return savedQuestion;
};

/**
 * Update a question
 * @param {String} questionId Question ID
 * @param {Object} partialQuestion Question properties to update
 * @returns {Promise<Object>} Updated question
 */
const update = async (questionId, partialQuestion) => {
  // Update question by its ID
  await QuestionModel.findOneAndUpdate(
    { _id: questionId },
    {
      $set: { ...partialQuestion },
      upsert: true, // Create if not found
    }
  );

  // Return the updated question
  const updatedQuestion = await QuestionModel.findById(questionId);
  return updatedQuestion;
};

/**
 * Delete a question
 * @param {String} courseId Course ID
 * @param {String} questionId Question ID
 * @returns {Promise<void>}
 */
const remove = async (courseId, questionId) => {
  // Remove the question from the course's question list
  await CourseModel.updateOne(
    { _id: courseId },
    { $pull: { questions: questionId } }
  );

  // Delete the question
  await QuestionModel.deleteOne({ _id: questionId });
};

export { getAllByCourse, getById, create, update, remove };
