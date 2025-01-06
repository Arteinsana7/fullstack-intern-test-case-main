// Define the Question type
export type Question = {
  id: string;  // The unique identifier for each question
  title: string;  // The question's title or text
  choices?: { text: string, isCorrect: boolean }[];
};

// Define the Course type, updating questions to be an array of Question
export type Course = {
  _id: string;  // Unique identifier for the course
  code: string;  // Human-readable code for the course
  title: string;  // The title of the course
  description: string;  // Description of the course
  questions: Question[];  // Array of questions for the course
};
