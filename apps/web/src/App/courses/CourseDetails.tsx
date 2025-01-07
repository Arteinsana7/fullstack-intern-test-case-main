
import { useState, useEffect } from 'react';
import { Spin, Typography, Divider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseByCode, updateQuestion } from '../../api-services/courses.api-service';
import { Course, Question } from '../../models/course.model';
import { BackButton } from './components/BackButton';
import { QuestionTable } from './components/QuestionTable';
import EditQuestionModal from './components/EditQuestionModal';
import { ExerciseModal } from './components/ExerciseModal';
import * as S from './CourseDetails.styles';

const { Title, Paragraph } = Typography;

export const CourseDetails = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [exerciseQuestion, setExerciseQuestion] = useState<Question | null>(null);

  // Fetch course data based on code
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await fetchCourseByCode(code || ''); // Fetch the course by its code
        setCourse(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [code]);

  // Handle opening the question edit modal
  const handleEditQuestion = (questionId: string) => {
    const question = course?.questions.find((q) => q.id === questionId) || null;
    setEditingQuestion(question);
  };

  // Handle saving the updated question
  const handleSaveQuestion = async (updatedFields: Partial<Question>) => {
    if (!course || !editingQuestion) return;

    try {
      // Call API to save changes
      await updateQuestion(course._id, editingQuestion.id, updatedFields);

      // Update the state locally
      const updatedQuestions = course.questions.map((q) =>
        q.id === editingQuestion.id ? { ...q, ...updatedFields } : q
      );
      setCourse({ ...course, questions: updatedQuestions });

      // Close the edit modal
      setEditingQuestion(null);
    } catch (err) {
      console.error('Failed to save question:', err);
    }
  };

  // Handle opening the exercise modal for students
  const handleExercise = (questionId: string) => {
    const question = course?.questions.find((q) => q.id === questionId) || null;
    setExerciseQuestion(question);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <S.Wrapper>
      <BackButton navigate={navigate} />
      <S.DetailCard>
        <Title level={2}>{course.title}</Title>
        <Paragraph>
          <strong>Code:</strong> {course.code}
        </Paragraph>
        <Paragraph>
          <strong>Description:</strong> {course.description}
        </Paragraph>
        <Divider />
        <Title level={4}>Questions</Title>

        {/* Render questions if available, otherwise display a message */}
        {course.questions.length > 0 ? (
          <QuestionTable
            questions={course.questions}
            onEdit={handleEditQuestion} // Trigger the edit modal
            onExercise={handleExercise} // Trigger the exercise modal
          />
        ) : (
          <Paragraph>No questions available</Paragraph>
        )}
      </S.DetailCard>

      {/* Edit Question Modal for Teachers */}
      {editingQuestion && (
        <EditQuestionModal
          isOpen={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={handleSaveQuestion}
          question={editingQuestion}
        />
      )}

      {/* Exercise Modal for Students */}
      {exerciseQuestion && (
        <ExerciseModal
          isOpen={!!exerciseQuestion}
          onClose={() => setExerciseQuestion(null)}
          question={exerciseQuestion}
        />
      )}
    </S.Wrapper>
  );
};
