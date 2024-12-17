const courseService = require("../services/course-service");

/**
 * List courses
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
 * Get a specific course
 */
const get = async (req, res, next) => {
  try {
    const course = await courseService.getById(req.params.courseId);

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
    const course = await courseService.update(req.params.courseId, req.body);

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
    await courseService.remove(req.params.courseId);

    res.status(204).json();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  list,
  search, // New method added to the export, step 4
  get,
  create,
  update,
  remove,
};
