const courseService = require("../services/course-service");

/**
 * List all courses
 */
const list = async (_req, res, next) => {
  try {
    const courses = await courseService.getAll();
    res.status(200).json(courses);
  } catch (err) {
    return next(err);
  }
};

/**
 * Search for courses by code or title
 */
const search = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const courses = await courseService.search(query);
    res.status(200).json(courses);
  } catch (err) {
    return next(err);
  }
};

/**
 * Get a specific course by its code
 */
const getByCode = async (req, res, next) => {
  try {
    const course = await courseService.getByCode(req.params.courseCode);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    return next(err);
  }
};

/**
 * Create a new course
 */
const create = async (req, res, next) => {
  try {
    const course = await courseService.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    return next(err);
  }
};

/**
 * Update an existing course by its code
 */
const updateByCode = async (req, res, next) => {
  try {
    // Resolve code to _id
    const course = await courseService.getByCode(req.params.courseCode);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updatedCourse = await courseService.update(course.id, req.body);
    res.status(200).json(updatedCourse);
  } catch (err) {
    return next(err);
  }
};

/**
 * Remove a course by its code
 */
const removeByCode = async (req, res, next) => {
  try {
    // Resolve code to _id
    const course = await courseService.getByCode(req.params.courseCode);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await courseService.remove(course.id);
    res.status(204).json();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  list,
  search,
  getByCode,
  create,
  updateByCode,
  removeByCode,
};
