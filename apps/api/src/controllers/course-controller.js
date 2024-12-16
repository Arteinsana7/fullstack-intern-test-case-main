const courseService = require("../services/course-service");

/**
 * List courses
 */
const list = async (_req, res, next) => {
  try {
    // Fetch all courses, including their description
    const courses = await courseService.getAll();
    res.status(200).json(courses);
  } catch (err) {
    return next(err);
  }
};

/**
 * Get a specific course
 */
const get = async (req, res, next) => {
  try {
    // Fetch a specific course by its ID, including description
    const course = await courseService.getById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    return next(err);
  }
};

/**
 * Create a course
 */
const create = async (req, res, next) => {
  try {
    // Validate that the request body contains necessary fields, including description
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // Create a new course with the provided details
    const course = await courseService.create(req.body);

    res.status(201).json(course);
  } catch (err) {
    return next(err);
  }
};

/**
 * Update a course
 */
const update = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const partialCourse = req.body;

    if (!partialCourse.title && !partialCourse.description) {
      return res.status(400).json({
        message:
          "At least one field (title or description) must be provided for update",
      });
    }

    // Update the course with the given ID using the provided data
    const course = await courseService.update(courseId, partialCourse);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    return next(err);
  }
};

/**
 * Remove a course
 */
const remove = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // Remove the course by its ID
    const deletedCourse = await courseService.remove(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(204).json(); // No content after successful deletion
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
