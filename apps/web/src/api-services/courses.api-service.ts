import { Course } from "../models/course.model";

// Fetch all courses
export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch('http://localhost:3000/api/courses');
  if (!res.ok) {
    throw new Error('Failed to fetch courses');
  }
  return res.json();
}

// Fetch a course by its code
export async function fetchCourseByCode(code: string): Promise<Course> {
  const res = await fetch(`http://localhost:3000/api/courses/code/${code}`); // Corrected URL
  if (!res.ok) {
    throw new Error('Course not found');
  }
  const courseData = await res.json();
  console.log('Fetched course data:', courseData); // Log data for debugging
  return courseData;
}
