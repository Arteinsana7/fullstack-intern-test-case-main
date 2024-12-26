const express = require("express");

const router = express.Router();

const courseController = require("../controllers/course-controller");

/**
 * Retrieve the list of all courses
 */
router.get("/api/courses", (req, res, next) => {
  courseController.list(req, res, next);
});

/**
 * Search for courses by code or title
 */
router.get("/api/courses/search", (req, res, next) => {
  courseController.search(req, res, next);
});

/**
 * Get a specific course by its code
 */
router.get("/api/courses/code/:courseCode", (req, res, next) => {
  courseController.getByCode(req, res, next);
});

/**
 * Create a new course
 */
router.post("/api/courses", (req, res, next) => {
  courseController.create(req, res, next);
});

/**
 * Update a course by its code
 */
router.patch("/api/courses/code/:courseCode", (req, res, next) => {
  courseController.updateByCode(req, res, next);
});

/**
 * Delete a course by its code
 */
router.delete("/api/courses/code/:courseCode", (req, res, next) => {
  courseController.removeByCode(req, res, next);
});

module.exports = router;
