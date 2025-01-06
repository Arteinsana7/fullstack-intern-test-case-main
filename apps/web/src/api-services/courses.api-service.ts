import { Course, Question } from "../models/course.model";

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
  const res = await fetch(`http://localhost:3000/api/courses/code/${code}`); // Correct URL for fetching by code
  if (!res.ok) {
    throw new Error('Course not found');
  }
  const courseData = await res.json();
  console.log('Fetched course data:', courseData); // Log data for debugging
  return courseData;
}

// Update a course by its ID
export async function updateCourse(courseId: string, updatedCourseData: Partial<Course>): Promise<Course> {
  const res = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedCourseData),
  });

  if (!res.ok) {
    throw new Error('Failed to update the course');
  }

  return await res.json();
}

// Update a question in a specific course by questionId and courseId
export async function updateQuestion(courseId: string, questionId: string, updatedQuestionData: Partial<Question>): Promise<Question> {
  try {
    const res = await fetch(`http://localhost:3000/api/courses/${courseId}/questions/${questionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedQuestionData),
    });

    if (!res.ok) {
      const errorDetails = await res.text();
      console.error('Failed to update the question:', errorDetails);
      throw new Error('Failed to update the question');
    }

    return await res.json();
  } catch (error) {
    console.error('Error while updating question:', error);
    throw error;
  }
}

// Create a new course
export async function createCourse(courseData: Omit<Course, '_id'>): Promise<Course> {
  const res = await fetch('http://localhost:3000/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courseData),
  });

  if (!res.ok) {
    throw new Error('Failed to create course');
  }

  return await res.json();
}

// Delete a course by its ID
export async function deleteCourse(courseId: string): Promise<void> {
  const res = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete course');
  }
}

// Delete a question by its ID
export async function deleteQuestion(questionId: string): Promise<void> {
  const res = await fetch(`http://localhost:3000/api/questions/${questionId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete question');
  }
}
