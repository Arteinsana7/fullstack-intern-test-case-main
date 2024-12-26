const CourseModel = require("../db/models/course-model");

/**
 * Retrieve the list of all courses
 * @returns {Promise<Array<Course>>}
 */
const getAll = () => {
  // Find all courses and rename '_id' to 'id'
  return CourseModel.find({})
    .select("_id title description code")
    .then((courses) =>
      courses.map((course) => ({
        id: course._id, // MongoDB _id renamed to 'id'
        code: course.code, // Human-readable course code
        title: course.title,
        description: course.description,
      }))
    );
};

/**
 * Search for courses by code or title
 * @param {String} query Search query
 * @returns {Promise<Array<Course>>}
 */
const search = async (query) => {
  // Case-insensitive regex to search in both 'code' and 'title'
  const regex = new RegExp(query, "i");

  const courses = await CourseModel.find({
    $or: [{ code: regex }, { title: regex }], // Match either code or title
  }).select("_id title description code");

  return courses.map((course) => ({
    id: course._id, // MongoDB _id renamed to 'id'
    code: course.code, // Human-readable course code
    title: course.title,
    description: course.description,
  }));
};

/**
 * Retrieve a course by its ID
 * @param {String} courseId Course ID
 * @returns {Promise<Course>}
 */
const getById = (courseId) => {
  return CourseModel.findById(courseId)
    .select("_id title description code")
    .then((course) => {
      if (!course) return null;
      return {
        id: course._id, // MongoDB _id renamed to 'id'
        code: course.code, // Human-readable course code
        title: course.title,
        description: course.description,
      };
    });
};

/**
 * Retrieve a course by its code
 * @param {String} courseCode
 * @returns {Promise<Course>}
 */
const getByCode = (courseCode) => {
  return CourseModel.findOne({ code: courseCode })
    .select("_id title description code")
    .then((course) => {
      if (!course) return null;
      return {
        id: course._id, // MongoDB _id renamed to 'id'
        code: course.code, // Human-readable course code
        title: course.title,
        description: course.description,
      };
    });
};

/**
 * Create a new course
 * @param {Course} course
 * @returns {Promise<Course>}
 */
const create = async (course) => {
  const newCourse = new CourseModel({
    ...course,
  });

  // Automatically save the course
  const savedCourse = await newCourse.save();
  return {
    id: savedCourse._id, // MongoDB _id renamed to 'id'
    code: savedCourse.code,
    title: savedCourse.title,
    description: savedCourse.description,
  };
};

/**
 * Update a course
 * @param {String} courseId
 * @param {Object} partialCourse
 * @returns {Promise<Course>}
 */
const update = async (courseId, partialCourse) => {
  const { code, ...allowedUpdates } = partialCourse;

  if (code) {
    console.warn("Attempted to update 'code', which is not allowed.");
  }

  const updatedCourse = await CourseModel.findByIdAndUpdate(
    courseId,
    { $set: allowedUpdates },
    { new: true } // Return the updated document
  );

  if (!updatedCourse) return null;

  return {
    id: updatedCourse._id, // MongoDB _id renamed to 'id'
    code: updatedCourse.code,
    title: updatedCourse.title,
    description: updatedCourse.description,
  };
};

/**
 * Delete a course
 * @param {String} courseId
 */
const remove = async (courseId) => {
  return await CourseModel.findByIdAndDelete(courseId);
};

module.exports = {
  getAll,
  search,
  getById,
  getByCode,
  create,
  update,
  remove,
};
