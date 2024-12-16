export type Course = {
  _id: string;          
  code: string;         // New code field for the human-readable identifier
  title: string;        
  description: string;  // Description of the course
  questions: unknown;   
};