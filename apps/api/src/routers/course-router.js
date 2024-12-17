import express from "express";
import {
  list,
  search,
  get,
  create,
  update,
  remove,
} from "../controllers/course-controller.js";

const router = express.Router();

/**
 * Retrieve the list of all courses
 */
router.get("/api/courses", (req, res, next) => list(req, res, next));

/**
 * Search for courses by code or title
 */
router.get("/api/courses/search", (req, res, next) => search(req, res, next));

/**
 * Get a specific course by its ID
 */
router.get("/api/courses/:courseId", (req, res, next) => get(req, res, next));

/**
 * Create a new course
 */
router.post("/api/courses", (req, res, next) => create(req, res, next));

/**
 * Update a course by its ID
 */
router.patch("/api/courses/:courseId", (req, res, next) =>
  update(req, res, next)
);

/**
 * Delete a course by its ID
 */
router.delete("/api/courses/:courseId", (req, res, next) =>
  remove(req, res, next)
);

export default router;
