import CourseModel from "../db/models/course-model.js"; //  ESM import for the Course model

/**
 * Retrieve the list of all courses
 * @returns {Promise<Array<Object>>}
 */
const getAll = async () => {
  // Find all courses and rename '_id' to 'id'
  const courses = await CourseModel.find({}).select(
    "_id title description code"
  );

  return courses.map((course) => ({
    id: course._id.toString(), // MongoDB _id renamed to 'id'
    code: course.code, // Human-readable course code
    title: course.title,
    description: course.description,
  }));
};

/**
 * Search for courses by code or title
 * @param {String} query Search query
 * @returns {Promise<Array<Object>>}
 */
const search = async (query) => {
  // Case-insensitive regex to search in both 'code' and 'title'
  const regex = new RegExp(query, "i");

  const courses = await CourseModel.find({
    $or: [{ code: regex }, { title: regex }], // Match either code or title
  }).select("_id title description code");

  return courses.map((course) => ({
    id: course._id.toString(),
    code: course.code,
    title: course.title,
    description: course.description,
  }));
};

/**
 * Retrieve a course by its ID
 * @param {String} courseId Course ID
 * @returns {Promise<Object | null>}
 */
const getById = async (courseId) => {
  const course = await CourseModel.findById(courseId).select(
    "_id title description code"
  );

  if (!course) return null;

  return {
    id: course._id.toString(),
    code: course.code,
    title: course.title,
    description: course.description,
  };
};

/**
 * Retrieve a course by its code
 * @param {String} courseCode
 * @returns {Promise<Object | null>}
 */
const getByCode = async (courseCode) => {
  const course = await CourseModel.findOne({ code: courseCode }).select(
    "_id title description code"
  );

  if (!course) return null;

  return {
    id: course._id.toString(),
    code: course.code,
    title: course.title,
    description: course.description,
  };
};

/**
 * Create a new course
 * @param {Object} course
 * @returns {Promise<Object>}
 */
const create = async (course) => {
  const newCourse = new CourseModel(course);

  const savedCourse = await newCourse.save();
  return {
    id: savedCourse._id.toString(),
    code: savedCourse.code,
    title: savedCourse.title,
    description: savedCourse.description,
  };
};

/**
 * Update a course
 * @param {String} courseId
 * @param {Object} partialCourse
 * @returns {Promise<Object | null>}
 */
const update = async (courseId, partialCourse) => {
  const { code, ...allowedUpdates } = partialCourse;

  const updatedCourse = await CourseModel.findByIdAndUpdate(
    courseId,
    { $set: allowedUpdates },
    { new: true } // Return the updated document
  );

  if (!updatedCourse) return null;

  return {
    id: updatedCourse._id.toString(),
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
  await CourseModel.findByIdAndDelete(courseId);
};

export { getAll, search, getById, getByCode, create, update, remove };
