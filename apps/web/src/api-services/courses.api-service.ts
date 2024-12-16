import { Course } from "../models/course.model";

export async function fetchCourses() {
  const res = await fetch('http://localhost:3000/api/courses');
  return res.json() as Promise<Course[]>;
};

// export const fetchCourses = async (): Promise<Course[]> => {
//   const response = await fetch('/api/courses');
//   const data = await response.json();
//   return data;
// };